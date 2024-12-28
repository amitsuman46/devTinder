const validator = require("validator");

const validateSignUpData = (req) => {
    const {firstName, lastName, email, password} = req.body

    if(!firstName || !lastName){
        throw new Error("Name is not valid");
    }
    else if(!validator.isEmail(email)){
        throw new Error("Email is not valid");
    }
    else if(!validator.isStrongPassword(password)){
        throw new Error("Password is not valid");
    }
}

const validateEditProfileData = (req) => {
    const allowedEditFields = ["firstName", "lastName" , "photoUrl", "gender", "age", "about", "skills"];
    const isEditField = Object.keys(req).every((field)=>allowedEditFields.includes(field));

    return isEditField;
}
module.exports = {validateSignUpData, validateEditProfileData}