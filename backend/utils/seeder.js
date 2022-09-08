const Product = require('../models/product');
const connectDatabse = require('../config/database');
const dotenv = require('dotenv')

const products = require('../data/product');

dotenv.config({path:'backend/config/config.env'})

connectDatabse();

const seedProducts = async () => {
    try{
        await Product.deleteMany();
        console.log("All products are deleted");

        await Product.insertMany(products)
        console.log("All products are added");

        process.exit();
    }
    catch(error){
        console.log(error.message);
        process.exit();
    }
}

seedProducts();