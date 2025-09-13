require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cookieParser = require("cookie-parser");

const Blog = require("./models/blog");

const userRoute = require("./routes/user");
const blogRoute = require("./routes/blog");
const { checkForAuthentication } = require("./middlewares/authentication");

const app = express();
const PORT = process.env.PORT ||  8000; // this p.env.port is provided by the cloud provider of deploying the project.

mongoose.connect(process.env.MONGO_URL)
.then(()=>{console.log("MongoDB is connected successfully!")})
.catch((err)=>{console.log(err, "Found!")});

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.resolve("./public")));
app.use(checkForAuthentication("token"));


app.get("/", async (req, res)=>{
    const allBlogs = await Blog.find({});
    res.render("home", {
        user: req.user,
        blogs: allBlogs,
    });
});

app.use("/user", userRoute);
app.use("/blog", blogRoute);

app.listen(PORT, ()=>{console.log(`Server is started at ${PORT}`)});