export var getDefault = function (val, type) {
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