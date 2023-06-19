const asyncHandler = require("express-async-handler")
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken')
const User = require("../modeles/User")
const bookRoom = require("../modeles/AddRooms")
const bookingRoomUser = require("../modeles/Booking")
const { isEqual, format, parseISO, } = require("date-fns")
const { eachDayOfInterval } = require("date-fns/fp")
const { v4: uuid } = require("uuid")
const razorpay = require("razorpay")
const crypto = require("crypto")


exports.readUsers = asyncHandler(async (req, res) => {
    // validation
    try {
        const result = await User.find()
        res.json({
            message: "user read success",
            result

        })
    } catch (error) {

    }
})

exports.register = asyncHandler(async (req, res) => {
    try {

        // validation
        const { password, email } = req.body
        const Found = await User.findOne({ email })
        if (Found) {
            return res.status(400).json({
                message: "email already exist"
            })
        }
        const hashPass = bcrypt.hashSync(password, 10)
        const result = await User.create({ ...req.body, password: hashPass, role: "user" })
        res.json({
            message: "user register success"
        })
    } catch (error) {
        res.json(error || error.message)
    }
})


exports.login = asyncHandler(async (req, res) => {
    try {

        const { email, password } = req.body
        const found = await User.findOne({ email })
        if (!found) {
            return res.status(400).json({ message: "email not found" })
        }
        const verify = bcrypt.compareSync(password, found.password)
        if (!verify) {
            return res.status(400).json({ message: "invalid password" })
        }
        const token = jwt.sign({ id: found._id, role: found.role }, process.env.JWT_KEY)

        // res.cookie("token", token, {})
        res.cookie("token", token)
        res.json({
            message: "user login success",
            result: {
                id: found._id,
                name: found.name,
                email: found.email,
                role: found.role
            }
        })
    } catch (error) {
        res.json(error || error.message)
    }
})

exports.destroyUsers = asyncHandler(async (req, res) => {
    try {
        const result = await User.deleteMany()
        res.json({
            message: "user destroy success",
            result
        })

    } catch (error) {
        res.json(error || error.message)
    }
})
exports.deleteUser = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params
        const result = await User.findByIdAndDelete(id)
        if (!result) {
            return res.status(400).json({
                message: "invalid id"
            })
        }
        res.json({
            message: "user delete success"
        })
    } catch (error) {
        res.json(error || error.message)
    }
})

// exports.bookedRoom = asyncHandler(async (req, res) => {
//     try {
//         if (req.body.fromdate && req.body.chekoutdate) {
//             const result = await bookingRoomUser.create({
//                 ...req.body,
//                 fromdate: new Date(`${req.body.fromdate}`),
//                 chekoutdate: new Date(`${req.body.chekoutdate}`)
//             })
//             return res.json({
//                 message: "booked room success",
//                 result
//             })
//         }
//         return res.json("something Went Werong")
//     } catch (error) {
//         return res.json(error || error.message)
//     }

// })

exports.chekRoomDate = asyncHandler(async (req, res) => {
    try {

        const allReadyBook = await bookingRoomUser.find()
        const totalrooms = await bookRoom.find()
        const bookedRooms = []
        const endarr = []

        const { date } = req.body
        const { avfromDate, avchekDate } = date
        allReadyBook.map((item, i) => {
            let Newfromdate = format(new Date(item.fromdate), "dd,MM,yyyy")
            let Newchekoutdate = format(new Date(item.chekoutdate), "dd,MM,yyyy")
            function getDatesBetween(startDate, endDate) {
                const currentDate = new Date(startDate.getTime());
                const dates = [];
                while (currentDate <= endDate) {
                    dates.push(new Date(currentDate));
                    currentDate.setDate(currentDate.getDate() + 1);
                }
                return dates;
            }
            let allDates = getDatesBetween(new Date(avfromDate), new Date(avchekDate));

            allDates.map(arg => {
                let formated = format(new Date(arg), "dd,MM,yyyy")
                if (formated === Newfromdate || formated === Newchekoutdate) {
                    bookedRooms.push(item)
                }
            })
        })
        for (let i = 0; i < totalrooms.length; i++) {
            let found = false;
            for (let j = 0; j < bookedRooms.length; j++) {
                if (JSON.stringify(totalrooms[i]._id) === JSON.stringify(bookedRooms[j].roomId)) {
                    found = true;
                }
            }

            if (!found && !endarr.includes(totalrooms[i]._id || totalrooms[i].roomId)) {
                endarr.push(totalrooms[i]);
            }
        }


        res.json({
            message: "Filter Rooms You Want",
            result: endarr

        })
    } catch (error) {
        res.json(error || error.message)
    }
})
exports.GetKey = asyncHandler(async (req, res) => {
    res.json({ key: process.env.KEY_ID })
})

exports.initiatePayment = asyncHandler(async (req, res) => {
    const instance = new razorpay({
        key_id: process.env.KEY_ID,
        key_secret: process.env.KEY_SECRET
    })
    const { Coursefee } = req.body
    instance.orders.create({
        amount: Coursefee * 100,
        currency: "INR",
        receipt: uuid()
    }, (err, order) => {
        if (err) {
            return res.status(400).json({
                message: "Order Fail " + err
            })
        }
        res.json({
            message: "Payment Intitiated",
            result: order.id
        })
    })
})

exports.verifyPayment = asyncHandler(async (req, res) => {

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body
    const key = `${razorpay_order_id}|${razorpay_payment_id}`
    const signature = crypto
        .createHmac("sha256", process.env.KEY_SECRET)
        .update(key.toString())
        .digest("hex")
    if (signature !== razorpay_signature) {
        return res.status(400).json({
            message: "Invalid Signature"
        })
    }
    if (!req.cookies) {
        return res.status(401).json({ message: `Inavlid Request` })
    }
    const { token } = req.cookies
    if (!token) {
        return res.status(401).json({ message: `Please Provide Token` })
    }

    const { id } = jwt.verify(token, process.env.JWT_KEY)
    const userDetails = await User.findById({ _id: id })

    if (req.body.roomDetails.fromdate && req.body.roomDetails.chekoutdate) {
        const result = await bookingRoomUser.create({
            roomimg: req.body.roomDetails.img,
            title: req.body.roomDetails.title,
            fet: req.body.roomDetails.fet,
            roomId: req.body.roomDetails._id,
            status: req.body.roomDetails.active,
            userId: id,
            price: req.body.roomDetails.price,
            userName: userDetails.name,
            fromdate: new Date(`${req.body.roomDetails.fromdate}`),
            chekoutdate: new Date(`${req.body.roomDetails.chekoutdate}`)
        })
        return res.json({
            message: "booked room success",
            result
        })
    }



})