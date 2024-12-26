var express=require('express');
var app=express();
app.use(express.static("bookshop"));
app.use(express.static("bookshop/css"));
app.use(express.static("bookshop/html"));

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

var bd=require('body-parser');
var ed=bd.urlencoded({extended:false}) 
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
            res.send("valid user");
        else
        res.send("Password is invalid");
    }
    else
    res.send("Email is invalid");
});
    
});


app.listen(5000,function(req,res)
{
console.log("Project run on port no 5000");
});
