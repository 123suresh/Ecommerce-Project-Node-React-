const app = require('./app');
const connectDatabse = require('./config/database');

const dotenv = require('dotenv');

//setting up config file
dotenv.config({path:'backend/config/config.env'})

//connecting to Db
connectDatabse();


app.listen(process.env.PORT, () => {
    console.log(`Server started on PORT: ${process.env.PORT} in ${process.env.NODE_ENV} mode.`)
})