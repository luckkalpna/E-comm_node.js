const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name:String,
    price:String,
    category:String,
    useId:String,
    company:String
});

module.exports = mongoose.model("products", productSchema);