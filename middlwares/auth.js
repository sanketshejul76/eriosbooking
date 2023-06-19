const asyncHandler = require("express-async-handler")
const jwt = require("jsonwebtoken")
// const User = require("../modeles/User")
const User = require("../modeles/User")

exports.adminProtected = asyncHandler(async (req, res, next) => {
    // /const token = req.headers.authorization
    const token = req.cookies.token
    if (!token) {
        return res.status(401).json({
            message: "please provide token"
        })
    }
    console.log(token, "cookis");
    // const tk = token.split(" ")[1]
    const { id } = jwt.verify(token, process.env.JWT_KEY)
    const result = await User.findById(id)
    if (!result) {
        return res.status(401).json({
            message: "login with admin"
        })
    }
    if (result.role !== "admin") {
        return res.status(401).json({
            message: "admin only Route,Please get in touch with admin"
        })
    }
    req.body.adminId = id
    next()
})

    // const jwt = require("jsonwebtoken")
    // exports.authProtected = (req, res, next) => {
    //     if (!req.cookies) {
    //         return res.status(401).json({
    //             message: "No Cookie Found"
    //         })
    //     }
    //     const { token } = req.cookies
    //     if (!token) {
    //         return res.status(401).json({ message: "token missing" })
    //     }
    //     jwt.verify(token, process.env.JWT_KEY, (err, decode) => {
    //         console.log(err)
    //         if (err) {
    //             return res.status(401).json({ message: "invalid token" })
    //         }
    //         const { id, role } = decode
    //         if (role === "user") {
    //             req.body.userId = id
    //         } else if (role === "doctor") {
    //             req.body.doctorId = id
    //         }
    //         req.body.role = role
    //         next()
    //     })

    // } 

