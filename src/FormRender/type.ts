/*
 * @Author: wangzhenggui jianjia.wzg@raycloud.com
 * @Date: 2022-07-13 19:28:58
 * @LastEditors: wangzhenggui jianjia.wzg@raycloud.com
 * @LastEditTime: 2022-08-16 16:37:20
 * @FilePath: /form-render-components/src/FormRender/type.ts
 * @Description:
 *
 * Copyright (c) 2022 by wangzhenggui jianjia.wzg@raycloud.com, All Rights Reserved.
 */
declare const DateType: ['WEB', 'SINGLE', 'WANGWANG'];
export enum RuleType {
  REQUIRED = 'required',
  ONLY = 'only',
  REPEAT = 'repeat',
  LEN = 'len',
  MIN = 'min',
  MAX = 'max',
  REGEXP = 'regExp',
  VALIDATE = 'validate',
}

export enum EventType {
  CHANGE = 'onChange',
  CLICK = 'onClick',
  BLUR = 'onBlur',
  FOCUS = 'onFocus',
  INIT = 'onInit',
  SUBMIT = 'onSubmit',
}
type Event = {
  eventType: EventType;
  eventId: string;
  params?: any;
};
export type Env = {
  client: typeof DateType[number];
};

export enum WidgetTypeEnum {
  BUSINESS = 'business',
  BASICS = 'basics',
  SPECIAL = 'special',
  THREE = 'three',
}
export enum ValidateEnum {
  VALIDATE_TYPE = 'validateType',
  VALUE_TYPE = 'valueType',
}

export type Rule = {
  type: RuleType;
  validate: {
    type: ValidateEnum;
    value: any;
  };
  // value?: any;
  message?: string;
  field?: string;
  validateTrigger?: string;
  warningOnly?: boolean;
};

export type Field = {
  id: string;
  title: string;
  type: string;
  widgetType: WidgetTypeEnum;
  component: string;
  default: any;
  rules: Rule[];
  props: any;
  relationEvents?: Event[];
};

export enum APIEnum {
  VARIABLE = 'VARIABLE',
}

export interface StateInterface {
  name: string;
  protocol: APIEnum;
  initValue: any;
}

export type ClassObjectType = {
  [prop: string]: any;
};
