import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    set: ((name) => {
      return name.trim()
    })
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 5
  },
  role: {
    type: String,
    enum: ["viewer", "analyst", "admin"],
    default: "viewer"
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active"
  }
},
  {
    timestamps: true,
    toJSON: {
      setters: true
    }
  }
)

const User = mongoose.model("User", userSchema);

export default User;