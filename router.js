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
var q="select * from book";
con.query(q,function(err,result){
    res.render("books",{data:result});
});
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

app.get("/orders",function(req,res){
    res.render("orders");
});

var bd=require('body-parser');
var ed=bd.urlencoded({extended:false}) 

app.use(function (req, res, next) {
  res.locals.aname = req.session.aname;
  res.locals.uname = req.session.uname;

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
            {
                req.session.uname=result[0].name;
                req.session.uemail=result[0].email;


                res.redirect("/books")
                 
                } 
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
else{
        var q="select * from users";
        con.query(q,function(err,result){
            if(err)
                throw err;
            res.render('viewusers',{data:result});
        });
    }
    });
    
/*----------------------viewenquery---------------------*/
    app.get("/vienq",function(req,res)
    {
if(req.session.aname==null)
res.redirect("/admin");
else{
        var q="select * from contact";
        con.query(q,function(err,result){
            if(err)
                throw err;
            res.render('vienq',{data:result});
        });
    }
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
else{
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
}
});

/*-----------------View book---------------------------------*/
app.get("/vbooks",function(req,res)
{
if(req.session.aname==null)
res.redirect("/admin");
else{
    var q="select * from book";
    con.query(q,function(err,result){
        if(err)
            throw err;
        res.render('vbooks',{data:result});
    });
}
});

app.get("/avorders",function(req,res)
{
if(req.session.aname==null)
res.redirect("/admin");
else{
    var q="select * from orders";
    con.query(q,function(err,result){
        if(err)
            throw err;
        res.render('avorders',{data:result});
    });
}
});

/*-----------------delete user for viewusers---------------------------------*/
app.get("/deleteuser",(req,res)=>{
    var a=req.query.em;
    var q="Delete from users where email='"+a+"'";
    con.query(q,function(err,result){
        if(err)
            throw err;
        res.redirect("/viewusers");
});
});
/*-----------------delete users for vienq--------------------------*/
app.get("/deletecontact",(req,res)=>{
    var a=req.query.em;
    var q="Delete from contact where email='"+a+"'";
    con.query(q,function(err,result){
        if(err)
            throw err;
        res.redirect("/vienq");
});
});
/*---------------delete book for vbooks-------------------------*/

app.get("/deletebook",(req,res)=>{
    var a=req.query.em;
    var q="Delete from book where bookid='"+a+"'";
    con.query(q,function(err,result){
        if(err)
            throw err;
        res.redirect("/vbooks");
});
});


/*----------------------Add to Cart----------*/

app.get("/AddCart",function(req,res)
{

    if(req.session.uname==null)
        res.redirect("/login");
    else
    {

        var ue=req.session.uemail;
        var un=req.session.uname;
        var a=req.query.bid;
        var b=req.query.bn;
        var c=req.query.p;
        var d=req.query.c;
        var e=req.query.d;
        var f=req.query.bi;
       var q="insert into cart(uname,uemail,bookid,bname,price,category,description,bimage) values('"+un+"','"+ue+"','"+a+"','"+b+"','"+c+"','"+d+"','"+e+"','"+f+"')";
       con.query(q,function(err,result)
       {
        if(err)
            throw err;
        res.redirect("vcart");

       });
}
});

/*----------------------vcart------------------------*/

app.get("/vcart",function(req,res)
{
    
    if(req.session.uname==null)
        res.redirect("/login");
    else
    {
    var ue=req.session.uemail;
    var q="Select * from cart where uemail='"+ue+"'";
    con.query(q,function(err,result)
{
    if(err)
        throw err;
    res.render("vcart",{data:result});
});
}
});
/*---------------------delete cart-------------------------*/
app.get("/delcart",function(req,res)
{

    var a=req.query.sno;
    var q="delete from cart where sno='"+a+"'";
    con.query(q,function(err,result){
        if(err) throw err;
        res.redirect("/vcart");
});
});

app.get("/delorder",function(req,res)
{

    var a=req.query.sno;
    var q="delete from orders where sno='"+a+"'";
    con.query(q,function(err,result){
        if(err) throw err;
        res.redirect("/vorders");
});
});

app.get("/delorders",function(req,res)
{

    var a=req.query.sno;
    var q="delete from orders where sno='"+a+"'";
    con.query(q,function(err,result){
        if(err) throw err;
        res.redirect("/avorders");
});
});

/*-----------------order now-------------*/
app.post("/orderprocess",ed,function(req,res)
{
var N=req.session.uname;
var E=req.session.uemail;
var ph=req.body.phone;
var add=req.body.address;
var pin=req.body.pincode;
var q="select price,bname from cart where uemail='"+E+"'";
con.query(q,function(err,result)
{
var p=0;
var bn="";
for(i=0;i<result.length;i++)
{
    p=p+Number(result[i].price);
    bn=bn+","+result[i].bname;

}
var qt="insert into orders(UserName,UserEmail,PhoneNumber,Address,Pin,Amount,pname) values('"+N+"','"+E+"','"+ph+"','"+add+"','"+pin+"','"+p+"','"+bn+"')";
con.query(qt,function(error,result2)
{
res.redirect("/vorders");

});

});

});
/*-----------------------order view----------------*/

app.get("/vorders",function(req,res){
var em=req.session.uemail;
var q="select * from orders where useremail='"+em+"'";
con.query(q,function(err,result){
if(err)
    throw err;
res.render("orderview",{data:result});

})

});
/*--------------------adminlogout--------------*/

app.get("/alogout",function(req,res){
    req.session.destroy((err) => {
        res.redirect('/admin');
      })
});

app.get("/ulogout",function(req,res){
    req.session.destroy((err) => {
        res.redirect('/login');
      })
});
app.listen(5000,function(req,res)
{
console.log("Project run on port no 5000");
});
