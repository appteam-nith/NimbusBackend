const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

// generate Token
// const generateAccessAndRefereshTokens = async(userId) =>{
//   try {
//       const user = await User.findById(userId)
//       const accessToken = user.generateAccessToken()
//       const refreshToken = user.generateRefreshToken()

//       console.log(accessToken, refreshToken);
//       user.refreshToken = refreshToken
//       await user.save({ validateBeforeSave: false })

//       return {accessToken, refreshToken}


//   } catch (error) {
//       console.log(error);
//   }
// }

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    if (!accessToken || !refreshToken) {
      throw new Error('Failed to generate tokens');
    }

    // console.log(accessToken, refreshToken);

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    console.log(error);
    throw new Error(error.message || 'Error generating tokens');
  }
};




// Create a new user
exports.createUser = async (req, res) => {
  try {
    const { name, email, rollNo, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = new User({ name, email, rollNo, password });
    await user.save();

    res.status(201).json({ message: 'User created successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
};

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
};


exports.getUSer = async (req, res) => {
    try {
        const user = await User.find({
            rollNo: req.params.rollNo
        });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user', error: error.message });
    }
}


// exports.loginUser = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // Validate input
//     if (!email || !password) {
//       return res.status(400).json({ message: 'Email and password are required' });
//     }

//     // Find user by email
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(401).json({ message: 'Invalid credentials' });
//     }

//     // Compare passwords (plaintext comparison - NOT secure for production)
//     if (user.password !== password) {
//       return res.status(401).json({ message: 'Invalid credentials' });
//     }

//     // Return user data without sensitive information
//     const userData = {
//       name: user.name,
//       email: user.email,
//       rollNo: user.rollNo,
//       balance: user.balance
//     };

//     res.status(200).json({ message: 'Login successful', user: userData });
//   } catch (error) {
//     res.status(500).json({ message: 'Error logging in', error: error.message });
//   }
// };






// exports.loginUser = async (req, res) => {
//   // ... existing code ...
  
//   const token = jwt.sign(
//     { userId: user._id, role: user.role },
//     process.env.JWT_SECRET,
//     { expiresIn: '1h' }
//   );

//   res.status(200).json({ 
//     message: 'Login successful', 
//     token,
//     user: userData 
//   });
// };


// Enhanced login controller
// exports.loginUser = async (req, res) => {
//   try {
//       const { email, password } = req.body;

//       const user = await User.findOne({ email });
//       if (!user) {
//           return res.status(401).json({ message: 'Invalid credentials' });
//       }

//       const isMatch = await bcrypt.compare(password, user.password);
//       if (!isMatch) {
//           return res.status(401).json({ message: 'Invalid credentials' });
//       }
//       const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id)

//       // Save refresh token to user document
//       user.refreshToken = refreshToken;
//       await user.save();

//       res.status(200).json({
//           accessToken,
//           refreshToken,
//           user: {
//               id: user._id,
//               name: user.name,
//               email: user.email,
//               role: user.role,
//               balance: user.balance
//           }
//       });
//   } catch (error) {
//       console.log(error)
//       res.status(500).json({ message: 'Error logging in', error: error.message });
//   }
// };
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Verify the password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate access and refresh tokens
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    // Save the refresh token in the user document
    user.refreshToken = refreshToken;
    await user.save();

    // Send the tokens as response
    res.json({
      accessToken,
      refreshToken,
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
        balance: user.balance
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error logging in', error: err.message });
  }
};
exports.getUserProfile = async (req, res) => {
  try {
      const user = await User.findById(req.user.userId)
          .select('-password -refreshToken');
          
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      res.status(200).json(user);
  } catch (error) {
      res.status(500).json({ message: 'Error fetching profile', error: error.message });
  }
};


exports.getBalance = async (req, res) => {
  try {
    const userId = req.params.userId; // Assuming userId is passed in the URL

    // Find the user by their unique roll number or ID (based on your schema)
    const user = await User.findById(userId); 

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Send back the balance of the user
    res.status(200).json({ balance: user.balance });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
