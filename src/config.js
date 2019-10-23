import 'whatwg-fetch';

const context_path = document.location.pathname.split('/')[1] === 'easy-doc.html' ? '' : '/' + document.location.pathname.split('/')[1];

export const base =  localStorage.getItem('base') || (window.location.origin + context_path); // window.location.origin + context_path
// 获取接口文档的地址
const base_url = base + '/easy-doc/resource';
// 获取请求地址
const getList = base + '/easy-doc/list';
// 添加cookie
const cookieUrl = base + '/easy-doc/addCookie';
// 压力测试地址
export const pressure_url = base + '/easy-doc/pressureTest';
const base_fetch = function(url, method, body, isQueryString) {
  const obj = localStorage.getItem('globalParam') || '[]';
  const token = localStorage.getItem('token');
  const globalParam = JSON.parse(obj)
  let params = ''
  globalParam.forEach(item => params += `${item.key}=${item.value}&`)
  if (params) {
    url = url + (url.indexOf('?') !== -1 ? '&' : '?') + params.slice(0, params.length - 1)
  }

  if (method === 'GET' && body && isQueryString) {
    Object.keys(body).forEach(item => params += `${item}=${body[item]}&`)
    url = url + (url.indexOf('?') !== -1 ? '&' : '?') + params.slice(0, params.length - 1)
  }
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
export const getMethod = function(params, isQueryString) {
  return base_fetch(base_url, 'GET', params, isQueryString);
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
