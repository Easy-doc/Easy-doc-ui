export const getDefault = function (val, type) {
    if(val === null) {
        switch(type) {
            case 'String':
                return 'string';
            case 'Object':
                return {};
            case 'Integer':
                return 0;
            case 'Double':
                return 0.0;
            case 'Boolean':
                return false;
            default:
                return ;
        }
    }
    return val;
}

// export const getUrl = function(params, type) {
//     const base = window.location.protocol + window.location.hostname;
//     switch() {

//     }
//     console.log(base)
// }
export const jsonParse = function(obj) {
    if(!obj instanceof Object) {
        return '';
    }
    return JSON.stringify(obj, null, 2);
}

export const getPressureRes = function(obj) {
    if (!obj instanceof Object) {
        return ''
    }
    let res = {};
    Object.keys(obj).forEach(item => {
        switch(item) {
            case 'slowTime':
                res['最慢请求时间'] = obj[item];
                break;
            case 'fastTime':
                res['最快请求时间'] = obj[item];
                break;
            case 'avgTime':
                res['平均请求时间'] = obj[item];
                break;
            case 'qps':
                res['qps'] = obj[item];
                break;
            default:
                break;
        }
    });
    return res;
}

export const getBtnBg = function (type) {
    switch(type) {
        case 'GET':
            return '#85BCBF';
        case 'POST':
            return '#7B76AC';
        case 'PUT':
            return '#5C0C7B';
        case 'HEAD':
            return '#F1B000';
        case 'DELETE':
            return '#65CC66';
        case 'OPTIONS':
            return '#FF6766';
        default:
            return '#984D54';
    }   
}


