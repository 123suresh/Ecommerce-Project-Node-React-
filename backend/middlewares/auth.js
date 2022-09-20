const jwt = require('jsonwebtoken');
const User = require('../models/user');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('./catchAsyncErrors');

exports.isAuthenticatedUser = catchAsyncErrors(async(req, res, next)=>{
    const token = req.header('x-auth-token');
    if(!token) {
        return next(new ErrorHandler('Login first to access resources', 401))
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = await User.findById(decoded.id)
    next()
})

//Handling user role
exports.authorizedRole = (...roles) =>{
    return (req, res, next) => {
        if(!roles.includes(req.user.role)){
            return next(new ErrorHandler(`Role ${req.user.role} is not allowed to access this resource`, 403))
        }
        next();
    }
}