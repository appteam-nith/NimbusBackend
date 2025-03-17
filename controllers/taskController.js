const Task = require('../models/task');
const User = require('../models/user');
const QRCodeService = require('../services/QRCodeService');
const qrCodeGenerator = require('../utils/qrCodeGenerator');

// Create a new task
exports.createTask = async (req, res) => {
  try {
    const { title, description, reward } = req.body;
    
    // Generate a unique QR code identifier
    const qrCodeValue = QRCodeService.generateQRCode();
    
    const task = new Task({
      title,
      description,
      reward: reward || 0,
      qrCode: {
        code: qrCodeValue
      }
    });
    
    await task.save();
    
    res.status(201).json({
      message: 'Task created successfully',
      task: {
        id: task._id,
        title: task.title,
        description: task.description,
        qrCode: task.qrCode.code,
        reward: task.reward
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating task', error: error.message });
  }
};

// Assign a task to a user
exports.assignTaskToUser = async (req, res) => {
  try {
    const { taskId, userId } = req.body;
    
    // Find the task
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Assign the task to the user
    task.assignedTo = userId;
    await task.save();
    
    // Add the task to the user's tasks array
    user.tasks.push(taskId);
    await user.save();
    
    res.status(200).json({
      message: 'Task assigned successfully',
      task: {
        id: task._id,
        title: task.title,
        assignedTo: user.name
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error assigning task', error: error.message });
  }
};

// Get all tasks for a user
exports.getUserTasks = async (req, res) => {
  try {
    const userId = req.params.userId;
    
    // Verify if the requesting user is authorized to view these tasks
    if (req.user.userId !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized to view these tasks' });
    }
    
    // Get user tasks using the service
    const tasks = await QRCodeService.getUserTasks(userId);
    
    res.status(200).json({
      tasks
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks', error: error.message });
  }
};

// Complete a task via QR code scanning
exports.completeTaskByQRCode = async (req, res) => {
  try {
      const { qrCode } = req.body;
      const userId = req.user?.userId; // Ensure userId is correctly extracted

      // Check if qrCode is undefined or null
      if (!qrCode) {
          return res.status(400).json({ message: "QR Code is required" });
      }

      // Check if userId is available
      if (!userId) {
          return res.status(401).json({ message: "Authentication required" });
      }

      console.log("Processing QR Code:", qrCode); // Debug log

      try {
          // Validate QR code and complete task using the service
          const task = await QRCodeService.validateQRCode(qrCode, userId);

          return res.status(200).json({
              message: "Task completed successfully",
              task: {
                  id: task._id,
                  title: task.title,
                  completedAt: task.completedAt,
                  reward: task.reward,
              },
          });
      } catch (serviceError) {
          // Handle specific error types from the service
          if (serviceError.message === 'Invalid QR code') {
              return res.status(404).json({ message: serviceError.message });
          } else if (serviceError.message === 'This task is not assigned to you') {
              return res.status(403).json({ message: serviceError.message });
          } else if (serviceError.message === 'Task already completed') {
              return res.status(400).json({ message: serviceError.message });
          } else {
              // Re-throw any other service errors to be caught by the outer catch block
              throw serviceError;
          }
      }
  } catch (error) {
      console.error("Error completing task:", error.message);

      res.status(500).json({
          message: "Error completing task",
          error: error.message,
      });
  }
};

// Get all tasks (admin only)
exports.getAllTasks = async (req, res) => {
  try {
    // Check if the user is an admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized access' });
    }
    
    const tasks = await Task.find().populate('assignedTo', 'name email rollNo');
    
    res.status(200).json({ tasks });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks', error: error.message });
  }
};

// Get task details by ID
exports.getTaskById = async (req, res) => {
  try {
    const taskId = req.params.taskId;
    
    const task = await Task.findById(taskId).populate('assignedTo', 'name email rollNo');
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    // Check if the user is authorized to view this task
    if (req.user.role !== 'admin' && task.assignedTo?._id.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Unauthorized to view this task' });
    }
    
    res.status(200).json({ task });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching task', error: error.message });
  }
};

// Generate QR code image for a task
exports.generateTaskQRCode = async (req, res) => {
  try {
    const taskId = req.params.taskId;
    
    // Check if the user is an admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized access' });
    }
    
    // Find the task
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    // Generate QR code image
    const qrCodeImage = await qrCodeGenerator.generateQRCodeImage(task.qrCode.code);
    
    res.status(200).json({
      taskId: task._id,
      taskTitle: task.title,
      qrCode: task.qrCode.code,
      qrCodeImage
    });
  } catch (error) {
    res.status(500).json({ message: 'Error generating QR code', error: error.message });
  }
};

// Update task status when QR code is scanned
exports.updateTask = async (req, res) => {
  try {
    const { userId, message } = req.body;
    
    // Find the task by QR code message
    const task = await Task.findOne({ 'qrCode.code': message });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    // Verify if the task is assigned to the user
    if (task.assignedTo.toString() !== userId) {
      return res.status(403).json({ message: 'This task is not assigned to you' });
    }
    
    // Check if task is already completed
    if (task.status === 'completed') {
      return res.status(400).json({ message: 'Task already completed' });
    }
    
    // Update task status
    task.status = 'completed';
    task.qrCode.scannedAt = new Date();
    task.completedAt = new Date();
    await task.save();
    
    // If there's a reward, add it to the user's balance
    if (task.reward > 0) {
      const user = await User.findById(userId);
      user.balance += task.reward;
      await user.save();
    }
    
    res.status(200).json({
      message: 'Task completed successfully',
      task: {
        id: task._id,
        title: task.title,
        completedAt: task.completedAt,
        reward: task.reward
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating task', error: error.message });
  }
};

// Assign task to all users
exports.assignTaskToAllUsers = async (req, res) => {
  try {
    const { taskId } = req.body;
    
    // Find the task
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    // Get all users
    const users = await User.find();
    if (!users.length) {
      return res.status(404).json({ message: 'No users found' });
    }
    
    // Create an array to store assignment results
    const assignmentResults = [];
    
    // Assign task to each user
    for (const user of users) {
      try {
        // Create a new task instance for each user
        const userTask = new Task({
          title: task.title,
          description: task.description,
          reward: task.reward,
          qrCode: {
            code: QRCodeService.generateQRCode() // Generate unique QR code for each user
          },
          assignedTo: user._id
        });
        
        await userTask.save();
        
        // Add task to user's tasks array
        user.tasks.push(userTask._id);
        await user.save();
        
        assignmentResults.push({
          userId: user._id,
          userName: user.name,
          status: 'success'
        });
      } catch (error) {
        assignmentResults.push({
          userId: user._id,
          userName: user.name,
          status: 'failed',
          error: error.message
        });
      }
    }
    
    res.status(200).json({
      message: 'Task assignment completed',
      results: assignmentResults
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error assigning task to all users', 
      error: error.message 
    });
  }
}; 