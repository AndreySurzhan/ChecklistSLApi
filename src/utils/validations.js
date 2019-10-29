const validator = {
    isEmailValid(email) {
        if (/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/.test(email)) {
            return true
        }
    
        return false;
    },
    isNotEmpty(value) {
        if (value.length > 0) {
            return true
        }
    
        return false;
    },
    isObjectEmpty(obj) {
        return Object.entries(obj).length === 0 && obj.constructor === Object
    }
}

module.exports = validator;
