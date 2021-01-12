const validator = require('validator');

function validateProfileData(data) {
    const validationMessages = {};

    if (data.firstName.length > 100) {
        validationMessages.firstName = 'Length of the first name must be 100 or less characters';
    }
    if (data.lastName.length > 100) {
        validationMessages.lastName = 'Length of the last name must be 100 or less characters';
    }
    if (data.nickName.length > 100 || data.nickName.length < 2) {
        validationMessages.nickName = 'Length of the nick name must be between 2 to 100 characters';
    }
    /*if (data.nickName already exists)*/
    if (!validator.isEmail(data.email)) {
        validationMessages.email = 'Field must be valid email';
    }
    if (!validator.isMobilePhone(data.phone.toString())) {
        validationMessages.phone = 'Field must be valid phone number';
    }
    if (data.password < 8) {
        validationMessages.password = 'Password must be at least 8 characters long';
    }
    if (!validator.isDate(data.birthday) || !isBeforeNow(data.birthday)) {
        validationMessages.birthday = 'Field must be valid date before current date';
    }
    if (data.gender !== 'Male' && data.gender !== 'Female') {
        validationMessages.gender = 'You must choose from provided options';
    }

    return validationMessages;
}

function isBeforeNow(date) {
    const now = new Date().toISOString().split('T')[0].split('-');
    date = date.split('-');
    if (now[0] > date[0]) {
        return true;
    }
    if (now[0] === date[0] && now[1] > date[1]) {
        return true;
    }
    if (now[0] === date[0] && now[1] === date[1] && now[2] > date[2]) {
        return true;
    }

    return false;
}

module.exports = {
    validateProfileData
}