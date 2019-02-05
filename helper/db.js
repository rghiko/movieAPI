const mongoose = require('mongoose');

module.exports = () => {
    mongoose.connect('mongodb://movieapi:159753mlab@ds223015.mlab.com:23015/movieapi', {useNewUrlParser: true});
    mongoose.connection.on('open', () => {
        console.log('MongoDB: Bağlandı.');
    });
    mongoose.connection.on('error', (err) => {
        console.log('MongoDB: Hata', err);
    });

    mongoose.Promise = global.Promise;
    
};