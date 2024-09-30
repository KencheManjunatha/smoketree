const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/user_address", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define Models
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
});

const AddressSchema = new mongoose.Schema({
  address: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const User = mongoose.model("User", UserSchema);
const Address = mongoose.model("Address", AddressSchema);

// Create User and Address
app.post("/register", async (req, res) => {
  const { name, address } = req.body;
  try {
    const user = await User.create({ name });
    await Address.create({ address, userId: user._id });
    res.status(201).json({ message: "User and Address created successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
