const express = require('express')
const mongoose = require('mongoose');
const app = express();
const session = require('express-session');
app.use(express.urlencoded({ extended: true }));
app.set('view engine','ejs');
app.use(express.json());
app.use(session({"secret":"1234567890"}));
app.use(express.static('views'));



let port = 1000;

let username = 'Athinalatifi';
let password = 'athinalatifi';
let db = "del"; 

let User= require("./models/user");
let Customer = require("./models/customer");
let Archived_customer = require('./models/archived_customer');

mongoose.connect("mongodb+srv://"+username+":"+password+"@cluster0.1rslh5n.mongodb.net/"+db);
 

function GetRole(req){
    return req.session.role;
}

function Getemail(req){
    return req.session.email ? req.session.email : " ";
}

app.get('/', (req, res) => {
    res.render('./pages/login', {});    
});

app.post('/', async (req, res) => {
    const user = await User.findOne({"email":req.body.email}).exec();         //.find({email:req.body.email}).exec();

    if (user!=null){
        if(user.password==req.body.password){
            req.session.email= req.body.email;
            req.session.role= user.role; 
            if (user.role=='delivery'){
               res.redirect("/delivery");
            }
            else{
                res.redirect("/support");
            }
        }
        else{
            res.redirect("/")// wrong password           we need to add an alert to this error 
        }
    }
    else{
        res.redirect('/')//wrond email
    }
})

app.get('/delivery', async (req, res) => {
    const customers = await Customer.find({"deliveryMail":Getemail(req)}).exec();
    res.render('./pages/del_home', {'role': GetRole(req), 'deliveryMail':Getemail(req), 'customers':customers});
});



app.get('/support', (req, res) => {
    res.render('./pages/shome')
});

app.get('/information', async (req, res) => {
    id = req.query['id'];
    const customer = await Customer.findOne({"_id":id}).exec();
    res.render('./pages/cinfo', {'customer':customer})
});

app.post('/information', async (req, res) => {
    const customer = await Customer.findOneAndDelete({"_id":id}).exec();   
    console.log(customer); 
    Archived_customer.create({
      _id:customer["_id"],
      fname:customer['fname'],
      lname:customer['lname'],
      address:customer['address'],
      city:customer['city'],
      postal:customer['postal'],
      packetID:customer['packetID'],
      floor:customer['floor'],
      door:customer['door'],
      comment:customer['comment'],
      phone:customer['phone'],
      deliveryMail:customer['deliveryMail'],
    });
    res.redirect('/delivery');
});

app.get('/supportchat', (req, res) => {
    res.render('./pages/schat')
});

app.get('/delchat', (req, res) => {
    res.render('./pages/delchat')
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect("/");
})

app.listen(port , () => {
    console.log("Server runs on port ", port);
});