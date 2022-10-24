/*
 * @Author: wangzhenggui jianjia.wzg@raycloud.com
 * @Date: 2022-07-21 16:55:20
 * @LastEditors: wangzhenggui jianjia.wzg@raycloud.com
 * @LastEditTime: 2022-08-04 16:47:49
 * @FilePath: /form-render-components/src/Field/index.tsx
 * @Description:
 *
 * Copyright (c) 2022 by wangzhenggui jianjia.wzg@raycloud.com, All Rights Reserved.
 */
import React, { forwardRef } from 'react';
import { Input } from 'antd';
import useBind from './useBind';

const propsToState = ['disabled'];
const Field = forwardRef((props, ref) => {
  const [state, originProps] = useBind(props, ref, propsToState);
  return <Input {...originProps} {...state} />;
});

export default Field;
