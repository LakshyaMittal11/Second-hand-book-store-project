var express=require('express');
var app=express();
app.use(express.static("bookshop"));
app.use(express.static("bookshop/css"));
app.use(express.static("bookshop/html"));

app.get("/",function(req,res)
{
res.sendFile("./bookshop/html/index.html",{root:__dirname});
});
app.get("/index",function(req,res)
{
res.sendFile("./bookshop/html/index.html",{root:__dirname});
});
app.get("/login",function(req,res)
{
res.sendFile("./bookshop/html/login.html",{root:__dirname});
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


app.listen(3000);