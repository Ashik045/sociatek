// login handler
// @ts-ignore
const userLoginHandler = async (req, res) => {
  res.send("User is already logged in");
};

// user register handler
// @ts-ignore
const userRegHandler = async (req, res) => {
  try {
    res.send("User is already logged in");
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
