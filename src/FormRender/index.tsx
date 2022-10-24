import React, {
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from 'react';
import { Form, FormProps } from 'antd';
import { observer } from 'mobx-react-lite';
import { get, groupBy, isEmpty } from 'lodash';
import instance from './instance';
import { validate } from './validate';
import { Rule } from './type';
import FieldInput from '../Field';
import useInit from '../hooks/useInit';
import useMount from '../hooks/useMount';
import { parseApis, parseExpression } from './parserApi';
import { Env, StateInterface, RuleType } from './type';
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
  env: Env;
  dataSource: StateInterface[];
  widgets: WidgetType;
  formProps?: FormProps;
};

export type ElementProps = {
  item: FieldProps;
  onChange?: (p: any) => void;
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

const Element = observer(
  ({ item, onChange, value, subRules, widgets }: ElementProps) => {
    const Field = get(widgets, item.component);
    const events = initEvent(item?.relationEvents || [], item.id);
    useInit(events?.onInit); // onInit 事件,在组件加载的时候触发一次
    const handleChange = (val: any) => {
      onChange && onChange(val); // Antd Form的双向绑定
      if (events?.onChange) {
        // 组件自定义onChange事件
        events.onChange(val);
      }
    };
    const rules = groupBy(subRules, 'field');
    const ref = useRef();
    instance.addRef(item.id, ref);
    const transProps = parseExpression(item.props, instance.state);
    console.debug('transProps', transProps);
    if (Field) {
      return (
        // @ts-ignore
        <Field
          {...events}
          {...transProps}
          onChange={handleChange}
          value={value}
          rules={rules}
          ref={ref}
          id={item.id}
        />
      );
    }
    // FIXME: 这个组件临时测试使用
    if (item.component === 'Field') {
      return (
        <FieldInput
          {...events}
          {...transProps}
          onChange={handleChange}
          value={value}
          rules={rules}
          ref={ref}
        />
      );
    }
    return null;
  },
);

const getFieldItem = (item: FieldProps, widgets: WidgetType, index: number) => {
  const { rules = [], title } = item;
  const { currentRules, subRules } = checkRuleProcessing(rules, title);
  const fieldRequired = checkRequiredByRules(rules);
  return (
    <Form.Item
      name={item.id}
      label={item.title}
      rules={currentRules as any}
      required={fieldRequired}
      data-index={index}
    >
      <Element
        item={item}
        /** @ts-ignore */
        subRules={subRules}
        widgets={widgets}
      />
    </Form.Item>
  );
};

const FormRender = (
  {
    formFields,
    events,
    env,
    dataSource = [],
    widgets,
    formProps,
  }: FormRenderProps,
  ref: React.Ref<any>,
) => {
  const [form] = Form.useForm();
  useMount(() => {
    instance.setReactStore(
      Object.assign(instance.state, get(parseApis(dataSource), 'state', {})),
    );
  });
  useImperativeHandle(ref, () => ({
    form: form,
    submitQueue: instance.submitQueue,
  }));
  useEffect(() => {
    instance.setEnv(env);
  }, [env]);
  useEffect(() => {
    instance.setForm(form);
  }, [form]);
  // 表单初始值采集
  useEffect(() => {
    instance.setSchema(formFields);
    const initFormValue = formFields.reduce((cur: any, nxt) => {
      if (nxt?.default) {
        cur[nxt.id] = nxt.default;
      }
      return cur;
    }, {});
    form.setFieldsValue(initFormValue);
  }, [formFields]);
  useEffect(() => {
    instance.initMethods(events);
  }, [events]);
  return (
    <Form form={form} {...formProps}>
      {formFields.map((item, index) => getFieldItem(item, widgets, index))}
    </Form>
  );
};
export type Rules = Rule;
export default forwardRef(FormRender);
