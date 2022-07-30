const mongoose = require("mongoose");


const pointSchema = new mongoose.Schema({
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  });


const BinSchema = new mongoose.Schema(
    {
        type:{
            type: String,
            required: true,
            trim: true
        },
        street:{
            type: String,
        },
        location:{
            type: pointSchema,
            index: '2dsphere',
            required: true
        },
        missingReports:[{
            type: String,
            trim: true
        }],
        newBinReports:[{
            type: String,
            trim: true
        }]
    },
);


BinSchema.query.byClosest = function(lat, lon, radius){
    return this.where({
        location:
            { $near:
                {
                    $geometry: { type: "Point",  coordinates: [lon, lat] },
                    $minDistance: 0,
                    $maxDistance: radius,
                }
            }
    });
};

BinSchema.query.byType = function(type) {
    return this.where({ BinType: new RegExp(type, 'i') });
};

const Bin = mongoose.model("Bin", BinSchema);

module.exports = Bin;