import { defineConfig } from 'dumi';

export default defineConfig({
  title: 'form-render-components',
  favicon:
    'https://user-images.githubusercontent.com/9554297/83762004-a0761b00-a6a9-11ea-83b4-9c8ff721d4b8.png',
  logo: 'https://user-images.githubusercontent.com/9554297/83762004-a0761b00-a6a9-11ea-83b4-9c8ff721d4b8.png',
  outputPath: 'docs-dist',
  // more config: https://d.umijs.org/config
  // 按需加载
  extraBabelPlugins: [
    [
      'import',
      {
        libraryName: 'antd',
        libraryDirectory: 'lib',
        style: true,
      },
    ],
  ],
  chainWebpack: (config) => {
    config.output
      .filename('js/[name].[hash].js')
      .chunkFilename('js/[name].[hash].js')
      .end();
    config.module
      .rule('mjs$')
      .test(/\.mjs$/)
      .include.add(/node_modules/)
      .end()
      .type('javascript/auto');
  },
  proxy: {
    '/qy/': {
      target: 'http://kefu.kuaimai.com/', //测试服务
      changeOrigin: true,
      cookieDomainRewrite: 'kefu.kuaimai.com',
    },
    '/shop/': {
      target: 'http://kefu.kuaimai.com/', //测试服务
      changeOrigin: true,
      cookieDomainRewrite: 'kefu.kuaimai.com',
    },
    '/tianwen/': {
      target: 'http://kefu.kuaimai.com/', //测试服务
      changeOrigin: true,
      cookieDomainRewrite: 'kefu.kuaimai.com',
    },
    '/enterprise/': {
      target: 'http://kefu.kuaimai.com/', //测试服务
      changeOrigin: true,
      cookieDomainRewrite: 'kefu.kuaimai.com',
    },
  },
});
