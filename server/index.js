const express = require('express');
const app = express();

const fileuploader = require('express-fileupload');
const cookieParser = require('cookie-parser');
const routes = require('./routes/apiRoutes');
require('dotenv').config()

const cors = require('cors');
app.use(cors({
    origin: "http://localhost:3000", // your React frontend URL
    credentials: true               // allow cookies, auth headers
}));

app.use(express.json());
app.use(cookieParser());
app.use(fileuploader({
    useTempFiles: true,
    tempFileDir: '/temp/',
}));
app.use('/api/v1',routes);


const dbConnect = require('./config/dbConnect');
dbConnect();

const cloudinaryConnect = require('./config/cloudinaryConnect');
cloudinaryConnect();

const PORT = process.env.PORT;
app.listen(PORT,()=>{
    console.log(`Server live at port ${PORT}`);
});

app.get('/',(req,res)=>{
    res.send(`<h1>Server Live</h1>`)
});

