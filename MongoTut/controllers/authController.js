const User = require("../model/User")
const bcrypt = require("bcrypt"); // Import bcrypt library for password hashing
const jwt = require("jsonwebtoken"); // Import jsonwebtoken library for generating JWTs

const fsPromises = require("fs").promises; // Import promises-based file system module
const path = require("path"); // Import path module for file paths

const handleLogin = async (req, res) => {// Define async function to handle login requests
  const { user, pwd } = req.body; // Destructure username and password from request body
  if (!user || !pwd) // Check if username or password is missing
    return res // If so, return a 400 Bad Request status with a message
      .status(400)
      .json({ Message: "Username and Password are required" });

  const foundUser = await User.findOne({username:user}).exec();
  if (!foundUser) return res.sendStatus(401); // If user not found, return a 401 Unauthorized status

  const match = await bcrypt.compare(pwd, foundUser.password); // Compare hashed password with provided password

  if (match) {
    // If passwords match

    const roles = Object.values(foundUser.roles);
    console.log(roles)
    // Create JWTs
    const accessToken = jwt.sign(
      // Generate access token
      {
        UserInfo: {
          username: foundUser.username,
          roles: roles,
        },
      }, // Payload containing username
      process.env.ACCESS_TOKEN_SECRET, // Secret key for signing token
      { expiresIn: "60s" } // Token expiration time
    );
    const refreshToken = jwt.sign(
      // Generate refresh token
      { username: foundUser.username }, // Payload containing username
      process.env.REFRESH_TOKEN_SECRET, // Secret key for signing token
      { expiresIn: "1d" } // Token expiration time
    );

    // saving refresh token with current user 
    foundUser.refreshToken = refreshToken;
    const result = await foundUser.save();
    console.log(result);
    console.log(roles);
    
    const otherUsers = usersDB.users.filter(
      // Exclude current user from user list
      (person) => person.username !== foundUser.username
    );
    const currentUser = { ...foundUser, refreshToken }; // Add refresh token to current user object
    usersDB.setUsers([...otherUsers, currentUser]); // Update user data with new refresh token
    await fsPromises.writeFile(
      // Write updated user data to JSON file
      path.join(__dirname, "../model/users.json"), // File path
      JSON.stringify(usersDB.users) // Convert user data to JSON format
    );

    // create secure cooies with resfresh token 
    res.cookie("jwt", refreshToken, {
      // Set cookie containing refresh token
      httpOnly: true, // Cookie cannot be accessed by client-side scripts
      secure: true, sameSite:"none", maxAge: 24 * 60 * 60 * 1000, // Cookie expiration time (24 hours)
    });

    // send authorization roles and access to user
    res.json({ accessToken }); // Send access token in response
  } else 
    // If passwords do not match
    res.sendStatus(401); // Return a 401 Unauthorized status
  
};

module.exports = { handleLogin }; // Export handleLogin function for use in other modules
