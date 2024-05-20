// const usersDB = {
//   users: require("../model/users.json"),
//   setUsers: function (data) {
//     this.users = data;
//   },
// };

// const bcrypt = require("bcrypt");

// const jwt = require("jsonwebtoken");
// require("dotenv").config();
// const fsPromises = require("fs").promises;
// const path = require("path");

// const handleLogin = async (req, res) => {
//   const { user, pwd } = req.body;
//   if (!user || !pwd)
//     return res
//       .status(400)
//       .json({ Message: "Username and Password are required" });

//   const foundUser = usersDB.users.find(person => person.username === user);

//   if (!foundUser) return res.sendStatus(401); // unauthorised

//   const match = await bcrypt.compare(pwd, foundUser.password);

//   if (match) {
//     // Create JWTs
//     const accessToken = jwt.sign(
//       { "username": foundUser.username },
//       process.env.ACCESS_TOKEN_SECRET,
//       { expiresIn: "60s" }
//     );
//     const refreshToken = jwt.sign(
//       { "username": foundUser.username },
//       process.env.REFRESH_TOKEN_SECRET,
//       { expiresIn: "1d" }
//     );

//     const otherUsers = usersDB.users.filter(
//       person => person.username !== foundUser.username
//     );
//     const currentUser = { ...foundUser, refreshToken };
//     usersDB.setUsers([...otherUsers, currentUser]);
//     await fsPromises.writeFile(
//       path.join(__dirname, "../model/users.json"),
//       JSON.stringify(usersDB.users)
//     );
//     res.cookie("jwt", refreshToken, {
//       httpOnly: true,
//       maxAge: 24 * 60 * 60 * 1000,
//     });
//     res.json({ accessToken });
//   } else {
//     res.sendStatus(401);
//   }
// };

// module.exports = { handleLogin };





const usersDB = {
  users: require("../model/users.json"), // Load user data from JSON file
  setUsers: function (data) { // Method to set user data
    this.users = data; // Update user data
  },
};

const bcrypt = require("bcrypt"); // Import bcrypt library for password hashing

const jwt = require("jsonwebtoken"); // Import jsonwebtoken library for generating JWTs
require("dotenv").config(); // Load environment variables from .env file

const fsPromises = require("fs").promises; // Import promises-based file system module
const path = require("path"); // Import path module for file paths

const handleLogin = async (req, res) => { // Define async function to handle login requests
  const { user, pwd } = req.body; // Destructure username and password from request body
  if (!user || !pwd) // Check if username or password is missing
    return res // If so, return a 400 Bad Request status with a message
      .status(400)
      .json({ Message: "Username and Password are required" });

  const foundUser = usersDB.users.find(person => person.username === user); // Find user in user database
  if (!foundUser) return res.sendStatus(401); // If user not found, return a 401 Unauthorized status

  const match = await bcrypt.compare(pwd, foundUser.password); // Compare hashed password with provided password

  if (match) { // If passwords match

    const roles = Object.values
    // Create JWTs
    const accessToken = jwt.sign( // Generate access token
      { "Userinfo":{ 
        "username":foundUser.username,
        "roles":roles}
       }, // Payload containing username
      process.env.ACCESS_TOKEN_SECRET, // Secret key for signing token
      { expiresIn: "60s" } // Token expiration time
    );
    const refreshToken = jwt.sign( // Generate refresh token
      { "username": foundUser.username }, // Payload containing username
      process.env.REFRESH_TOKEN_SECRET, // Secret key for signing token
      { expiresIn: "1d" } // Token expiration time
    );

    const otherUsers = usersDB.users.filter( // Exclude current user from user list
      person => person.username !== foundUser.username
    );
    const currentUser = { ...foundUser, refreshToken }; // Add refresh token to current user object
    usersDB.setUsers([...otherUsers, currentUser]); // Update user data with new refresh token
    await fsPromises.writeFile( // Write updated user data to JSON file
      path.join(__dirname, "../model/users.json"), // File path
      JSON.stringify(usersDB.users) // Convert user data to JSON format
    );
    res.cookie("jwt", refreshToken, { // Set cookie containing refresh token
      httpOnly: true, // Cookie cannot be accessed by client-side scripts
      maxAge: 24 * 60 * 60 * 1000, // Cookie expiration time (24 hours)
    });
    res.json({ accessToken }); // Send access token in response
  } else { // If passwords do not match
    res.sendStatus(401); // Return a 401 Unauthorized status
  }
};

module.exports = { handleLogin }; // Export handleLogin function for use in other modules