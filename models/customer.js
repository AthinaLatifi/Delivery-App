const mongoose = require('mongoose');
var customer = new mongoose.Schema({
    id: String,
    fname: String,
    lname: String,
    address: String,
    city: String,
    postal: String,
    packetID: Array ,
    floor: String,
    door: String,
    comment: String,
    phone: String,
    deliveryMail: String,
    status: String 
}, {collection:"costumers"});

const Customer = mongoose.model('Customer', customer);
module.exports = Customer;