import 'whatwg-fetch';

// 接口拼接地址http://120.24.5.178:19960'
export const base = 'http://120.24.5.178:19960';
// 获取接口文档的地址
const base_url = base + '/easy-doc/resource';
// 获取请求地址
const getList = base + '/easy-doc/list';
// 添加cookie
const cookieUrl = base + '/easy-doc/addCookie';
// 压力测试地址
export const pressure_url = base + '/easy-doc/pressureTest';
const base_fetch = function(url, method, body) {
  const globalParam = localStorage.getItem('globalParam');
  const token = localStorage.getItem('token');
  const symbol = url.indexOf('?') !== -1 ? '&' : '?';
  url = globalParam !== null ? url + symbol + globalParam : url;
  const header = function() {
    const obj = {
      method: method,
      mode: 'cors',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    };
    if (method === 'POST') {
      obj['body'] = body;
    }
    if (token !== null) {
      obj.headers['Authorization'] = token;
    }
    return obj;
  };
  const res = fetch(url, header())
    .then(response => {
      return response.json();
    })
    .catch(e => console.log('错误提示', e));
  return res;
};

// get请求
export const getMethod = function() {
  return base_fetch(base_url, 'GET');
};
export const getRes = function(url, method, body) {
  return base_fetch(url, method, body);
};
export const pressureTest = function(url, body) {
  return base_fetch(url, 'POST', body);
};
export const getUrlList = function() {
  return base_fetch(getList, 'GET');
};
export const addCookie = function(body) {
  return base_fetch(cookieUrl, 'POST', body);
};
