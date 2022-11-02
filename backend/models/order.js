const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    shippingInfo:{
        address:{
            type: String,
            required: true
        },
        city:{
            type: String,
            required: true
        },
        phoneNo:{
            type: String,
            required: true
        },
        postalCode:{
            type: String,
            required: true
        },
        country:{
            type: String,
            required: true
        }
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    orderItems:[
        {
            name:{
                type: String,
                required:true
            },
            quantity:{
                type: Number,
                required:true
            },
            image:{
                type: String,
                required:true
            },
            price:{
                type: Number,
                required:true
            },
            product:{
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: 'Product'
            },
        }
    ],
    paymentInfo:{
        id:{
            type: String
        },
        status:{
            type: String
        }
    },
    paidAt:{
        type: Date
    },
    itemsPrice:{
        type: Number,
        required:true,
        default: 0.0
    },
    taxPrice:{
        type: Number,
        required:true,
        default: 0.0
    },
    shippingPrice:{
        type: Number,
        required:true,
        default: 0.0
    },
    totalPrice:{
        type: Number,
        required:true,
        default: 0.0
    },
    orderStatus:{
        type: String,
        required: true,
        default: "Processing"
    },
    delieverdAt:{
        type: Date
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Order', orderSchema);


// {
//     "itemsPrice":2.17,
//     "taxPrice":0.56,
//     "shippingPrice":25,
//     "totalPrice":27.9,
//     "orderStatus":"done",
//     "orderItems":[
//             {
//             "product":"order product",
//             "name":"name of order item",
//             "price":2.75,
//             "image":"image of item",
//             "quantity":1 
//             }
//         ],
//     "paymentInfo":{
//         "id":"paymentID",
//         "status":"succeeded"
//     },
//     "shippingInfo":{
//         "address":"NY",
//         "city":"NY",
//         "phoneNo":9866672002,
//         "postalCode":2356,
//         "country":"usa"
//         }
//     }