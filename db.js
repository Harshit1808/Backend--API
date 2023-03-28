const mongoose = require("mongoose");
const { MongoClient } = require('mongodb');

const DBURI = "mongodb://harsh123:harsh123@cluster0-shard-00-00.qxqxw.mongodb.net:27017,cluster0-shard-00-01.qxqxw.mongodb.net:27017,cluster0-shard-00-02.qxqxw.mongodb.net:27017/?ssl=true&replicaSet=atlas-abfz96-shard-0&authSource=admin&retryWrites=true&w=majority"
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

