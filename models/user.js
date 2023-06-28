const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
username: {
    type :String, 
    required: true,
},
room : {
type : String,
required: true,
}
});

module.exports = new mongoose.model("User", userSchema);