const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Connect to MongoDB
mongoose
  .connect('mongodb://0.0.0.0:27017/ToDoList', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Database connected');
  })
  .catch((err) => {
    console.log('Error connecting to database', err);
  });

// Todo model/schema
const todoSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
});

const Todo = mongoose.model('Todo', todoSchema);

// API routes
app.get('/api/todos', async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (error) {
    console.log('Error fetching todos:', error);
    res.status(500).json({ error: 'Error fetching todos' });
  }
});

app.post('/api/todos', async (req, res) => {
  try {
    const { text } = req.body;
    const todo = new Todo({ text });
    const savedTodo = await todo.save();
    res.status(201).json(savedTodo);
  } catch (error) {
    console.log('Error adding todo:', error);
    res.status(500).json({ error: 'Error adding todo' });
  }
});

app.delete('/api/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Todo.findByIdAndDelete(id);
    res.status(204).end();
  } catch (error) {
    console.log('Error deleting todo:', error);
    res.status(500).json({ error: 'Error deleting todo' });
  }
});

app.patch('/api/todos/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { text } = req.body;
      const updatedTodo = await Todo.findByIdAndUpdate(id, { text }, { new: true });
      res.json(updatedTodo);
    } catch (error) {
      console.log('Error updating todo:', error);
      res.status(500).json({ error: 'Error updating todo' });
    }
  });

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
