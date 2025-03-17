const { v4: uuidv4 } = require('uuid');
const Task = require('../models/task');
const User = require('../models/user');

/**
 * Generate a unique QR code for a task
 * @returns {string} A unique QR code string
 */
const generateQRCode = () => {
  return uuidv4();
};

/**
 * Validate a QR code and mark the associated task as completed
 * @param {string} qrCode - The QR code to validate
 * @param {string} userId - The ID of the user scanning the QR code
 * @returns {Promise<Object>} The completed task or an error
 */
const validateQRCode = async (qrCode, userId) => {
  try {
    // Find the task by QR code
    const task = await Task.findOne({ 'qrCode.code': qrCode });
    if (!task) {
      throw new Error('Invalid QR code');
    }
    
    // Check if the task is assigned to the user
    if (!task.assignedTo) {
      throw new Error('This task is not assigned to any user');
    }
    
    if (task.assignedTo.toString() !== userId) {
      throw new Error('This task is not assigned to you');
    }
    
    // Check if the task is already completed
    if (task.status === 'completed') {
      throw new Error('Task already completed');
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
    
    return task;
  } catch (error) {
    throw error;
  }
};

/**
 * Get all tasks for a user
 * @param {string} userId - The ID of the user
 * @returns {Promise<Array>} Array of tasks assigned to the user
 */
const getUserTasks = async (userId) => {
  try {
    const user = await User.findById(userId).populate('tasks');
    if (!user) {
      throw new Error('User not found');
    }
    
    return user.tasks;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  generateQRCode,
  validateQRCode,
  getUserTasks
}; 