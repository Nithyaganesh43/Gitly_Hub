const User = require("../models/user");

async function validateUserInfromations(fullName, username, password, platform, email) {
    const user = await User.findOne({ platform, email });
    if (!user) throw new Error("User Not Found");

    if (user.userName && user.fullName && user.password) throw new Error("User Already Registered");

    if (username.length < 8 || username.length > 20) 
        throw new Error("Username must be between 8 and 20 characters");

    const isUserNameUnique = await User.findOne({ userName: username });
    if (isUserNameUnique) throw new Error("Username already taken");

    if (password.length < 8 || password.length > 20) 
        throw new Error("Password must be between 8 and 20 characters");

    if (fullName.length < 3 || fullName.length > 50) 
        throw new Error("Full name must be between 3 and 50 characters");
}

module.exports = validateUserInfromations;
