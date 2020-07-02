class Validator {
    
    static itemsInArrayExistInExpectedArray(actualArray, expectedArray) {
        return actualArray.every(item => expectedArray.includes(item));
    }

    static isEmailValid(email) {
        if (/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/.test(email)) {
            return true
        }
    
        return false;
    }

    static isNotEmpty(value) {
        if (value.length > 0) {
            return true
        }
    
        return false;
    }

    static isObjectEmpty(obj) {
        return Object.entries(obj).length === 0 && obj.constructor === Object
    }
}

module.exports = Validator;
