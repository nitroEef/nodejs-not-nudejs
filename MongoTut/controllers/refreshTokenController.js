const User = require("../model/User")
// Importing the jsonwebtoken module for working with JSON Web Tokens (JWTs)
const jwt = require("jsonwebtoken");



// Handler function for refreshing access tokens
const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies){
    console.log('yhhhhhhhh')
    return res.sendStatus(401);
  } 
  const refreshToken = cookies.jwt;
  const foundUser = await User.findOne({refreshToken}).exec();



  // If no user is found with the provided refresh token, send a 403 Forbidden status
  if (!foundUser) return res.sendStatus(403);
  
  // Verifying the refresh token using the secret key and handling errors
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    // If an error occurs during verification or the decoded username doesn't match the found user's username, send a 403 Forbidden status
    if (err || foundUser.username !== decoded.user) return res.sendStatus(403);
    
    const roles = Object.values(foundUser.roles)
    // If verification is successful, generate a new access token with a 60-second expiration time
    const accessToken = jwt.sign(
      { "Userinfo":{
        "username": decoded.username ,
      "roles":roles}, },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "60s" }
    );
    
    // Sending the new access token as a JSON response
    res.json({ accessToken });
  });
};

// Exporting the handleRefreshToken function for use in other modules
module.exports = { handleRefreshToken };







