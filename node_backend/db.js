const { MongoClient } = require('mongodb')
let dbConnection 
let uri = `mongodb+srv://dbUser:${process.env.URI_PASSWORD}@cluster0.ylidcm5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0&ssl=true`;


module.exports = {
    connectToDb: (cb) => {
        MongoClient.connect(uri, {dbName: "FridgeBot"})
        .then((client) => {
            dbConnection = client.db()
            return cb()
        }).catch(err => {
            console.log(err)
            return cb(err)
        })
    },
    getDb: () => dbConnection
}