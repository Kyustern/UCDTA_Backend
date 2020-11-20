const { find, getById } = require('./mongoResolvers/read')
const { insertDocument } = require('./mongoResolvers/write')

const { compare, genSalt, hash } = require('bcryptjs')

const register = async ({email, password}, req) => {
    
    if (!email || !password) { 
        throw new Error('You must provide an email and password.'); 
    }
    
    const {err, documentArray} = await find({email}, "users")
    
    console.log("err, documentArray", err, documentArray)

    if (err) throw new Error('Trouble checking if user exists')

    if (documentArray.length > 0) throw new Error('This email is already taken');

    const salt = await genSalt()
    //if genSalt fails => return error 500
    const passwordHash = await hash(password, salt)

    const user = {
        password: passwordHash,
        email
    }

    
    const insertResult = await insertDocument(user, "users")

    if (!insertResult) {
        throw new Error('Trouble inserting new user into database')
    } else {
        req.session.userId = insertResult._id
        return insertResult     
    }

}

const login = async ({email, password}, req) => {

    console.log("login --> email, password", email, password)

    if (req.session.userId) throw new Error('Already logged in')

    if (!email || !password) throw new Error('You must provide an email and password.');

    const {err, documentArray} = await find({ email }, "users")

    if (err) throw new Error('You must provide an email and password.');

    const retreivedUser = documentArray[0]

    const isMatch = await compare(password, retreivedUser.password)

    if (isMatch) {
        req.session.userId = retreivedUser._id
        console.log("req.session.userId", req.session.userId)
    }
    return isMatch
}

const logout = async (req) => {
    await req.session.destroy((err) => {
        if (err) return false            
    })
    return true
}

module.exports = {
    register,
    login,
    logout
}