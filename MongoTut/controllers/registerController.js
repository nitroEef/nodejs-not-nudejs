const User = require('../model/User');



// Object containing user data and a method to set new data
// const usersDB = {
//   users: require("../model/users.json"), // Loading user data from a JSON file
  // setUsers: function (data) { // Method to set new user data
    // this.users = data; // Setting the users data property to the provided data
//   },
// };

// Promisified version of the 'fs' module for file system operations
// const fsPromises = require("fs").promises;

// Module for working with file paths
// const path = require("path");

// Module for hashing passwords using bcrypt
const bcrypt = require("bcrypt");

// Handler function for creating a new user
const handleNewUser = async (req, res) => {
  // Extracting username and password from the request body
  const { user, pwd } = req.body;

  // Checking if both username and password are provided, if not, sending a 400 Bad Request status with a message
  if (!user || !pwd)
    return res
      .status(400)
      .json({ Message: "Username and password are required" });

  const duplicate = await User.findOne({ username: user}).exec()
  if (duplicate) return res.sendStatus(409);

  try {
    // Encrypting the password using bcrypt with a cost factor of 10
    const hashedPwd = await bcrypt.hash(pwd, 10);

    // Creating a new user object with the hashed password
    const newUser = { "username": user, 
    "roles": {"User":2001} ,"password": hashedPwd };

    // Updating the user database with the new user
    // usersDB.setUsers([...usersDB.users, newUser]);

    // Writing the updated user data to the JSON file
    // await fsPromises.writeFile(
    //   path.join(__dirname, "../model/users.json"),
    //   JSON.stringify(usersDB.users)
    // );

    // Logging the updated user data to the console
    // console.log(usersDB.users);

    // Sending a 201 Created status with a success message indicating the creation of the new user
    res.status(201).json({'Successs': `New User ${user} created`})

  } catch (error) {
    // Handling any errors that occur during the process and sending a 500 Internal Server Error status with an error message
    res.status(500).json({ Message: error.message });
  }
}; 

// Exporting the handleNewUser function for use in other modules
module.exports = {handleNewUser};














