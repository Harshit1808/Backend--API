const mongoose = require("mongoose");
const { MongoClient } = require('mongodb');

const DBURI = process.env.DBURI;
//"mongodb://127.0.0.1:27017/myapp"
mongoose
    .connect(DBURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        // useFindAndModify: false,
        // useCreateIndex: true,
        // poolSize: 10,
    })
    .then(() => console.log("Connection successful!"))
    .catch((e) => {
        console.log(e)
        throw new Error("Error Occurred!");
    });

process.on('SIGINT', function () {
    mongoose.connection.close(function () {
        console.log('Mongoose disconnected on app termination');
        process.exit(0);
    });
});

mongoose.Promise = require("bluebird");

