const opencage = require('opencage-api-client');
const fs = require('fs');
const BinModel = require('./models/bin');
const mongoose = require('mongoose');

const OBJ = {
    "OPENCAGE_API_KEY": "ce56245c23994c56980fb75a5e44d90d",
    "MONGODB_URL": "mongodb+srv://itamarS:4Kp3nhrHqVX28H9@recycan.cagyj.mongodb.net/Recycan?retryWrites=true&w=majority"
};

const get_coords = async (place) => {
    try {
        const data = await opencage.geocode({
            q: place,
            language: 'en',
            countrycode: "il",
            key: OBJ.OPENCAGE_API_KEY
        });
        if (data.results.length > 0) {
            console.log(`got ${place}`);
            const res = data.results[0];
            return {
                street: res.formatted,
                coordinates: [res.geometry.lng, res.geometry.lat],
            }
        }
    } catch (e) {
        if (e.status.code === 402) {
            console.log("Hit daily trial limit");
        } else {
            console.log(e);
        }
    }
}

const formatBins = async (chunkFile) => {
    const jsonString = fs.readFileSync(chunkFile);
    const data = JSON.parse(jsonString);
    const promises = data.map(async (bin, idx) => {
        const place = await get_coords(bin.street);
        if (place) {
            return {
                type: bin.type,
                street: place.street,
                location: {
                    type: "Point",
                    coordinates: place.coordinates
                }
            }
        }
    });
    const results = await Promise.allSettled(promises);
    return results.filter((res) => res.status == 'fulfilled' && res.value).map(res => res.value);
}

const saveBins = (bins) => {
    BinModel.insertMany(bins).then(() => console.log("bins saved")).catch(e => console.log(e));
}


mongoose.connect(OBJ.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Database connected!");
    const bins = [
        {
            "type": "paper",
            "street": "Shimon Ben Zvi",
            "location": {
                "type": "Point",
                "coordinates": [34.812200365821745, 32.067393364709176]
            }
        },
        {
            "type": "paper",
            "street": "Hakukiya",
            "location": {
                "type": "Point",
                "coordinates": [34.817432, 31.959342]
            }
        },
    ]
    saveBins(bins)
    /*formatBins("data7800-8400/chunk5.json")
        .then(bins => saveBins(bins))
        .catch(e => console.log(e));*/
})
    .catch(err => console.log(err));


