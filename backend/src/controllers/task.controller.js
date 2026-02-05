const Task = require("../models/Task");

/*
  CREATE TASK
  POST /api/v1/tasks
*/
exports.createTask = async (req, res, next) => {
  try {
    const { title, description, status } = req.body;

    if (!title) {
      const error = new Error("Title is required");
      error.statusCode = 400;
      throw error;
    }

    const task = await Task.create({
      title,
      description,
      status,
      userId: req.user.id
    });

    res.status(201).json({
      success: true,
      data: task
    });

  } catch (error) {
    next(error);
  }
};



/*
  GET ALL TASKS
  GET /api/v1/tasks
  Supports:
  - Search
  - Status filter
  - Pagination
*/
exports.getTasks = async (req, res, next) => {
  try {
    const { search, status, page = 1, limit = 5 } = req.query;

    let query = { userId: req.user.id };

    // 🔍 Search by title or description
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ];
    }

    // ✅ Filter by status
    if (status) {
      query.status = status;
    }

    const skip = (page - 1) * limit;

    const tasks = await Task.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Task.countDocuments(query);

    res.json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      data: tasks
    });

  } catch (error) {
    next(error);
  }
};



/*
  GET SINGLE TASK
  GET /api/v1/tasks/:id
*/
exports.getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!task) {
      const error = new Error("Task not found");
      error.statusCode = 404;
      throw error;
    }

    res.json({
      success: true,
      data: task
    });

  } catch (error) {
    next(error);
  }
};



/*
  UPDATE TASK
  PUT /api/v1/tasks/:id
*/
exports.updateTask = async (req, res, next) => {
  try {
    const task = await Task.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user.id
      },
      req.body,
      { new: true }
    );

    if (!task) {
      const error = new Error("Task not found");
      error.statusCode = 404;
      throw error;
    }

    res.json({
      success: true,
      data: task
    });

  } catch (error) {
    next(error);
  }
};



/*
  DELETE TASK
  DELETE /api/v1/tasks/:id
*/
exports.deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!task) {
      const error = new Error("Task not found");
      error.statusCode = 404;
      throw error;
    }

    res.json({
      success: true,
      message: "Task deleted successfully"
    });

  } catch (error) {
    next(error);
  }
};
