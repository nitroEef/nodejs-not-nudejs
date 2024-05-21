const User = require("../model/User")

const handleLogout = async(req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204);
    const refreshToken = cookies.jwt;
  
    // is refreshtoken in db ?
  const foundUser = await User.findOne({refreshToken}).exec();
  
  
    if (!foundUser) {
      res.clearCookie("jwt", { httpOnly: true })
      return res.sendStatus(204)
    }
  
    const otherUsers = usersDB.users.filter(
      (person) => person.refreshToken !== foundUser.refreshToken
    );
    const currentUser = { ...foundUser, refreshToken: '' };
    usersDB.setUsers([otherUsers, currentUser]);
  
    await fsPromises.writeFile(
      path.join(__dirname, '..', 'model', 'users.json')
    )
  
    res.clearCookie('jwt', {httpOnly: true})
    return res.sendStatus(204);
  }
  
  module.exports = { handleLogout }