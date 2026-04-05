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
const owners = [
    "69c98cb31efc7d433aa5c3af",
    "69cac8f22f358b6b8d318969",
    "69cac90d2f358b6b8d318b01",
    "69cac9292f358b6b8d318c99",
    "69cac9502f358b6b8d318e31",
]

const initDB = async () =>{
    await Listing.deleteMany({});
    initdata.data = initdata.data.map((obj,index) => ({
        ...obj , 
        owner : owners[index % owners.length]
    }));
    await Listing.insertMany(initdata.data)
    console.log("Data initialized");
}


initDB();