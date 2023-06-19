const { AddRooms, getRooms, deleteRoom, updateRoom, destroyRoom, destroyBookingsRooms, getBookingsRooms, readUsers } = require("../controlers/adminControler")
const { adminProtected } = require("../middlwares/auth")
const router = require("express").Router()

router
    .get("/", getRooms)
    .get("/alluser", readUsers)
    .get("/allboked", getBookingsRooms)
    .post("/addRooms", adminProtected, AddRooms)
    .delete("/destroy", adminProtected, destroyRoom)
    .delete("/destroy-booking", adminProtected, destroyBookingsRooms)
    .delete("/:id", adminProtected, deleteRoom)
    .patch("/:id", adminProtected, updateRoom)

module.exports = router