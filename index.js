import express from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({
  // origin: "https://todo-frontend-nu-topaz.vercel.app"
}));

// app.use(cors({
//   origin: process.env.CORS_ORIGIN
// }));



const TODO_ITEMS = [
  {
    id: 1,
    todoItem: "Buy Groceries",
    priority: "high",
    emoji: "⚖️",
    isDone: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    todoItem: "Go To Gym",
    priority: "medium",
    emoji: "💪",
    isDone: true,
    createdAt: new Date().toISOString(),
  },
];

app.get('/',(req,res)=>{
    res.json({
        message:`welcome to Expense Tracker API`
    })
})

app.get("/todos", (req, res) => {
  res.json({
    success: true,
    data: TODO_ITEMS,
    message: "Todo items fetched successfully",
  });
});

app.post("/todos", (req, res) => {
  const { todoItem, priority, emoji } = req.body;

  const todoObj = {
    id: TODO_ITEMS[TODO_ITEMS.length - 1].id + 1,
    todoItem: todoItem,
    priority: priority,
    emoji: emoji,
    isDone: false,
    createdAt: new Date().toISOString(),
  };

  TODO_ITEMS.push(todoObj);

  res.json({
    success: true,
    data: todoObj,
    message: "Todo item added successfully",
  });
});

app.get("/todos/search", (req, res) => {
  const { item, priority } = req.query;

  const filteredItems = TODO_ITEMS.filter((itemObj) => {
    if (
      itemObj.todoItem.toLowerCase().includes(item.toLowerCase()) &&
      itemObj.priority.toLowerCase() == priority.toLowerCase()
    ) {
      return true;
    }
    return false;
  });
  res.json({
    success: true,
    data: filteredItems,
    message: "Filtered todo items fetched successfully",
  });
});

app.get("/todos/:id", (req, res) => {
  const { id } = req.params;

  const todoItem = TODO_ITEMS.find((item) => {
    if (item.id == id) return item;
  });

  if (todoItem) {
    res.json({
      success: true,
      data: todoItem,
      message: "Todo item fetched successfully",
    });
  } else {
    res.json({
      success: false,
      message: "Todo item not found",
    });
  }
});

app.delete("/todos/:id", (req, res) => {
  const { id } = req.params;

  const index = TODO_ITEMS.findIndex((item) => item.id == id);

  if (index === -1) {
    res.json({
      success: false,
      message: "Todo item not find",
    });
  } else {
    TODO_ITEMS.splice(index, 1);
    res.json({
      success: true,
      message: "Todo item deleted successfully",
    });
  }
});

app.patch("/todos/:id/status", (req, res) => {
  const { id } = req.params;

  const index = TODO_ITEMS.findIndex((item) => item.id == id);

  const { isDone } = req.body;

  if (index == -1) {
    res.json({
      success: false,
      message: "Todo items not found",
    });
  } else {
    TODO_ITEMS[index].isDone = isDone;

    res.json({
      success: true,
      data: TODO_ITEMS[index],
      message: "Todo item status updated successfully",
    });
  }
}),
  app.put("/todos/:id", (req, res) => {
    const { id } = req.params;

    const index = TODO_ITEMS.findIndex((item) => item.id == id);

    if (index == -1) {
      return res.json({
        success: false,
        message: "Todo items not found",
      });
    }

    const { todoItem, priority, isDone, emoji } = req.body;

    const newObj = {
      todoItem,
      priority,
      isDone,
      emoji,
      id: TODO_ITEMS[index].id,
      createdAt: TODO_ITEMS[index].createdAt,
    };

    TODO_ITEMS[index] = newObj;

    res.json({
      success: true,
      data: newObj,
      message: "Todo item updated successfully",
    });
  });

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});