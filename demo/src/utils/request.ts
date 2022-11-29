/*
 * @Description:
 * @Date: 2021-04-26 20:06:32
 * @LastEditTime: 2022-11-27 16:10:38
 * @FilePath: /demo/src/utils/request.ts
 */
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
const service = axios.create({
    timeout: 5000, // request timeout
});
// 发起请求之前的拦截器
service.interceptors.request.use(
    (config: any) => {
        return config;
    },
    (error: any) => Promise.reject(error),
);
// 响应拦截器
service.interceptors.response.use(
    (response: AxiosResponse) => {
        return response;
    },
    (error: any) => {
        return Promise.reject(error);
    },
);
export default service;
