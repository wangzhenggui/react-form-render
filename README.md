## 表单渲染器

### 表单渲染协议

```js
{
  id: 'input123456789', // 字段唯一标识
  title: '输入框', // 组件名称
  type: 'string', // 值类型
  widgetType: 'basics', // 无用字段，后续废弃
  default: '34435454', // 组件默认值
  component: 'ApaasInput', // 组件名称,最终渲染组件
  props: {}, // 组件属性
  rules: [ // 校验规则
    {
      type: 'required',
      validate: {
        type: 'valueType',
        value: true,
      },
      message: '必填',
    },
  ],
  relationEvents: [ // 事件绑定关系
    {
      eventType: 'onBlur', // 目前支持 'onClick' | 'onChange' | 'onBlur' | 'onFocus'
      eventId: 'a',
      params: {
        a: '12345',
      },
    },
  ],
}

```

### 事件中心规则

- 事件需要通过 export 导出
- 事件通过 this 获取环境信息
- this.request 获取远程数据，内嵌了 umi-request 请求库
- this.state 获取表单中字段数据；可以通过 this.state.xxx = xxx 方式修改表单值 禁止使用 this.state = xxx;这种方式对 state 进行赋值操作
- this.store 获取当前上下文环境中其他数据源，包括远程数据源、自定义数据源 禁止使用 this.store = xxx;这种方式对 store 进行赋值操作
- this.utils 包含一些可能用到的常用函数集合,例如获取 schema 信息、lodash 工具包等，后续功能扩展

```js
`
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
```

### 外部数据源

- name 数据源名称
- protocol 数据来源 暂时只支持 VARIABLE 后续可能会将请求测放在数据源中
- initValue 数据源值 只支持 js 基础类型，暂不支持表达式方式

```js
[
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
];
```
