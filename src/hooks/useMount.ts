/*
 * @Author: wangzhenggui jianjia.wzg@raycloud.com
 * @Date: 2022-08-10 19:12:20
 * @LastEditors: wangzhenggui jianjia.wzg@raycloud.com
 * @LastEditTime: 2022-08-10 19:17:28
 * @FilePath: /form-render-components/src/hooks/useMount.ts
 * @Description:
 *
 * Copyright (c) 2022 by wangzhenggui jianjia.wzg@raycloud.com, All Rights Reserved.
 */
import { useEffect } from 'react';
let local = false; // TODO: 使用useRef在开发环境下并未生效，故使用全局变量替代ref,到生产环境时，尝试使用下useRef看是否能解决问题
const useMount = (fn: VoidFunction) => {
  useEffect(() => {
    if (local === true) return;
    local = true;
    fn?.();
  }, []);
};
export default useMount;
