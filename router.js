var express=require('express');
var app=express();
const multer = require('multer');
const session = require("express-session");
app.use(express.static("bookshop"));
app.use(express.static("bookshop/css"));
app.use(express.static("bookshop/html"));
app.use(express.static("bookshop/uploads"));

app.set('view engine','ejs');

app.use(session({
    secret: "y78887897",
    saveUninitialized: true,
    resave: true
}));


/* create database for stablish connection*/
var my=require("mysql");
var con= my.createConnection({
    host:'127.0.0.1',
    user:'root',
    password:'',
    database:'project'
});
con.connect(function(err){
    if(err)
        throw err;
    console.log("connect to mysql")
});
/*-------------------------------------*/


app.get("/login",function(req,res)
{
res.sendFile("./bookshop/html/login.html",{root:__dirname});
});
app.get("/index",function(req,res)
{
res.sendFile("./bookshop/html/index.html",{root:__dirname});
});

app.get("/home",function(req,res)
{
res.sendFile("./bookshop/html/home.html",{root:__dirname});
});

app.get("/contact",function(req,res)
{
res.sendFile("./bookshop/html/contact.html",{root:__dirname});
});

app.get("/about",function(req,res)
{
res.sendFile("./bookshop/html/about.html",{root:__dirname});
});
app.get("/books",function(req,res)
{
res.sendFile("./bookshop/html/books.html",{root:__dirname});
});
app.get("/Register",function(req,res)
{
res.sendFile("./bookshop/html/register.html",{root:__dirname});
});

app.get("/admin",function(req,res)
{
res.sendFile("./bookshop/html/adminlogin.html",{root:__dirname});
});

app.get("/forgot",function(req,res)
{
res.sendFile("./bookshop/html/forgot.html",{root:__dirname});
});

app.get("/addbook",function(req,res)
{
res.sendFile("./bookshop/html/addbook.html",{root:__dirname});
});


var bd=require('body-parser');
var ed=bd.urlencoded({extended:false}) 

app.use(function (req, res, next) {
  res.locals.aname = req.session.aname;
  next();
});




/*------------------------contact-----------------------*/
app.post("/Contactprocess",ed,function(req,res)
{
    var d=req.body.N;
    var a=req.body.E;
    var b=req.body.P;
    var c=req.body.M;
    var q="insert into contact values('"+d+"','"+a+"','"+b+"','"+c+"')";
   con.query(q,function(err,result)
   {
    if(err)
        throw err;
    res.send("successfully send");
});
});

/*-----------------------register------------------*/
app.post("/regprocess",ed,function(req,res)
{
    var a=req.body.N;
    var b=req.body.E;
    var c=req.body.P;
    var q="insert into users values('"+a+"','"+b+"','"+c+"')";
   con.query(q,function(err,result){
    if(err)
        throw err;
    res.send("you are successfully registered")
   }) ;

});

/*-----------------------------login-------------*/
app.post("/loginprocess",ed,function(req,res){
var a=req.body.E;
var b=req.body.P;
console.log(a);
console.log(b);
var q="select * from users where email='"+a+"'";
con.query(q,function(err,result){
    if(err)
        throw err;
    console.log(result);
    var L=result.length;
    if(L>0){
        var p=result[0].pwd;
        if(p==b)
            res.send("Login successfully");
        else
        res.send("Password is invalid");
    }
    else
    res.send("Email is invalid");
});    
});

/*------------------------Adminlogin------------------*/
app.post("/Aloginprocess",ed,function(req,res){
    var a=req.body.E;
    var b=req.body.P;
    console.log(a);
    console.log(b);
    var q="select * from admin where email='"+a+"'";
    con.query(q,function(err,result){
        if(err)
            throw err;
        console.log(result);
        var L=result.length;
        if(L>0){
            var p=result[0].pwd;
            if(p==b)
{
req.session.aname=result[0].name;
res.render('ahome',{na:result[0].name});
 
}           else
            res.send("Password is invalid");
        }
        else
        res.send("Email is invalid");
    });
        
    });
/*--------------------viewusers----------------------*/

    app.get("/viewusers",function(req,res)
    {
if(req.session.aname==null)
res.redirect("/admin");
        var q="select * from users";
        con.query(q,function(err,result){
            if(err)
                throw err;
            res.render('viewusers',{data:result});
        });
    });
    
/*----------------------viewenquery---------------------*/
    app.get("/vienq",function(req,res)
    {
if(req.session.aname==null)
res.redirect("/admin");
        var q="select * from contact";
        con.query(q,function(err,result){
            if(err)
                throw err;
            res.render('vienq',{data:result});
        });
    });
/*----------------------multer code---------------------*/
    const st = multer.diskStorage({
        destination: function (req, file, cb) {
      
          cb(null, 'bookshop/uploads/');
        },
        filename: function (req, file, cb) {
          
          cb(null, file.originalname);
        }
      });
      
      const upload = multer({ storage: st });
/*----------------------addbooks---------------------*/
    
app.post("/addbookprocess",ed, upload.single('bookImage'),function(req,res)
{
if(req.session.aname==null)
res.redirect("/admin");

    var a=req.body.bookId;
    var b=req.body.bookName;
    var c=req.body.price
    var d=req.body.category
    var e=req.body.description;
    var f=req.file.filename;
  var q="insert into book values('"+a+"','"+b+"',"+c+",'"+d+"','"+e+"','"+f+"')";
 con.query(q,function(err,result){
    if(err)
        throw err;
       res.redirect("vbooks");
});
});

app.get("/vbooks",function(req,res)
{
if(req.session.aname==null)
res.redirect("/admin");
    var q="select * from book";
    con.query(q,function(err,result){
        if(err)
            throw err;
        res.render('vbooks',{data:result});
    });
});

app.listen(5000,function(req,res)
{
console.log("Project run on port no 5000");
});
