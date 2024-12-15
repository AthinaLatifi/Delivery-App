const mongoose = require('mongoose');
var archived_customer = new mongoose.Schema({
    _id: String,
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
}, {collection:"archive"});

const Archived_customer = mongoose.model('Archived_customer', archived_customer);
module.exports = Archived_customer;