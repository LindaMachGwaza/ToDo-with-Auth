const Validator = require("validator");
const isEmpty = require ("./isEmpty");

const validateRegisterInput = (data) =>{
    let errors = {};
//check email field. If empty send an error for user to enter a valid email 
if(isEmpty(data.email)) {
    errors.email = "Please enter your email.";
} else if(!Validator.isEmail(data.email)) {
    errors.email = "Email is invalid, please enter a valid email.";
}
//check name field. If empty send an error for user to enter a valid name
if(isEmpty(data.name)) {
    errors.name = "Please enter your name.";
} else if(!Validator.isLength(data.name, {min: 2, max: 30})) {
    errors.name = "Name must be between 2 and 30 characters long.";
}
//Check password field and specify password length. If empty send error for user to enter correct password
if(isEmpty(data.password)) {
    errors.password = "Please enter your password";
} else if(!Validator.isLength(data.password, {min: 6, max: 150})) {
    errors.password = "Password must be between 6 and 150 characters long.";
}
//Check or confirm password. If it doesn't match initial password send an error
if(isEmpty(data.confirmPassword)) {
    errors.confirmPassword = "Please confirm password.";
}else if(!Validator.equals(data.password, data.confirmPassword)) {
    errors.confirmPassword = "Passwords do not match.";
}
//if password/email is valid then confirm otherwise return errors
return {
    errors,
    isValid: isEmpty(errors),
}
};

module.exports = validateRegisterInput;

//Sources used include Hyperiondev notes, previous Tasks, You Tube, Geeksforgeeks, W3Schools, Google.com and Stackoverflow