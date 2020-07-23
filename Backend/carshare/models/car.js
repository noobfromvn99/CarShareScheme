const mongoose = require('mongoose');

const car = mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    brand:{
        type: String,
        required: true
    },
    model:{
        type: String,
        required: true
    },
    purchase_date:{
        type: Date,
        default: new Date()
    },
    location_id:{
        type: mongoose.Types.ObjectId
    },
    available:{
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('Car', car);