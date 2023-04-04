// external imports
const bcrypt = require("bcrypt");

// internal import
// @ts-ignore
const User = require("../models/usermode");

// login handler
// @ts-ignore
const userLoginHandler = async (req, res) => {
  const { email, password, username } = req.body;

  try {
    // check if the username or email matches
    const isEmail = await User.findOne({ email: email });
    const isUserName = await User.findOne({ username: username });

    if (isEmail || isUserName) {
      // check if the password is correct
      const isRightPassword = await bcrypt.compare(
        password,
        isEmail.password | isUserName.password
      );

      if (isRightPassword) {
        res.status(200).json({
          message: isEmail ? isEmail : isUserName,
        });
      } else {
        res.status(500).json({
          error: "Password is incorrect!",
        });
      }
    } else {
      res.status(500).json({
        error: "Can't find account!",
      });
    }
  } catch (error) {
    res.status(500).json({
      error: "Login failed!",
    });
  }
};

// user register handler
// @ts-ignore
const userRegHandler = async (req, res) => {
  const { email, password, username } = req.body;

  try {
    const isEmail = await User.findOne({ email: email });
    const isUserName = await User.findOne({ username: username });

    // check if useremail or username is already in use
    if (!isEmail) {
      if (!isUserName) {
        // hashing the password
        const hashPassword = await bcrypt.hash(password, 10);

        // create a new user object
        const newUser = await new User({
          ...req.body,
          password: hashPassword,
        });

        newUser.save();

        res.status(200).json({
          message: "Registration successful.",
        });
      } else {
        res.status(500).json({
          error: "Username already in use!",
        });
      }
    } else {
      res.status(500).json({
        error: "Email already in use!",
      });
    }
  } catch (error) {
    res.status(500).json({
      error: "User registration failed!",
    });
  }
};

module.exports = {
  userLoginHandler,
  userRegHandler,
};
