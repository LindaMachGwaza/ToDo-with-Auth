//This function is used in the register validation. 
const isEmpty = (value) => 
value === undefined ||
value === null ||
(typeof value === "object" && Object.keys(value).length === 0) ||
(typeof value === "string" && value.trim().length === 0);

module.exports = isEmpty;

//Sources used include Hyperiondev notes, previous Tasks, You Tube, Geeksforgeeks, W3Schools, Google.com and Stackoverflow