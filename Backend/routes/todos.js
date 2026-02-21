const express = require("express");
const router = express.Router();
const Todo = require("../models/Todo");
const auth = require("../middleware/auth");

// GET all todos for logged-in user
router.get("/", auth, async (req, res) => {
  const todos = await Todo.find({ userId: req.userId });
  res.json(todos);
});

// CREATE new todo
router.post("/", auth, async (req, res) => {
  const { title, description } = req.body;
  const now = new Date().toLocaleString();

  const todo = await Todo.create({
    userId: req.userId,
    title,
    description,
    createdAt: now,
    updatedAt: now
  });

  res.json(todo);
});

// DELETE todo
router.delete("/:id", auth, async (req, res) => {
  const todo = await Todo.findOne({ _id: req.params.id, userId: req.userId });
  if (!todo) return res.status(404).json({ message: "Todo not found" });

  await todo.deleteOne();
  res.json({ message: "Deleted" });
});

// UPDATE todo
router.put("/:id", auth, async (req, res) => {
  const { title, description } = req.body;
  const todo = await Todo.findOne({ _id: req.params.id, userId: req.userId });
  if (!todo) return res.status(404).json({ message: "Todo not found" });

  todo.title = title;
  todo.description = description;
  todo.updatedAt = new Date().toLocaleString();
  await todo.save();

  res.json(todo);
});

module.exports = router;