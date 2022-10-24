/*
 * @Author: wangzhenggui jianjia.wzg@raycloud.com
 * @Date: 2022-07-22 16:34:21
 * @LastEditors: wangzhenggui jianjia.wzg@raycloud.com
 * @LastEditTime: 2022-08-10 18:50:17
 * @FilePath: /form-render-components/src/hooks/useInit.ts
 * @Description:
 *
 * Copyright (c) 2022 by wangzhenggui jianjia.wzg@raycloud.com, All Rights Reserved.
 */
import { useEffect } from 'react';

const useInit = (fn: Function) => {
  useEffect(() => {
    if (typeof fn === 'function') {
      fn();
    }
  }, []);
};

export default useInit;
