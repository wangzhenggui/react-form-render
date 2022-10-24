import request from 'umi-request';
export const getTemplateDetail = (uniqueKey: string) =>
  request.get('/api/getTemplateDetail', {
    params: {
      uniqueKey,
    },
  });
