const mongoose = require("mongoose");
require('dotenv').config();


    const init = () =>{
        mongoose.set('strictQuery', false);

        mongoose.connect(process.env.SERVER_URI, { useNewUrlParser: true, useUnifiedTopology: true}).then(() =>{
            console.log("Connected");
        }).catch((err) =>{
            console.log(err);
        });


        mongoose.connection.once('open', ()=>{
            console.log("open");
        })

        mongoose.connection.on('connected', () => {
            console.log('The bot has connected to mongoose');
        });

        mongoose.connection.on('disconnected', () => {
            console.log('The bot has disconnected from mongoose');
        });

        mongoose.connection.on('err', (err) => {
            console.log('database error: ' + err);
        });

        process.on('exit', () =>{
            mongoose.connection.close();
            console.log("Closing connection");
            process.exit();
        })
        process.on('SIGINT', () =>{
            mongoose.connection.close();
            console.log("Closing connection");
            process.exit();
        })
    }

    module.exports = init;