
import 'whatwg-fetch';
const base_url = 'http://120.24.5.178:19960/easy-doc/resource';
const base_fetch = function (method){
    var res = fetch(base_url, {
        method: 'method',
        mode: 'cors',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return res;
}

// get请求
export default function getMethod() {
    return base_fetch('GET');
  }
// post请求
export function postMethod() {
    return base_fetch('POST');
}