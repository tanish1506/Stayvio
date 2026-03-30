const path = require("path");
require('dotenv').config({path : path.join(__dirname, '../.env')});

const mongoose = require('mongoose')
const initdata = require('./data')

const Listing = require('../models/listing')

const Mongo_url = process.env.MONGO_URL;

main()
.then(() => {
    console.log("Connected to DB");
}).catch((err)=>{
    console.log(err);
})

async function main() {
    await mongoose.connect(Mongo_url)
}

const initDB = async () =>{
    await Listing.deleteMany({});
    initdata.data = initdata.data.map((obj) => ({...obj , owner : "69c98cb31efc7d433aa5c3af"}))
    await Listing.insertMany(initdata.data)
    console.log("Data initialized");
}


initDB();