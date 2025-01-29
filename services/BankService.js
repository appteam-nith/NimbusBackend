const User = require('../models/user');

async function addMoneyToUser(userId, ammount) {
    const user = await User.findById(userId);
    if (!user) {
        throw new Error('User not found');
    }
    user.balance += ammount;
    await user.save();
    return user;
}

module.exports = {
    addMoneyToUser,
};