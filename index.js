const express = require('express');
const mongoose = require('mongoose');
const app = express();
const session = require('express-session');
const http = require('http');
const { Server } = require('socket.io');
app.use(express.urlencoded({ extended: true }));
app.set('view engine','ejs');
app.use(express.json());
app.use(session({"secret":"1234567890"}));
app.use(express.static('views'));
const _Port = 1000;

 
const server = http.createServer(app); //Sockets for Live chat.
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:"+_Port]  ,
        methods: ["GET", "POST"]
    },
    
});

server.listen(_Port, () => {
    console.log("Server and Socket.IO are running on http://localhost:"+_Port);
});

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);
    socket.on('chat message', (msg) => {
        console.log('Message received:', msg);
        io.emit('chat message', msg); 
    });
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});



let username = 'Athinalatifi';
let password = 'athinalatifi';
let db = "del"; 

let User= require("./models/user");
let Customer = require("./models/customer");
let Archived_customer = require('./models/archived_customer');

mongoose.connect("mongodb+srv://"+username+":"+password+"@cluster0.1rslh5n.mongodb.net/"+db);

const crypto = require('crypto');
function calculateHash(input) {
    const hash = crypto.createHash('sha256');
    hash.update(input);
    return hash.digest('hex');
}


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

    //Verifying user existence.
    if (user!=null){
        if(user.password==calculateHash(req.body.password)){
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
            res.redirect("/")// wrong password           
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

app.get('/support', async (req, res) => {
    const deliveries = await User.find({'role': 'delivery'}).exec();
    res.render('./pages/shome', {'deliveries':deliveries});
});

app.get('/information', async (req, res) => {
    id = req.query['id'];
    const customer = await Customer.findOne({"_id":id}).exec();
    res.render('./pages/cinfo', {'customer':customer, 'id' : id});
});

app.post('/delivered', async (req, res) => {
    const customer = await Customer.findOneAndDelete({"_id":id}).exec();   
    Archived_customer.create({  // Marks customer parcels as delivered.
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
      status:'delivered'
    });
    res.redirect('/delivery');
});

app.post('/delhelp', async (req, res) => {
    try {
        const customer = await Customer.findOne({"_id":id}).exec();
        res.render('./pages/delchat', {'port':_Port, 'deliveryMail' : customer.deliveryMail, 'customer': customer})
    } catch {
        res.redirect('/');
    }
});

app.get('/supportchat', (req, res) => {
    res.render('./pages/schat', {'port': _Port}); 
});

app.get('/delchat', (req, res) => {
    res.render('./pages/delchat', {'port':_Port}); 
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect("/");
})

app.get('/deliveryroute', async (req, res) => {
    id = req.query['id'];
    const delivery = await User.findOne({'_id':id}).exec();
    email = delivery['email'];
    const customers = await Customer.find({'deliveryMail':email}).exec();
    res.render('./pages/delroute', {"delivery": delivery, 'customers':customers});
});

app.get('/addCustomers', async (req, res) => {
    let deliveries = await User.find({'role':'delivery'}).exec();
    res.render('./pages/addCustomers', {'deliveries':deliveries});
});

app.post('/addCustomers', async (req, res) => {
    let deliveries = await User.find({'role':'delivery'}).exec();

    packets = req.body.packetID.split(',');
    Customer.create({  // Adding new costumer to a delivery person.
        fname:req.body['fname'],
        lname:req.body['lname'],
        address:req.body['address'],
        city:req.body['city'],
        postal:req.body['postal'],
        packetID:packets,
        floor:req.body['floor'],
        door:req.body['door'],
        comment:req.body['comment'],
        phone:req.body['phone'],
        deliveryMail:req.body['deliveryMail'],
        status:'pending'
    });
    res.render('./pages/addCustomers',{'deliveries':deliveries});

})

app.post('/delete', async (req, res) =>{
    const customer = await Customer.findOneAndDelete({"_id":req.body['customer']}).exec();   
    Archived_customer.create({ // Deleting a costumer.
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
      status:'NOT delivered'
    });
    const deliveries = await User.find({'role': 'delivery'}).exec();
    res.render('./pages/shome', {'deliveries':deliveries});
});
