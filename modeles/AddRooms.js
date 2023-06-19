const mongoose = require("mongoose")

const AddRoomsSchema = mongoose.Schema({
    img: {
        type: String,
    },

    title: {
        type: String,
        required: true
    },
    fet: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    active: {
        type: Boolean,
        enum: [true, false], default: true
    },
    // currentBooking: [],

}, { timestamps: true })

module.exports = mongoose.model("addRooms", AddRoomsSchema)