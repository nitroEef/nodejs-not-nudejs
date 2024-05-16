// const usersDB = {
//   users: require("../model/users.json"),
//   setUsers: function (data) {
//     this.users = data;
//   },
// };

// const jwt = require("jsonwebtoken");
// require("dotenv").config();


// const handleRefreshToken = (req, res) => {
//   const cookies = req.cookies;
//   if (!cookies?.jwt) return res.sendStatus(401);
//   const refreshToken = cookies.jwt;
//   const foundUser = usersDB.users.find(
//     person => person.refreshToken === refreshToken
//   );
  

//   if (!foundUser) return res.sendStatus(403); // forbidden
//   //   evaluate jwt
//   jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
//     if (err || foundUser.username !== decoded.username)
//       return res.sendStatus(403);
//     const accessToken = jwt.sign(
//       { username: decoded.username },
//       process.env.ACCESS_TOKEN_SECRET,
//       { expiresIn: "60s" }
//     );
//     res.json({ accessToken })



//   });
// };

// module.exports = {handleRefreshToken};






// Object containing user data and a method to set new data
const usersDB = {
  users: require("../model/users.json"), // Loading user data from a JSON file
  setUsers: function (data) { // Method to set new user data
    this.users = data; // Setting the users data property to the provided data
  },
};

// Importing the jsonwebtoken module for working with JSON Web Tokens (JWTs)
const jwt = require("jsonwebtoken");

// Loading environment variables from a .env file into process.env
require("dotenv").config();

// Handler function for refreshing access tokens
const handleRefreshToken = (req, res) => {
  // Retrieving cookies from the request object
  const cookies = req.cookie;
  
  // Checking if a JWT cookie exists, if not, send a 401 Unauthorized status
  if (!cookies?.jwt) return res.sendStatus(401);

  // Extracting the refresh token from the cookies
  const refreshToken = cookies.jwt;

  // Finding the user with the corresponding refresh token
  const foundUser = usersDB.users.find(
    person => person.refreshToken === refreshToken
  );

  // If no user is found with the provided refresh token, send a 403 Forbidden status
  if (!foundUser) return res.sendStatus(403);
  
  // Verifying the refresh token using the secret key and handling errors
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    // If an error occurs during verification or the decoded username doesn't match the found user's username, send a 403 Forbidden status
    if (err || foundUser.username !== decoded.username) return res.sendStatus(403);
    
    // If verification is successful, generate a new access token with a 60-second expiration time
    const accessToken = jwt.sign(
      { "Userinfo":{
        "username": decoded.username }},
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "60s" }
    );
    
    // Sending the new access token as a JSON response
    res.json({ accessToken });
  });
};

// Exporting the handleRefreshToken function for use in other modules
module.exports = { handleRefreshToken };







