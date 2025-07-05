const mongoose = require('mongoose');


function connect() {
    mongoose.connect(process.env.MONGO_URL).then(() => {
        console.log('User service connected to MongoDB');
    }).catch(err => {
        console.log(err);
    });
}


module.exports = connect;