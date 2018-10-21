
import 'whatwg-fetch';

// 获取接口文档的地址
const base_url = 'http://120.24.5.178:19960/easy-doc/resource';
// 获取请求地址
const getList = 'http://120.24.5.178:19960/easy-doc/list';
// 接口拼接地址
export const base = 'http://120.24.5.178:19960';
// 压力测试地址
export const pressure_url = 'http://120.24.5.178:19960/easy-doc/pressureTest';
const base_fetch = function (url, method, body){
    const getHead = {
        method: method,
        mode: 'cors',
        // credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        }}
    const postHead = {
        method: method,
        mode: 'cors',
        // credentials: 'include',
        body: body,
        headers: {
            'Content-Type': 'application/json'
        }}
    const res = fetch(url, method === 'GET' ? getHead : postHead ).then(response => { return response.json() });
    return res;
}

// get请求
export const getMethod = function () {
    return base_fetch(base_url, 'GET');
}
export const getRes = function (url, method, body) {
    return base_fetch(url, method, body);
}
export const pressureTest = function(url,body) {
    return base_fetch(url, 'POST', body);
}
export const getUrlList = function () { 
    return base_fetch(getList, 'GET');
 }