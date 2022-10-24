import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import FormRender from './index';

export default (container: Element) => {
  return {
    // 渲染
    render(props: any) {
      render(<FormRender {...props} />, container);
    },
    // 卸载
    unmount() {
      unmountComponentAtNode(container);
    },
  };
};
