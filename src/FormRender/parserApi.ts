/*
 * @Author: wangzhenggui jianjia.wzg@raycloud.com
 * @Date: 2022-08-04 11:44:13
 * @LastEditors: wangzhenggui jianjia.wzg@raycloud.com
 * @LastEditTime: 2022-08-05 10:28:05
 * @FilePath: /form-render-components/src/FormRender/parserApi.ts
 * @Description:
 *
 * Copyright (c) 2022 by wangzhenggui jianjia.wzg@raycloud.com, All Rights Reserved.
 */
import { isObjectLike, isObject, get, isEqual } from 'lodash';
import { expressParser } from '@raycloud-apaas-fe-setup/apaas-parser';
import { StateInterface, ClassObjectType } from './type';
/**
 * string数据类型转成基础类型
 * @param {*} init
 */
function initDataTransBasicTypeData(init: any) {
  if (!init) return init;
  if (typeof init !== 'string') return init;
  try {
    return JSON.parse(init);
  } catch (e) {
    console.error('API初始值解析失败：', init, 'error：', e);
    return init;
  }
}

export function parseApis(dataList: StateInterface[]) {
  const state: ClassObjectType = {};
  if (!(Array.isArray(dataList) && dataList.length > 0)) {
    console.warn('参数有误');
    return {
      state,
    };
  }
  dataList.map((data) => {
    if (data.protocol === 'VARIABLE') {
      state[data.name] = initDataTransBasicTypeData(data.initValue); // 暂时只支持 String/Boolean/Number/Object/null/Array 这些基础类型，暂不支持表达式
    }
  });
  return {
    state,
  };
}

/**
 * 解析表达式结构
 */
export const parseExpression = (
  props: ClassObjectType,
  store: ClassObjectType,
) => {
  if (isObjectLike(props) && Object.keys(props)?.length > 0) {
    return Object.keys(props).reduce(
      (prev: any, next) => {
        if (
          isObject(props[next]) &&
          isEqual(get(props, `${next}.type`), 'VARIABLE')
        ) {
          // TODO: 新增变量类型
          try {
            prev[next] = expressParser.getVariableContent(
              store,
              props[next]['variable'],
            );
          } catch (e) {
            prev[next] = undefined;
            console.log('表达式解析异常', e);
          }
        } else {
          prev[next] = parseExpression(props[next], store);
        }
        return prev;
      },
      Array.isArray(props) ? [] : {},
    );
  } else {
    return props;
  }
};
