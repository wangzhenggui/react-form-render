/*
 * @Author: wangzhenggui jianjia.wzg@raycloud.com
 * @Date: 2022-07-13 14:28:54
 * @LastEditors: wangzhenggui jianjia.wzg@raycloud.com
 * @LastEditTime: 2022-08-12 16:46:26
 * @FilePath: /form-render-components/src/FormRender/validate.ts
 * @Description:
 *
 * Copyright (c) 2022 by wangzhenggui jianjia.wzg@raycloud.com, All Rights Reserved.
 */
import instance from './instance';
import { Rule, RuleType, ValidateEnum } from './type';

const getValidatorFn =
  (value: string, title: string) => async (_: any, p: any) => {
    // 事件包裹
    const fn = instance?.methods[value]
      ? instance?.methods[value]
      : () => {
          console.warn('校验规则在事件中未定义');
          return Promise.reject(
            new Error('校验规则在事件中未定义,请检查Schema和事件中心'),
          );
        };
    return await fn(
      {
        ..._,
        title,
      },
      p,
    );
  };

const getRule = (
  type: RuleType,
  validateType: ValidateEnum,
  value: string,
  title: string,
) => {
  if (validateType === ValidateEnum.VALIDATE_TYPE) {
    if (type === RuleType.REQUIRED) {
      return {
        required: true,
        validator: getValidatorFn(value, title),
      };
    }
    return {
      validator: getValidatorFn(value, title),
    };
  }
  if (type === RuleType.REGEXP) {
    return {
      pattern: new RegExp(value),
    };
  }
  return {
    [type]: value,
  };
};

export const validate = (rule: Rule, title: string) => {
  const { type, validate } = rule;
  if (!type) {
    console.warn('校验规则缺少type字段');
    return rule;
  }
  const { type: validateType, value } = validate;
  const transRules = getRule(type, validateType, value, title);
  const {
    type: removeType,
    validate: removeValidate,
    ...removeTypeRule
  } = rule;
  return {
    ...removeTypeRule,
    ...transRules,
  };
};
