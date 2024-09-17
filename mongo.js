import mongoose from "mongoose";
mongoose
  .connect("mongodb://localhost:27017/react-login-test")
  .then(() => {
    console.log("Connected to MongoDB...");
  })
  .catch((err) => {
    console.log("failed to connect to MongoDB");
  });

const newSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
});

const collection = mongoose.model("collection", newSchema);

export default collection;
