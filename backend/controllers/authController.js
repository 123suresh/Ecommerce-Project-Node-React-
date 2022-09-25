const User = require('../models/user');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const ErrorHandler = require('../utils/errorHandler');
const sendToken = require('../utils/jwtToken');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');
const { send } = require('process');

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

//Forgot password => /api/v1/password/forgot
exports.forgotPassword = catchAsyncErrors(async(req, res, next) => {
    const user = await User.findOne({email:req.body.email});
    if(!user) return next(new ErrorHandler("User not found with this email", 404))
    //Get reset token
    const resetToken = user.getResetPasswordToken();

    await  user.save({validateBeforeSave: false})

    //Create reset password url
    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/password/reset/${resetToken}`;

    const message = `Your password reset token is as follow : \n\n${resetToken}\n\n If you haven't requested this email, then ignore it.`

    try{
        await sendEmail({
            email: user.email,
            subject: "ShopIt password recovery",
            message
        })
        res.status(200).json({
            success: true,
            message: `Email send to ${user.email}`
        })
    }
    catch(error){
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await  user.save({validateBeforeSave: false})
        return next(new ErrorHandler(error.message, 500))
    }
})

//Reset password => /api/v1/password/reset/:token
exports.resetPassword = catchAsyncErrors(async(req, res, next) => {
    //Hash URL token 
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: {$gt: Date.now()}
    })

    if(!user){
        return next(new ErrorHandler(`Password reset token is invalid or has been expire`, 400))
    }

    if(req.body.password !== req.body.confirmPassword){
        return next(new ErrorHandler(`Password does not match`, 400))
    }

    //Setup new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    sendToken(user, 200, res)
})

//Get currently logged in user details => /api/v1/me
exports.getUserProfile = catchAsyncErrors(async(req, res, next) => {
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        user
    })
})

//Update / Change password => /api/v1/password/update
exports.updatePassword = catchAsyncErrors(async(req, res, next) => {
    const user = await User.findById(req.user.id).select('+password');

    //Check previous user password
    const isMatched = await user.comparePassword(req.body.oldPassword);
    if(!isMatched){
        return next(new ErrorHandler('Old password is incorrect', 400))
    }
    user.password = req.body.password;
    await user.save();

    sendToken(user, 200, res);
})

//Update user profile => /api/v1/me/update
exports.updateProfile = catchAsyncErrors(async(req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email
    }

    //Update avatar too

    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true
    })
})

//logout
exports.logout = catchAsyncErrors(async(req, res, next) => {
    // res.cookie('token', null, {
    //     expires: new Date(Date.now()),
    //     httpOnly: true
    // })
    res.header('x-auth-token', null);
    res.status(200).json({
        success: true,
        message:"Logged out"
    })
})

//get all user
exports.allUsers = catchAsyncErrors(async(req, res, next) => {
    const user = await User.find();
    res.status(200).json({
        success: true,
        user
    })
})

//Get user deatils => /api/v1/admin/user/:id
exports.getUserDetails = catchAsyncErrors(async(req, res, next) => {
    const user = await User.findById(req.params.id);
    if(!user){
        return next(new ErrorHandler(`User doesn't exist with id ${req.params.id}`))
    }

    res.status(200).json({
        success: true,
        user
    })
})

//Update user profile => /api/v1/admin/user/:id
exports.updateUserByAdmin = catchAsyncErrors(async(req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role
    }

    const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true
    })
})

//Delete user=> /api/v1/admin/user/:id
exports.deleteUser = catchAsyncErrors(async(req, res, next) => {
    const user = await User.findById(req.params.id);
    if(!user){
        return next(new ErrorHandler(`User doesn't exist with id ${req.params.id}`))
    }

    //Remove avatar from cloudinary - TODO

    await user.remove();

    res.status(200).json({
        success: true,
    })
})