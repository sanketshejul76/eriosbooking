
const { register, login, readUsers, destroyUsers, deleteUser, chekRoomDate, bookedRoom, GetKey, initiatePayment, verifyPayment } = require("../controlers/userController")
const router = require("express").Router()

router
    .get("/", readUsers)
    .get("/getkey", GetKey)
    .post("/register", register)
    // .post("/book", bookedRoom)
    .post("/chekDate", chekRoomDate)
    .post("/login", login)
    .post("/initiate-Payment", initiatePayment)
    .post("/payment-verification", verifyPayment)
    // .post("/continue-with-google", continueWithGoogle)
    // .put("/account/:id", handleAccount)
    // .put("/update/:id", updateUser)
    .delete("/destroy", destroyUsers)
    .delete("/:id", deleteUser)
// .post("/search", searchUser)
// .get("/:id", readUser)


module.exports = router