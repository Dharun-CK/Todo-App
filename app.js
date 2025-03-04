const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const dbo = require("./db");
const { ObjectId } = require("mongodb");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public"))); // Serve static files

// Serve index.html for frontend
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Get all tasks
app.get("/api/tasks", async (req, res) => {
  try {
    let database = await dbo.getDatabase();
    const collection = database.collection("tasks");
    const tasks = await collection.find().toArray();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Add a new task
app.post("/api/store_book", async (req, res) => {
  try {
    let database = await dbo.getDatabase();
    const collection = database.collection("tasks");
    let task = { title: req.body.title, author: req.body.author };
    await collection.insertOne(task);
    res.redirect("/");
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update a task
app.post("/api/update_book/:edit_id", async (req, res) => {
  try {
    let database = await dbo.getDatabase();
    const collection = database.collection("tasks");
    let updatedTask = { title: req.body.title, author: req.body.author };
    let edit_id = req.params.edit_id;

    await collection.updateOne({ _id: new ObjectId(edit_id) }, { $set: updatedTask });
    res.redirect("/");
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete a task
app.get("/api/delete/:id", async (req, res) => {
  try {
    let database = await dbo.getDatabase();
    const collection = database.collection("tasks");
    await collection.deleteOne({ _id: new ObjectId(req.params.id) });
    res.redirect("/");
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = app;
