/*
 * @Author: wangzhenggui jianjia.wzg@raycloud.com
 * @Date: 2022-07-21 16:59:24
 * @LastEditors: wangzhenggui jianjia.wzg@raycloud.com
 * @LastEditTime: 2022-08-11 17:44:26
 * @FilePath: /form-render-components/src/Field/useBind.ts
 * @Description:
 *
 * Copyright (c) 2022 by wangzhenggui jianjia.wzg@raycloud.com, All Rights Reserved.
 */
import { useState, useImperativeHandle, useCallback, useEffect } from 'react';

type Props = {
  [prop: string]: any;
};

const useBind = (
  props: Props,
  ref: React.Ref<any>,
  prototypeList: string[],
) => {
  const [state, setState] = useState({});
  const [originProps, setOriginProps] = useState({});
  const init = useCallback(() => {
    // 只对需要的属性进行双向绑定
    const twoWayBindingProps = Object.keys(props).reduce((cur: Props, nxt) => {
      if (prototypeList.includes(nxt)) {
        cur[nxt] = props[nxt];
      }
      return cur;
    }, {});
    const originProps = Object.keys(props).reduce((cur: Props, nxt) => {
      if (!prototypeList.includes(nxt)) {
        cur[nxt] = props[nxt];
      }
      return cur;
    }, {});
    setState(twoWayBindingProps);
    setOriginProps(originProps);
  }, []);
  useImperativeHandle(ref, () => ({
    state: new Proxy(state, {
      get(target, prop: string) {
        return Reflect.get(target, prop);
      },
      set(obj, prop: string, value) {
        console.log(obj, prop, value);
        if (!Reflect.has(obj, prop)) {
          console.warn('当前组件状态未定义,不可被设置');
          return true;
        }
        setState({
          ...obj,
          [prop]: value,
        });
        return true;
      },
    }),
  }));
  useEffect(() => {
    init();
  }, [init]);
  return [state, originProps];
};

export default useBind;
