const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// connect MongoDB Atlas
console.log("Attempting to connect to MongoDB...");
console.log("MONGO_URI:", process.env.MONGO_URI ? "✓ Found" : "✗ Missing");

mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
})
  .then(() => console.log("✓ MongoDB Connected Successfully"))
  .catch(err => {
    console.error("✗ MongoDB Connection Failed:");
    console.error("Error:", err.message);
    console.error("Make sure:");
    console.error("1. Your MongoDB Atlas cluster is running");
    console.error("2. Your IP is whitelisted in Atlas Network Access");
    console.error("3. Your connection string is correct");
  });

// schema
const todoSchema = new mongoose.Schema({ text: String });
const Todo = mongoose.model("Todo", todoSchema);

// Root route
app.get("/", (req, res) => {
  res.json({ 
    message: "Todo API Server is running!", 
    endpoints: {
      "GET /todos": "Get all todos",
      "POST /addlist": "Add new todo",
      "PUT /updatelist/:id": "Update todo",
      "DELETE /deletelist/:id": "Delete todo"
    }
  });
});

// routes
app.get("/todos", async (req, res) => {
  const todos = await Todo.find();
  res.json(todos);
});

app.post("/addlist", async (req, res) => {
  const todo = new Todo({ text: req.body.text });
  await todo.save();
  res.json(todo);
});

// Update todo
app.put("/updatelist/:id", async (req, res) => {
  try {
    const todo = await Todo.findByIdAndUpdate(
      req.params.id,
      { text: req.body.text },
      { new: true }
    );
    res.json(todo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete todo
app.delete("/deletelist/:id", async (req, res) => {
  try {
    await Todo.findByIdAndDelete(req.params.id);
    res.json({ message: "Todo deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put("/updatelist/:id", async (req, res) => {
  try {
    const todo = await Todo.findByIdAndUpdate(
      req.params.id, 
      { text: req.body.text }, 
      { new: true }
    );
    res.json(todo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete("/deletelist/:id", async (req, res) => {
  try {
    await Todo.findByIdAndDelete(req.params.id);
    res.json({ message: "Todo deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// listen
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
