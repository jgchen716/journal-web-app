//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const _ = require("lodash");

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

const homeStartingContent = "Hi! Welcome to my web application Jonathan's Journal! This is a web app that I will use to track my journey in studying Computer Science at the University of Pennsylvania and becoming a software engineer";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/blogDB");

let posts = [];
const postSchema = new mongoose.Schema({
    title: String,
    body: String
});

const Post = mongoose.model("Post", postSchema);

app.get("/", function(req, res) {
    Post.find({}, function(err, posts) {
        if (!err) {
            res.render('home', {
                homeStartingContent: homeStartingContent,
                posts: posts
            });
        }
    });

});

app.get("/about", function(req, res) {
    res.render('about', {
        aboutContent: aboutContent,
    });
});

app.get("/contact", function(req, res) {
    res.render('contact', {
        contactContent: contactContent,
    });
});

app.get("/compose", function(req, res) {

    res.render('compose');
});

app.post("/compose", function(req, res) {
    const post = new Post({
        title: req.body.postTitle,
        body: req.body.postBody
    });

    post.save(function(err) {
        if(!err) {
            res.redirect("/");
        }
    });
});

app.get("/posts/:postId", function(req, res) {


    posts.forEach(function(post) {
        if (_.lowerCase(post.title) === _.lowerCase(req.params.postName)) {
            res.render('post', {
                title: post.title,
                content: post.body
            });
        }
    });

    const id = req.params.postId;

    Post.findOne({_id: id}, function(err, blogPost) {
        res.render("post", {
            title: blogPost.title,
            body: blogPost.body
        });
    });


});


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
