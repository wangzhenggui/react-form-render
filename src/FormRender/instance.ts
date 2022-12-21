/*
 * @Author: wangzhenggui jianjia.wzg@raycloud.com
 * @Date: 2022-07-12 11:07:32
 * @LastEditors: wangzhenggui jianjia.wzg@raycloud.com
 * @LastEditTime: 2022-11-02 22:11:52
 * @FilePath: /react-form-render/src/FormRender/instance.ts
 * @Description:
 *
 * Copyright (c) 2022 by wangzhenggui jianjia.wzg@raycloud.com, All Rights Reserved.
 */
import request from 'umi-request';
import { get } from 'lodash';
import lodash from 'lodash';
import { FormInstance } from 'antd';
import { transFormJsCode } from '@raycloud-apaas-fe-setup/apaas-parser';
import { makeAutoObservable } from 'mobx';
import { WidgetTypeEnum, Field, EventType } from './type';

class Instance {
  request: typeof request;
  methods: any;
  form: any;
  params: any;
  utils: any;
  schema: Field[];
  refs: {
    [props: string]: React.Ref<any>;
  };
  private dataSource: any;
  submitQueue: any[];
  store: any;
  state: any;
  constructor() {
    this.request = request;
    this.refs = {};
    this.schema = [];
    this.utils = {
      // 根据id查组件实例对象
      getFieldById: (id: string) => {
        return get(this.refs, id);
      },
      // 根据组件类型查组件实例对象 TODO: 仅限于电商组件和电商组件的查询，基础组件由于一个组件类型会对应多个id，暂时不支持查询
      // 这个方法调用时注意非空校验
      getFieldsByType: (type: string) => {
        const componentSchema = this.schema.filter((i) => i.component === type);
        if (componentSchema?.length === 0) {
          console.warn(`当前Schema中不存在${type}类型的组件`);
          return null;
        }
        if (
          componentSchema?.length > 1 ||
          (componentSchema?.length === 1 &&
            componentSchema[0].widgetType === WidgetTypeEnum.BASICS)
        ) {
          console.warn('不支持基础组件类型查询');
          return null;
        }
        return get(this.refs, componentSchema[0].id, null);
      },
      getSchema: () => this.schema,
      lodash,
    };
    this.params = {}; // 函数执行时，默认参数放在此处保存
    this.submitQueue = [];
    this.dataSource = makeAutoObservable({
      state: {},
      store: {},
    });
    this.state = this.dataSource.state;
    this.store = this.dataSource.store;
  }

  /**
   * 初始化函数，并绑定this为当前实例对象
   * @returns {}
   */
  initMethods(code: string) {
    if (code) {
      const _self = this;
      const methods = transFormJsCode({})(code);
      const bindScopeMethods: any = {};
      Object.keys(methods).map((methodName) => {
        if (typeof methods[methodName] === 'function') {
          bindScopeMethods[methodName] = methods[methodName].bind(_self);
        }
      });
      this.methods = bindScopeMethods;
      return;
    }
    this.methods = {};
  }

  addRef(id: string, curRef: React.Ref<any>) {
    this.refs[id] = curRef;
  }

  findSubmitQueueInSchema() {
    this.submitQueue = [];
    this.schema.map((item: Field) => {
      const submitEvent = item?.relationEvents?.filter(
        (i) => i.eventType === EventType.SUBMIT,
      );
      const fns =
        submitEvent?.map((i) => {
          return () => {
            // 将默认参数，组件调用id传入到事件执行的事件中
            this.setParams({ ...i.params, id: item.id });
            this.methods[i.eventId] &&
              this.methods[i.eventId].call(this, ...arguments);
            this.setParams(null);
          };
        }) || [];
      this.submitQueue.push(...fns);
    });
  }

  /**
   * 设置Schema
   */
  setSchema(schema: any[]) {
    this.schema = schema;
    // 设置我们的提交事件队列
    this.findSubmitQueueInSchema();
  }
  /**
   *
   * @param form 设置form对象
   */
  setForm(form: FormInstance<any>) {
    this.form = form;
  }

  // 设置参数
  setParams(params: any) {
    this.params = params;
  }
}

const instance = new Instance();
// @ts-ignore
window.instance = instance;
export default instance;
