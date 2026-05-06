const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();
const cors = require('cors');
const userRoute = require('./Routes/userRoute')

const passport = require('passport');
const session = require('express-session');
require('dotenv').config();

const errorHandler = require('./middlewares/Error');
const productRouter = require('./Routes/productRoute');
const categoryRouter = require('./Routes/CategoryRoute');
const searchRouter = require('./Routes/searchRoute');
const fileUpload = require('express-fileupload');

// Mongodb Connection
const connection = require('./config/mongodb');
const cloudinaryConnect = require('./Config/cloudinary');
connection();

// Cloudinary Connection
cloudinaryConnect();

// clodinary filepath
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/'
}));



// Google Auth
require('./config/googleAuth');


// Middleware
app.use(session({
    secret: 'secretkey',
    resave: false,
    saveUninitialized: true
}));

app.use(express.json());
app.use(cors({
    origin: ["http://localhost:5173"],
    credentials: true
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());

//routes
app.use('/api/auth', userRoute);
app.use('/api/product', productRouter);
app.use('/api/category', categoryRouter);
app.use('/api/search' , searchRouter);

app.get('/ping', (req, res) => {
    res.send('pong')
})


// Error Handler
app.use(errorHandler);

const port = process.env.PORT || 3000;
app.listen(port, console.log('server is running at', Number(port)))