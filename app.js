const express=require('express');
const app=express();
const ejs = require("ejs");
const mysql = require('mysql');
const bodyParser=require('body-parser')
const multer  = require('multer')
var path = require('path')
var session = require('express-session')
var cookieParser = require('cookie-parser');
// var app = express()
// app.set('trust proxy', 1) // trust first proxy
// app.use(session({
//   secret: 'keyboard cat',
//   resave: false,
//   saveUninitialized: true,
//   cookie: { secure: true }
// }))

// app.use(cookieParser());

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)) //Appending extension
  }
})

var upload = multer({ storage: storage });

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));


var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "newDB"
});



app.get('/login',function(req,res){
  res.render('login');
})
app.post('/login',function(req,res){
  let email=req.body.email;
  let pass=req.body.password;
  
  con.query("SELECT * FROM users where email='"+email+"' and password='"+pass+"' ", function (err, result) {
    if (err) throw err;
    // rr=result;
    // console.log('000000000'+result);
    if(result){
      res.render('dashboard',{user:result[0].email})
    }else{
      console.log('------------------lol--------------');
      document.getElementById('error').innerText="Account Not Found";
    }
    // res.send(result)
    // res.render('dashboard',{user:result[0].email})
    // res.render('contacts',{rec:result})
});
})







app.get("/",function(req,res) {
   res.render('home') 
})

app.get('/contacts',function(req,res){
    con.query("SELECT * FROM users", function (err, result, fields) {
        if (err) throw err;
        rr=result;
        res.render('contacts',{rec:result})
    });
})

app.get('/contacts/:ext',function(req,res){

    con.query("SELECT * FROM users WHERE email = "+"'"+req.params.ext+"'", function (err, result) {
        if (err) throw err;
        res.render('update',{email:result[0].email,pass:result[0].password})
      });

})

app.post('/contacts/:ext',upload.single('avatar'),function(req,res){//////////////////

    let email=req.body.email;
    let pass=req.body.password;
    let img=req.file.filename;
    console.log('----------------'+img);


    var sql = "UPDATE users SET email = '"+email+"', password = '"+pass+"',image='"+img+"'"+" WHERE email = '"+req.params.ext+"'";
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log(result.affectedRows + " record(s) updated");
      // res.redirect('/contacts');
      res.status(201).json({
        msg:'Data Updated',
        data:req.body,
        image:req.file
      })
  
    });

})

app.post('/contacts',function(req,res){
    res.redirect('/contacts/'+req.body.btn)
})


app.post("/",upload.single('avatar'),function(req,res){
    let email=req.body.email;
    let pass=req.body.password;
    let img=req.file.filename;

    var sql = "INSERT INTO users (email, password,image) VALUES ('"+email+"','"+pass+"','"+img+"')";
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("1 record inserted");
    });

    // res.redirect('/');
    res.status(201).json({
      msg:'Data Inserted',
      data:req.body,
      image:req.file
    })

    // res.send(req.body);
})


app.listen(3000,function(req,res){
    console.log("Port Active: 3000");
})


//   con.connect(function(err) {
//     if (err) throw err;
//     console.log("Connected!");
//     var sql = "CREATE TABLE users (email VARCHAR(255), password VARCHAR(255))";
//     con.query(sql, function (err, result) {
//       if (err) throw err;
//       console.log("Table created");
//     });
//   });

// con.connect(function(err) {
//     if (err) throw err;
//     console.log("Connected!");
//     var sql = "ALTER TABLE customers ADD COLUMN id INT AUTO_INCREMENT PRIMARY KEY";
//     con.query(sql, function (err, result) {
//       if (err) throw err;
//       console.log("Table altered");
//     });
//   });

// con.connect(function(err) {
//     if (err) throw err;
//     console.log("Connected!");
//     var sql = "create database newDB";
//     con.query(sql, function (err, result) {
//       if (err) throw err;
//       console.log("Table altered");
//     });
//   });
