const express= require('express');
const app = express();
const User = require("../models/user")
const router = express.Router();

router.get("/users", async (req,res) => {
   const users = await User.find();
   res.status(200).json(users);
})

router.get("/users/:id", async (req,res) => {
    const user = await User.find({userId: req.params.id});
    res.status(200).json(user);
})

// delete all
 router.delete("/users", async (req,res) => {
    await User.deleteMany();
    res.send("done");
 })
router.delete("/users/:id", async (req,res) => {
    await User.deleteOne({userId: req.params.id});
    res.send('done');
})
module.exports = router;