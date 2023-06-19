const asyncHandler = require("express-async-handler")
const bookRoom = require("../modeles/AddRooms")
const bookingRoomUser = require("../modeles/Booking")
const User = require("../modeles/User")
exports.getRooms = asyncHandler(async (req, res) => {
    try {

        const result = await bookRoom.find()
        res.json({ message: "Rooms geted Success", result })
    } catch (error) {
        res.json(error || error.message)
    }
})
exports.getBookingsRooms = asyncHandler(async (req, res) => {
    try {
        const result = await bookingRoomUser.find()

        res.json({
            message: "booked room get all success",
            result: result
        })

    } catch (error) {
        res.json(error || error.message)
    }
})

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

exports.AddRooms = asyncHandler(async (req, res) => {
    try {
        await bookRoom.create(req.body)
        res.json({ message: "Rooms Added Success" })

    } catch (error) {
        res.json(error || error.message)
    }
})
exports.deleteRoom = asyncHandler(async (req, res) => {
    try {

        const { id } = req.params
        const result = await bookRoom.findByIdAndDelete(id)
        if (!result) {
            return res.status(400).json({
                message: "invalid id"
            })
        }
        res.json({
            message: "Room delete success"
        })
    } catch (error) {
        res.json(error || error.message)
    }
})
exports.destroyRoom = asyncHandler(async (req, res) => {
    try {

        const result = await bookRoom.deleteMany()
        res.json({
            message: "Room delete  all success",
            result
        })
    } catch (error) {
        res.json(error || error.message)
    }
})
exports.destroyBookingsRooms = asyncHandler(async (req, res) => {
    try {
        const result = await bookingRoomUser.deleteMany()
        res.json({
            message: "Room delete  all success",
            result
        })

    } catch (error) {
        res.json(error || error.message)
    }
})
exports.updateRoom = asyncHandler(async (req, res) => {
    try {

        const { id } = req.params
        const result = await bookRoom.findByIdAndUpdate(id, req.body, { new: true })
        if (!result) {
            return res.status(400).json({
                message: "invalid id"

            })
        }
        res.json({
            message: "update room success"
        })
    } catch (error) {
        res.json(error || error.message)
    }
})


