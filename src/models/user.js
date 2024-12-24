const mongoose = require("mongoose");

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
  },
  password: {
    type: String,
    required: true,
    unique: true
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
    default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRiibOngFYog5Ri5UoFKH3CsHMOvomBLf4JAw&s"
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


module.exports = mongoose.model("User", userSchema);
