const User = require('../models/user');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const ErrorHandler = require('../utils/errorHandler');
const sendToken = require('../utils/jwtToken');

exports.registerUser = catchAsyncErrors(async(req, res, next) => {
    const {name, email, password} = req.body;

    const user = await User.create({
        name,
        email,
        password,
        avater:{
            public_id:"23123",
            url:"23123"
        }
    })

    sendToken(user, 200, res)
})

exports.loginUser = catchAsyncErrors(async(req, res, next) => {
    const {email, password} = req.body;

    //checking if email and password is entered
    if(!email || !password){
        return next(new ErrorHandler("Please enter email & password", 400))
    }

    //finding user in DB
    const user = await User.findOne({email}).select('+password');

    if(!user){
        return next(new ErrorHandler("Invalid Email or password", 401))
    }

    //check if the password is correct or not
    const isPasswordMatched = await user.comparePassword(password);

    if(!isPasswordMatched){
        return next(new ErrorHandler("Invalid Email or password", 402))
    }

    sendToken(user, 200, res)
})