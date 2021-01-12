const validator = require('validator');

function validateCreateDogData(data, file, breeds) {
    const validationErrors = {};
    if (data.name.length < 1 || data.name.length > 100) {
        validationErrors.name = 'Name length should be between 1 to 100 characters';
    }
    if (data.weight < 0 || data.name.weight > 300) {
        validationErrors.weight = 'Weight should be between 0 to 300';
    }
    if (data.age < 0 || data.name.age > 30) {
        validationErrors.age = 'Age should be between 0 to 30';
    }
    if (data.gender !== 'Male' && data.gender !== 'Female') {
        validationErrors.gender = 'Choose gender from provided options';
    }
    if (breeds.find(breed => breed.name === data.breed) == undefined) {
        validationErrors.breed = 'Choose breed from provided options';
    }
    if (file == null || file == undefined) {
        validationErrors.image = 'File uploaded must be jpeg/png and its size must be less than 1 mb';
    }
    
    return validationErrors;
}

module.exports = {
    validateCreateDogData
}