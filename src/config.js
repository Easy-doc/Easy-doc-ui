
import 'whatwg-fetch';
const base_url = 'http://120.24.5.178:19960/easy-doc/resource';
export const base = 'http://120.24.5.178:19960';
const base_fetch = function (url, method, body){
    const getHead = {
        method: method,
        mode: 'cors',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        }}
    const postHead = {
        method: method,
        mode: 'cors',
        credentials: 'include',
        body: body,
        headers: {
            'Content-Type': 'application/json'
        }}
    const res = fetch(url, method === 'GET' ? getHead : postHead ).then(response => { return response.json() });
    return res;
}

const base_post =  function (url, method){
    const res = fetch(url, {
        method: method,
        mode: 'cors',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
    }).then(response => { return response.json() });
    return res;
}

// get请求
export const getMethod = function () {
    return base_fetch(base_url, 'GET');
  }
// post请求
export const postMethod = function () {
    return base_fetch(base_url, 'POST');
}
export const getRes = function (url, method, body) {
    return base_fetch(url, method, body);
}