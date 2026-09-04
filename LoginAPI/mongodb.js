//FUNCTION LOOKING FOR EXISTIN USER IN MONGODB COLLECTIONS:
async function findExistingUser(username,email,User){
    const existingUser = await User.findOne({
        $or: [
            {username: username},
            {email: email}
        ]
    })
    return existingUser;
}

export { findExistingUser };