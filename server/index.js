const express = require ("express");
const cookieParser = require('cookie-parser');
const fileUpload = require("express-fileupload");
const cors = require('cors');

require("dotenv").config();
const app = express();

const courseRoutes = require("./routes/course");
const paymetRoutes = require("./routes/payment");
const profileRoutes = require("./routes/profile");
const userRoutes = require("./routes/user");



const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));
app.use(
    cors({
    origin:'*',
    credentials:true,
})
)
const {databaseConnect} = require("./config/databaseConnect");
const {connectToCloudinary}= require("./config/cloudinary");

databaseConnect();
connectToCloudinary();

app.use("/api/v1/Auth",userRoutes);
app.use("/api/v1/course",courseRoutes);
app.use("/api/v1/profile",profileRoutes);
app.use("/api/v1/payment",paymetRoutes)


app.get("/",()=>{
 return res.json({
        succes:true,
        message:'your server is up and running'
    })
});

app.listen(PORT,()=>{
    console.log(`server is started at port:${PORT}`)
})
