const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    minLength: 4,
    maxLength: 50,
  },
  lastName: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    index:true,
    unique: true,
    lowercase: true,
    trim: true,
    validate(value){
      if(!validator.isEmail(value)){
        throw new Error("Invalid Email"+value)
      }
    }
  },
  password: {
    type: String,
    required: true,
    unique: true,
    validate(value){
      if(!validator.isStrongPassword(value)){
        throw new Error("Weak Password"+value)
      }
    }
  },
  age: {
    type: Number,
  },
  gender: {
    type: String,
    validate(value){
      if(!["male","female","others"].includes(value)){
        throw new Error("Gender is not valid")
      }
    }
  },
  photoUrl: {
    type: String,
    default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRiibOngFYog5Ri5UoFKH3CsHMOvomBLf4JAw&s",
    validate(value){
      if(!validator.isURL(value)){
        throw new Error("Invalid PhotoURL"+value)
      }
    }
  },
  about: {
    type: String,
    default: "This is the default about of the user!"
  },
  skills: {
    type: [String],
  }
},{
  timestamps: true
});

userSchema.index({firstName: 1, lastName: 1});

userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, "DEV@Tinder123", {expiresIn: "1d"});
  return token;
}

userSchema.methods.validatePassword = async function(passwordInputByUser) {
  const user = this;
  const passwordHash = user.password;

  const isPasswordValid = await bcrypt.compare(
    passwordInputByUser,
    passwordHash
  )
  return isPasswordValid;
}

module.exports = mongoose.model("User", userSchema);
