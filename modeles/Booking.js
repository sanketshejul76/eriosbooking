const mongoose = require("mongoose")

const bookingSchema = mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: "user",
        required: true
    },
    userName: {
        type: String,
        ref: "user",
        required: true
    },
    fromdate: {
        type: Date,
        required: true
    },
    chekoutdate: {
        type: Date,
        required: true
    },
    roomId: {
        type: mongoose.Types.ObjectId,
        required: true
    },

    roomimg: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    fet: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },


    status: {
        type: Boolean,
        required: true
    }

}, { timestamps: true })

module.exports = mongoose.model("booking", bookingSchema)