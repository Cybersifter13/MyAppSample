var bodyParser = require("body-parser"),
mongoose = require("mongoose"),
express = require("express"),
ejs = require("ejs"),
emmet = require("emmet"),
methodOverride = require("method-override"),
expressSanitizer = require("express-sanitizer"),
nodemon = require("nodemon"),
app = express();


//Connect mongoose to mongodb
 mongoose.connect("mongodb://localhost/blog", {useNewUrlParser: true});
 app.set("view engine", "ejs");
 app.use(express.static("public"));
 app.use(bodyParser.urlencoded({extended: true}));
 app.use(expressSanitizer());
 app.use(methodOverride("_method"));
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});
 
var Blog =  mongoose.model("Blog", blogSchema);
 
//  Create var for blogSchema = 'Blog'
 //var Blog = Blog.create({
//      title:"Test Blog!",
//      image: "https://images.unsplash.com/photo-1550575978-850d273f20b7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto             =format&fit=crop&w=600&q=60",
//      body: "This is a BLOG POST!",
     
     
//  });
 
// //RESTFUL ROUTES
 app.get("/", function(req, res){
    res.redirect("/blogs");
     
  });     
 
 app.get("/blogs", function(req, res){
    Blog.find({}, function(err, blogs){
         if(err){
           console.log(err);
         } else {
            res.render("index", {blogs: blogs});
         }  
     });
  });
 
 //New ROUTE
 app.get("/blogs/new", function(req, res){
    res.render("new");
 });
//Create ROUTE
app.post("/blogs", function(req, res){
    //Create blog
    req.body.blog.body = req.sanitize(req.body.blog.body);
    console.log("================");
    console.log(req.body);
    Blog.create(req.body.blog, function(err, newBlog){
        if(err){
            res.render("new");
        } else {
            //Then redirect to the index
            res.redirect("/blogs");
        }
    });
});

//SHOW ROUTE
app.get("/blogs/:id", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        } else {
            res.render("show", {blog: foundBlog});     
        }
    });
});

 //EDIT ROUTE
 app.get("/blogs/:id/edit", function(req, res){
     Blog.findById(req.params.id, function(err, foundBlog){
            if(err){
                res.redirect("/blogs");
            } else {
                res.render("edit", {blog: foundBlog});
            }    
 });
         
 });     
 
 //UPDATE ROUTE
 app.put("/blogs/:id", function(req, res){
      req.body.blog.body = req.sanitize(req.body.blog.body);     
     Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
         if(err){
             res.redirect("/blogs");
         } else {
             res.redirect("/blogs/" + req.params.id);
         }
     });
 });
 
//DELETE ROUTE
app.delete("/blogs/:id", function(req, res){
    //Destroy Blog
    Blog.findByIdAndRemove(req.params.id, function(err){
         if(err){
             res.redirect("/blogs");
         } else {
             res.redirect("/blogs");
         }
    });
    //Redirect Somewhere
    
});


 app.listen(3000, function()
 {
   console.log("Blog has begun!");
 });
  

  
  