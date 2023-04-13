const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
    id: Number,
    title: String,
    path: String,
    onClick: String,
    subMenuItems: [
        {
            id: Number,
            title: String,
            path: String,
            onClick: String
        }
    ]
});

module.exports = mongoose.model("MenuItem", menuItemSchema);