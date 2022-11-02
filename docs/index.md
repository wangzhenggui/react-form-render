```jsx
import React, { useState, useEffect } from 'react';
import { FormRender } from 'form-render-components';
import {
  ApaasRadio,
  ApaasInput,
  ApaasTextArea,
  ApaasCheckbox,
  ApaasSelect,
  ApaasProvince,
  TradeId,
  BuyerNick,
  ReceiverMobile,
  ExpressLogistics,
  ApaasMultipleSelect,
  ApaasDate,
  ApaasUpload,
  ApaasSlider,
  ApaasCascader,
  Remark,
} from '@raycloud-apaas-fe-setup/meta-form-components';

const InputSchema = {
  id: 'input123456789',
  title: '输入框',
  type: 'string',
  widgetType: 'basics',
  default: '34435454',
  component: 'ApaasInput', // 前端需要使用字段，和我们目前组件库形成一一对应
  props: {},
  rules: [
    {
      type: 'required',
      validate: {
        type: 'valueType',
        value: true,
      },
      message: '必填',
    },
  ],
  relationEvents: [
    // {
    //   eventType: 'onFocus',
    //   eventId: 'a',
    //   params: {
    //     a: '12345',
    //   },
    // },
  ],
};

const TextAreaSchema = {
  id: 'apaasTextAreaxxxxxx',
  title: '文本框',
  type: 'string',
  widgetType: 'basics',
  default: '34435454',
  component: 'ApaasTextArea', // 前端需要使用字段，和我们目前组件库形成一一对应
  props: {
    disabled: '{{state.input123456789}}',
  },
  rules: [
    {
      type: 'required',
      validate: {
        type: 'valueType',
        value: true,
      },
    },
  ],
};

const RadioSchema = {
  id: 'radio123456789',
  title: '单选',
  widgetType: 'basics',
  default: { label: '其他123', value: -1 },
  type: 'object',
  properties: {
    label: {
      title: '键',
      type: 'string',
    },
    value: {
      title: '值',
      type: 'string',
    },
  },
  component: 'ApaasRadio', // 前端需要使用字段，和我们目前组件库形成一一对应
  props: {
    // 前端组件属性配置，服务端不需要解析
    options: [
      { label: '1', value: '1' },
      { label: '其他', value: -1 },
    ],
    horizontal: true,
  },
  relationEvents: [],
  rules: [
    {
      type: 'required',
      validate: {
        type: 'validateType',
        value: 'radioRequiredValidate',
      },
    },
  ],
};

const CheckboxSchema = {
  id: 'checkbox123456789',
  title: '多选',
  type: 'item',
  items: {
    type: 'object',
    properties: {
      label: {
        title: '键',
        type: 'string',
      },
      value: {
        title: '值',
        type: 'string',
      },
    },
  },
  widgetType: 'basics',
  default: [{ label: '1', value: '1' }],
  component: 'ApaasCheckbox', // 前端需要使用字段，和我们目前组件库形成一一对应
  props: {
    // 前端组件属性配置，服务端不需要解析
    options: [
      { label: '1', value: '1' },
      { label: '2', value: '2' },
      { label: '其他', value: -1 },
    ],
    horizontal: true,
  },
  relationEvents: [],
  rules: [
    {
      type: 'required',
      validate: {
        type: 'valueType',
        value: true,
      },
    },
  ],
};

const SelectSchema = {
  id: 'select123456789',
  title: '下拉单选',
  type: 'object',
  widgetType: 'basics',
  default: '1',
  properties: {
    label: {
      title: '键',
      type: 'string',
    },
    value: {
      title: '值',
      type: 'string',
    },
  },
  component: 'ApaasSelect', // 前端需要使用字段，和我们目前组件库形成一一对应
  props: {
    // 前端组件属性配置，服务端不需要解析
    options: [
      { label: '1', value: '1' },
      { label: '2', value: '2' },
    ],
  },
  relationEvents: [],
  rules: [
    {
      type: 'required',
      validate: {
        type: 'validateType',
        value: 'radioRequiredValidate',
      },
    },
  ],
};

const ProvinceSchema = {
  id: 'ADDRESS123456789',
  title: '省市区',
  type: 'array',
  widgetType: 'basics',
  default: [],
  properties: {
    label: {
      title: '键',
      type: 'string',
    },
    value: {
      title: '值',
      type: 'string',
    },
  },
  component: 'ApaasProvince', // 前端需要使用字段，和我们目前组件库形成一一对应
  props: {
    // 前端组件属性配置，服务端不需要解析
    options: '{{store.address}}',
  },
  relationEvents: [
    {
      eventType: 'onInit',
      eventId: 'initAddress',
    },
  ],
  rules: [
    {
      type: 'required',
      validate: {
        type: 'validateType',
        value: 'requiredValidate',
      },
    },
  ],
};

const ApaasMultipleSelectSchema = {
  id: 'MultipleSelect',
  title: '多选',
  type: 'item',
  items: {
    type: 'object',
    properties: {
      label: {
        title: '键',
        type: 'string',
      },
      value: {
        title: '值',
        type: 'string',
      },
    },
  },
  widgetType: 'basics',
  default: [{ label: '1', value: '1' }],
  component: 'ApaasMultipleSelect', // 前端需要使用字段，和我们目前组件库形成一一对应
  props: {
    // 前端组件属性配置，服务端不需要解析
    options: [
      { label: '1', value: '1' },
      { label: '2', value: '2' },
      { label: '3', value: '3' },
    ],
  },
  relationEvents: [],
  rules: [
    {
      type: 'required',
      validate: {
        type: 'valueType',
        value: true,
      },
    },
  ],
};

const DataSchema = {
  id: 'data111111',
  title: '日期',
  type: 'string',
  widgetType: 'basics',
  default: '',
  component: 'ApaasDate', // 前端需要使用字段，和我们目前组件库形成一一对应
  props: {
    // 前端组件属性配置，服务端不需要解析
    dateType: 'DATE',
  },
  rules: [
    {
      type: 'required',
      validate: {
        type: 'valueType',
        value: true,
      },
    },
  ],
};

const DataRangeSchema = {
  id: 'dataRange111111',
  title: '时间范围',
  type: 'range',
  widgetType: 'basics',
  default: [],
  component: 'ApaasDate', // 前端需要使用字段，和我们目前组件库形成一一对应
  props: {
    // 前端组件属性配置，服务端不需要解析
    dateType: 'DATE_RANGE',
  },
  rules: [
    {
      type: 'required',
      validate: {
        type: 'valueType',
        value: true,
      },
    },
  ],
};

const PictureSchema = {
  id: 'picturexxxx',
  title: '图片选择',
  type: 'item',
  items: {
    type: 'string',
  },
  widgetType: 'basics',
  default: [],
  component: 'ApaasUpload', // 前端需要使用字段，和我们目前组件库形成一一对应
  props: {},
  rules: [
    {
      type: 'required',
      validate: {
        type: 'valueType',
        value: true,
      },
    },
  ],
};

const SlideSchema = {
  id: 'slide',
  title: '评分',
  type: 'number',
  widgetType: 'basics',
  default: 4,
  component: 'ApaasSlider', // 前端需要使用字段，和我们目前组件库形成一一对应
  props: {},
  rules: [
    {
      type: 'required',
      validate: {
        type: 'valueType',
        value: true,
      },
      message: '必填',
    },
  ],
  relationEvents: [
    // {
    //   eventType: 'onFocus',
    //   eventId: 'a',
    //   params: {
    //     a: '12345',
    //   },
    // },
  ],
};

const CascaderSchema = {
  id: 'cascader',
  title: '多级下拉',
  type: 'object',
  widgetType: 'basics',
  default: {},
  component: 'ApaasCascader', // 前端需要使用字段，和我们目前组件库形成一一对应
  props: {
    options: [
      {
        value: 'zhejiang',
        label: 'Zhejiang',
        children: [
          {
            value: 'hangzhou',
            label: 'Hangzhou',
            children: [
              {
                value: 'xihu',
                label: 'West Lake',
              },
            ],
          },
        ],
      },
      {
        value: 'jiangsu',
        label: 'Jiangsu',
        children: [
          {
            value: 'nanjing',
            label: 'Nanjing',
            children: [
              {
                value: 'zhonghuamen',
                label: 'Zhong Hua Men',
              },
            ],
          },
        ],
      },
    ],
  },
  rules: [
    {
      type: 'required',
      validate: {
        type: 'validateType',
        value: 'requiredValidate',
      },
    },
  ],
  relationEvents: [],
};

const MemoSchema = {
  id: 'memoSchema',
  title: '备注',
  type: 'object',
  widgetType: 'business',
  default: {},
  component: 'Remark',
  props: {
    isShowFlag: true,
  },
  rules: [
    {
      type: 'required',
      validate: {
        type: 'validateType',
        value: 'requiredValidate',
      },
    },
  ],
  relationEvents: [
    {
      eventType: 'onSubmit',
      eventId: 'linkTbOrderRemark',
    },
  ],
};

const ChooseBabySchema = {};
const formFields = [
  InputSchema,
  RadioSchema,
  TextAreaSchema,
  CheckboxSchema,
  SelectSchema,
  ProvinceSchema,
  ApaasMultipleSelectSchema,
  DataSchema,
  DataRangeSchema,
  PictureSchema,
  SlideSchema,
  CascaderSchema,
  MemoSchema,
  {
    id: 'orderId',
    title: '订单号',
    type: 'string',
    widgetType: 'business',
    default: '',
    component: 'TradeId', // 前端需要使用字段，和我们目前组件库形成一一对应
    props: {
      // 前端组件属性配置，服务端不需要解析
    },
    rules: [
      {
        type: 'required',
        validate: {
          type: 'valueType',
          value: true,
        },
        message: '必填',
      },
    ],
    relationEvents: [
      {
        eventType: 'onBlur',
        eventId: 'queryOrder',
        params: {
          a: '12345',
        },
      },
    ],
  },
  {
    id: 'wangwangId',
    title: '买家旺旺',
    type: 'string',
    widgetType: 'business',
    default: '',
    component: 'BuyerNick', // 前端需要使用字段，和我们目前组件库形成一一对应
    props: {
      // 前端组件属性配置，服务端不需要解析
    },
    rules: [
      {
        type: 'required',
        validate: {
          type: 'valueType',
          value: true,
        },
        message: '必填',
      },
    ],
    relationEvents: [],
  },
  {
    id: 'phone',
    title: '收件人手机号',
    type: 'string',
    widgetType: 'business',
    default: '',
    component: 'ReceiverMobile', // 前端需要使用字段，和我们目前组件库形成一一对应
    props: {
      // 前端组件属性配置，服务端不需要解析
    },
    rules: [
      {
        type: 'required',
        validate: {
          type: 'valueType',
          value: true,
        },
        message: '必填',
      },
      {
        type: 'regExp',
        validate: {
          type: 'valueType',
          value: '^1[3456789]\\d{9}$',
        },
        message: '请输入正确的手机号码格式',
      },
    ],
    relationEvents: [],
  },
  {
    id: 'logistics',
    title: '快递物流',
    type: 'object',
    widgetType: 'business',
    default: '',
    component: 'ExpressLogistics', // 前端需要使用字段，和我们目前组件库形成一一对应
    props: {
      // 前端组件属性配置，服务端不需要解析
      options: '{{store.express}}',
      showField: 'all',
    },
    rules: [
      {
        type: 'required',
        validate: {
          type: 'valueType',
          value: true,
        },
        message: '必填',
        field: 'company',
      },
      {
        type: 'required',
        validate: {
          type: 'valueType',
          value: true,
        },
        message: '必填',
        field: 'order',
      },
    ],
    relationEvents: [
      {
        eventType: 'onInit',
        eventId: 'initExpress',
      },
    ],
  },
];

const events = `
  export const radioRequiredValidate = async function(_, value) {
    const { isEqual } = this.utils.lodash;
    const { title } = _;
    if(value?.value === undefined) return Promise.reject(title + "必填")
    return Promise.resolve();
  }

  export const requiredValidate = async function(_, value) {
    const { isEqual, isEmpty } = this.utils.lodash;
    const { title } = _;
    if(isEmpty(value)) return Promise.reject(title + "必填")
    return Promise.resolve();
  }

  const transResult = function(list = []) {
    return list.map(item => {
      return {
        label: item.name,
        value: item.code,
        children: transResult(item.childList)
      }
    })
  }
  export const initAddress = async function () {
    const { data } = await this.request.post('/enterprise/gdfw/third/address');
    const finalLevels = transResult(data?.address)
    console.log('this', this)
    this.store.address = finalLevels;
  }

  export const initExpress = async function () {
    const { id } = this.params
    const { data } = await this.request.post('/enterprise/gdfw/third/queryAllDeliveryCompanyInfo');
    const finalExpress = data?.address?.map(item => ({
      label: item?.name,
      value: item?.deliveryCode
    }))
    console.log('finalExpress', finalExpress);
    this.store.express = finalExpress;
    // this.refs[id].current.store.options = finalExpress;
  }
`;
const [formFieldsState, setFormFields] = useState([]);
const [eventsState, setEvents] = useState('');
useEffect(() => {
  setTimeout(() => {
    setEvents(events);
    setFormFields(formFields);
  }, 1000);
}, []);
export default () => (
  <FormRender
    formFields={formFieldsState}
    events={eventsState}
    dataSource={[
      {
        name: 'order',
        protocol: 'VARIABLE',
        initValue: { a: true, b: true, id: '999999' },
      },
      {
        name: 'address',
        protocol: 'VARIABLE',
        initValue: [],
      },
      {
        name: 'express',
        protocol: 'VARIABLE',
        initValue: [],
      },
    ]}
    widgets={{
      ApaasRadio,
      ApaasInput,
      ApaasTextArea,
      ApaasCheckbox,
      ApaasSelect,
      ApaasProvince,
      TradeId,
      BuyerNick,
      ReceiverMobile,
      ExpressLogistics,
      ApaasMultipleSelect,
      ApaasDate,
      ApaasUpload,
      ApaasSlider,
      ApaasCascader,
      Remark,
    }}
  />
);
```
