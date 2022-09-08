const mongoose = require('mongoose');

const  connectDatabse = () => {
    mongoose.connect(process.env.DB_LOCAL_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        // useCreateIndex: true
    }).then(con=>{
        console.log(`MongoDB Database connected with HOST: ${con.connection.host}`)
    })
}
module.exports = connectDatabse