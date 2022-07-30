const express = require('express')
const router = new express.Router();
const BinModel = require("../models/bin");
const ENV = require('../globals.json');
const haversine = require("haversine");
const { auth, optional_auth } = require("../middleware/auth");

// ------------------------------------ GET ------------------------------------

// get bins location by type
router.get("/getBin/type/", optional_auth, async (req, res) => {

    BinModel.find({ newBinReports: { $exists: false } }).byType(req.query.type)
        .then(match => {
            res.status(200).send(match);
        })
        .catch(err => {
            console.log(err);
            res.status(500).send(err);
        })
});

// get bins location by type
router.get("/getBin/distance/", optional_auth, async (req, res) => {
    const lat = parseFloat(req.query.lat);
    const lon = parseFloat(req.query.lon);
    const radius = parseFloat(req.query.radius);

    const distanceToBin = (bin) => {
        return haversine([lon, lat],
            bin.location.coordinates,
            {
                format: "[lon,lat]",
                unit: "meter"
            });
    }
    const userId = req.user ? req.user.googleUserId : null;
    BinModel.find({
        $and: [
            { $or: [{ newBinReports: { $in: userId } }, { newBinReports: { $exists: false } }] },
            { $or: [{ missingReports: { $nin: userId } }, { missingReports: { $exists: false } }] }
        ]
    }).byClosest(lat, lon, radius)
        .then(match => {
            if (!match) res.status(404).send();
            else {
                const mapped = match.map((bin, i) => {
                    return { i, value: distanceToBin(bin) }
                });
                mapped.sort((a, b) => {
                    if (a.value > b.value) {
                        return 1;
                    }
                    if (a.value < b.value) {
                        return -1;
                    }
                    return 0;
                });
                const result = mapped.map(v => {
                    const target = match[v.i];
                    return {
                        _id: target._id,
                        type: target.type,
                        street: target.street,
                        location: target.location,
                        distance: v.value,
                        missingReports: target.missingReports ? target.missingReports : []
                    }
                });
                res.status(200).send(result)
            };
        })
        .catch(err => {
            console.log(err);
            res.status(500).send(err);
        })
});

// get all bins
router.get("/getBin/all", async (req, res) => {
    BinModel.find({ newBinReports: { $exists: false } })
        .then(match => {
            if (!match) res.status(404).send();
            else res.send(match);
        })
        .catch(err => {
            console.log(err);
            res.status(500).send(err);
        })
})


// get all reported as new bins
router.get("/getNewReportedBins", async (req, res) => {
    BinModel.find({ newBinReports: { $exists: true } })
        .then(match => {
            if (!match) res.status(404).send();
            else res.send(match);
        })
        .catch(err => {
            console.log(err);
            res.status(500).send(err);
        })
})

// ------------------------------------ POST ------------------------------------

/* Usage example

{
    "type": "paper",
    "location": { 
        "type": "Point",
        "coordinates": [34.81494817205331, 32.067118167120455]
    }
}

*/

router.post("/reportMissingBin/", auth, async (req, res) => {
    console.log(req.body);
    BinModel.findById(req.body.id)
        .then(bin => {
            if (bin.missingReports) {
                for (let i = 0; i < bin.missingReports.length; i++) {
                    if (bin.missingReports[i] == req.user._id) {
                        return res.status(201).send({status: 'USER already reported this bin!'});
                    }
                }
                if (bin.missingReports.length >= ENV.REPORT_TH - 1) {
                    bin.remove();
                    return res.status(201).send({status: "REMOVED"});
                }
                else {
                    bin.missingReports.push(req.user._id);
                }
            }
            else {
                bin.missingReports = [req.user._id];
            }
            bin.save()
                .then(() => { res.status(201).send({status: "UPDATED"}); })
                .catch(e => { res.status(400).send(e.message); });
        })
        .catch(e => {
            console.log(e.message);
            res.status(400).send(e.message);
        })
});




//  ------------------------------------ DEL ------------------------------------
router.delete("/removeBin/:id", async (req, res) => {

    BinModel.findByIdAndRemove(req.params.id)
        .then(data => {
            res.status(201).send({status: 'REMOVED'});
        })
        .catch(err => {
            res.status(400).send(err);
        })
});


module.exports = router;