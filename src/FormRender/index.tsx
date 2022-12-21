import React, {
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from 'react';
import { Form } from 'antd';
import { observer } from 'mobx-react-lite';
import { get, groupBy, isEmpty } from 'lodash';
import instance from './instance';
import { validate } from './validate';
import { Rule } from './type';
import useInit from '../hooks/useInit';
import useMount from '../hooks/useMount';
import { parseApis } from './parserApi';
import { loopObject } from '../common/util';
import { StateInterface, RuleType } from './type';
import './index.less';

export type EventType = {
  eventType: 'onClick' | 'onChange' | 'onBlur' | 'onFocus';
  eventId: 'string';
  params: any;
};

export type FieldProps = {
  id: string;
  title: string;
  component: string;
  disabled?: boolean;
  required?: boolean;
  props?: any;
  default?: any;
  relationEvents?: EventType[];
  rules?: Rule[];
};

export type WidgetType = {
  [prop: string]: JSX.Element;
};

export type FormRenderProps = {
  formFields: FieldProps[];
  events: string;
  dataSource: StateInterface[];
  widgets: WidgetType;
};

export type ElementProps = {
  item: FieldProps;
  newItem: FieldProps;
  onChange: (p: any) => void;
  value?: any;
  subRules: Rule[];
  widgets: WidgetType;
};

// 事件初始化
const initEvent = (relationEvents: EventType[], id: string) => {
  if (!relationEvents) return [];
  return relationEvents.reduce((prev: any, next: EventType) => {
    prev[next.eventType] = function () {
      // 将默认参数，组件调用id传入到事件执行的事件中
      instance.setParams({ ...next.params, id });
      instance.methods[next.eventId] &&
        instance.methods[next.eventId].call(instance, ...arguments);
      instance.setParams(null);
    };
    return prev;
  }, {});
};

// 校验规则处理
// 区分外层校验和组件内部校验，内部校验，需要组件自己去处理，这里会转换一层
const checkRuleProcessing = (rules: Rule[], title: string) => {
  const processRules = rules.map((rule) => validate(rule, title));
  const currentRules = processRules.filter((rule) => !rule.field);
  const subRules = processRules.filter((rule) => !!rule?.field);
  return {
    currentRules,
    subRules,
  };
};

// 通过rules自动分析当前组件是否需要必填
const checkRequiredByRules = (rules: Rule[]) => {
  if (isEmpty(rules.find((rule) => rule.type === RuleType.REQUIRED))) {
    return false;
  }
  return true;
};

// 收集表单项依赖 找到state.xxx 和 store.xxx这些依赖项
const collectDependance = (item: any) => {
  const stringifyItem = JSON.stringify(item);
  const dependanceStateExpress = stringifyItem.match(/state[.\w]+/g);
  dependanceStateExpress?.map((dep) =>
    console.debug(item.id, get(instance.state, dep.replace('state.', ''))),
  );
  const dependanceStoreExpress = stringifyItem.match(/store[.\w]+/g);
  dependanceStoreExpress?.map((dep) =>
    console.debug(item.id, get(instance.store, dep.replace('store.', ''))),
  );
};
const Element = ({
  item,
  newItem,
  subRules,
  widgets,
  onChange,
}: ElementProps) => {
  const Field = get(widgets, newItem.component);
  const events = initEvent(newItem?.relationEvents || [], newItem.id);
  useInit(events?.onInit); // onInit 事件,在组件加载的时候触发一次
  const handleChange = (val: any) => {
    instance.state[item.id] = val?.target ? val?.target?.value : val;
    onChange(val); // TODO: 这里需要和Antd做双向通信，将值给到Antd Form中，为的是使用antd校验功能
    if (events?.onChange) {
      // 组件自定义onChange事件
      events.onChange(val);
    }
  };
  console.log('newItem.disabled', newItem);
  const rules = groupBy(subRules, 'field');
  const ref = useRef();
  instance.addRef(newItem.id, ref);
  if (Field) {
    return (
      // @ts-ignore
      <Field
        {...events}
        {...newItem.props}
        disabled={newItem.disabled}
        onChange={handleChange}
        value={get(instance, `state.${item.id}`)} // TODO: 通过mobx对表单值进行一次包装，为了可以实现依赖更新加载
        rules={rules}
        ref={ref}
        id={item.id}
      />
    );
  }
  return null;
};

const FormItemHoc = observer(
  ({
    item,
    widgets,
    index,
  }: {
    item: FieldProps;
    widgets: WidgetType;
    index: number;
  }) => {
    const { rules = [], title } = item;
    const { currentRules, subRules } = checkRuleProcessing(rules, title);
    // const fieldRequired = checkRequiredByRules(rules);
    collectDependance(item); // TODO: 这里想要更新，必须手动收集依赖才可以
    const newItem = loopObject(instance)(item);
    if (newItem?.visible) {
      delete instance.state?.[item?.id];
      return null;
    }
    return (
      <Form.Item
        name={item.id}
        label={item.title}
        rules={currentRules as any}
        required={newItem?.required}
        hidden={newItem?.required}
        data-index={index}
      >
        <Element
          item={item}
          newItem={newItem}
          /** @ts-ignore */
          subRules={subRules}
          widgets={widgets}
        />
      </Form.Item>
    );
  },
);

// const getFieldItem = (item: FieldProps, widgets: WidgetType, index: number) => {
//   const { rules = [], title } = item;
//   const { currentRules, subRules } = checkRuleProcessing(rules, title);
//   const fieldRequired = checkRequiredByRules(rules);
//   return (
//     <Form.Item
//       name={item.id}
//       label={item.title}
//       rules={currentRules as any}
//       required={fieldRequired}
//       data-index={index}
//       key={item.id}
//     >
//       <Element
//         item={item}
//         /** @ts-ignore */
//         subRules={subRules}
//         widgets={widgets}
//       />
//     </Form.Item>
//   );
// };

const FormRender = (
  { formFields, events, dataSource = [], widgets }: FormRenderProps,
  ref: React.Ref<any>,
) => {
  const [form] = Form.useForm();
  useMount(() => {
    const store = get(parseApis(dataSource), 'state', {});
    Object.entries(store).map(([key, value]) => {
      instance.store[key] = value;
    });
  });
  useImperativeHandle(ref, () => ({
    form: form,
    submitQueue: instance.submitQueue,
  }));
  useEffect(() => {
    instance.setForm(form);
  }, [form]);
  // 表单初始值采集
  useEffect(() => {
    instance.setSchema(formFields);
    const initFormValue = formFields.reduce((cur: any, nxt) => {
      instance.state[nxt.id] = void 0;
      if (nxt?.default) {
        cur[nxt.id] = nxt.default;
        instance.state[nxt.id] = nxt.default;
      }
      return cur;
    }, {});
    form.setFieldsValue(initFormValue);
  }, [formFields]);
  useEffect(() => {
    instance.initMethods(events);
  }, [events]);
  return (
    <Form form={form}>
      {/* {formFields.map((item, index) => getFieldItem(item, widgets, index))} */}
      {formFields.map((item, index) => (
        <FormItemHoc
          item={item}
          widgets={widgets}
          index={index}
          key={item?.id}
        />
      ))}
    </Form>
  );
};
export type Rules = Rule;
export default forwardRef(FormRender);
