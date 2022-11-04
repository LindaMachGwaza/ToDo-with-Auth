//import modules
const Validator = require("validator");
const isEmpty = require("./isEmpty");

const validateToDoInput = data => {
    let errors = {}
    //check content field and set characters length; send error if empty and length incorrect
    if(isEmpty(data.content)) {
        errors.content = "Content field cannot be empty.";
    }else if(!Validator.isLength(data.content,{min: 1, max: 300})) {
        errors.content = "Content field must be between 1 and 300 characters";
    }
    return {
        errors,
        isValid: isEmpty(errors)
    }
}
//export module
module.exports = validateToDoInput;

//Sources used include Hyperiondev notes, previous Tasks, You Tube, Geeksforgeeks, W3Schools, Google.com and Stackoverflow