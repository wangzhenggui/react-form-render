```jsx
import React, { useState, useEffect } from 'react';
import { FormRender } from 'form-render-components';
import { Input, Select } from 'antd';

const InputSchema = {
  id: 'input_1',
  title: '输入框',
  type: 'string',
  default: '输入框默认值',
  component: 'Input', // 前端需要使用字段，和我们目前组件库形成一一对应
  props: {},
  rules: [],
  relationEvents: [
    {
      eventType: 'onBlur',
      eventId: 'initDeliveryCompanyInfoList',
    },
  ],
};

const Input2Schema = {
  id: 'input_2',
  title: '输入框',
  type: 'string',
  default: '输入框默认值2',
  component: 'Input', // 前端需要使用字段，和我们目前组件库形成一一对应
  props: {},
  required: '{{state.input_1}}',
  disabled: '{{state.input_1}}',
  hidden: '{{state.input_1}}',
  // visible: '{{state.input_1}}',
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
};

const SelectSchema = {
  id: 'select_2',
  title: '快递物流',
  type: 'string',
  default: '',
  component: 'Select', // 前端需要使用字段，和我们目前组件库形成一一对应
  props: {
    options: '{{store.address}}',
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
};

const ChooseBabySchema = {};
const formFields = [InputSchema, Input2Schema, SelectSchema];

const events = `
  const transResult = function(list = []) {
    return list.map(item => {
      return {
        label: item.name,
        value: item.cpCode
      }
    })
  }
  export const initDeliveryCompanyInfoList = async function () {
    const { data } = await this.request.post('/tianwen/print/queryAllDeliveryCompanyInfo');
    const finalLevels = transResult(data?.deliveryCompanyInfoList)
    console.log('this', this)
    this.store.address = finalLevels;
  }
`;
const [formFieldsState, setFormFields] = useState([]);
const [eventsState, setEvents] = useState('');
useEffect(() => {
  setTimeout(() => {
    setEvents(events);
    setFormFields(formFields);
  }, 100);
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
      Input,
      Select,
    }}
  />
);
```
