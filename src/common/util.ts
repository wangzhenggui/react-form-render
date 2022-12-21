/*
 * @Author: wangzhenggui jianjia.wzg@raycloud.com
 * @Date: 2022-10-31 13:55:22
 * @LastEditors: wangzhenggui jianjia.wzg@raycloud.com
 * @LastEditTime: 2022-11-02 22:02:18
 * @FilePath: /react-form-render/src/common/util.ts
 * @Description:
 *
 * Copyright (c) 2022 by wangzhenggui jianjia.wzg@raycloud.com, All Rights Reserved.
 */
import isObjectLike from 'lodash/isObjectLike';
import isString from 'lodash/isString';
import flowRight from 'lodash/flowRight';

const EXPRESSION_REG = /{{([\w\W]+)}}/g;
const STATE_REG = /state([\.\w]+)/g;
const STORE_REG = /store([\.\w]+)/g;

const matchExpression = (expression: string) => EXPRESSION_REG.test(expression);

const replaceParentheses = (content: string) =>
  content.replace(EXPRESSION_REG, (match, p1) => p1);
const replaceState = (content: string) =>
  content.replace(STATE_REG, (match, p1) => 'scope.state' + p1);
const replaceStore = (content: string) =>
  content.replace(STORE_REG, (match, p1) => 'scope.store' + p1);
const replaceExpression = flowRight(
  replaceParentheses,
  replaceStore,
  replaceState,
);

export const loopObject = (dataSource: any) => (origin: any) => {
  if (isObjectLike(origin)) {
    // 继续递归
    return Object.keys(origin).reduce(
      (prev: any, next) => {
        prev[next] = loopObject(dataSource)(origin[next]);
        return prev;
      },
      Array.isArray(origin) ? [] : {},
    );
  } else {
    if (isString(origin) && matchExpression(origin)) {
      // 表达式替换
      const newContent = replaceExpression(origin);
      const func = new Function('scope', 'return ' + newContent);
      try {
        return func(dataSource);
      } catch (e) {
        return;
      }
    } else {
      return origin; // 不作任何处理
    }
  }
};
