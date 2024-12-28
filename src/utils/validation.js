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

const validatePasswordChange = (req) => {
    const { currentPassword,newPassword } = req.body;
    const loggedInUser = req.user;
    const userPassword = loggedInUser.password;
    // Validate that both currentPassword and newPassword are provided
    if (!newPassword || ! currentPassword) {
      throw new Error("Both new and current passwords are required");
    }
    if(currentPassword!==userPassword){
        throw new Error("Current Password is incorrect");
    }
    // Check if the current password matches the user's existing password
    const isPasswordMatch = newPassword === userPassword;
    if (isPasswordMatch) {
      throw new Error("New password is equal to previous password");
    }
    if (!validator.isStrongPassword(newPassword)) {
      throw new Error("New password is not a valid password");
    }

    else
        return true
}
module.exports = {validateSignUpData, validateEditProfileData, validatePasswordChange}