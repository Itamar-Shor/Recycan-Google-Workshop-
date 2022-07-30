const opencage = require('opencage-api-client');
const express = require('express')
const router = new express.Router();

const coord2place = async (lon, lat) => {
  opencage
    .geocode({ q: '37.4396, -122.1864', language: 'iw', key: process.env.OPENCAGE_API_KEY })
    .then((data) => {
      // console.log(JSON.stringify(data));
      if (data.results.length > 0) {
        const place = data.results[0];
        console.log(place.formatted);
        console.log(place.components.road);
        console.log(place.annotations.timezone.name);
        return place
      } else {
        console.log('status', data.status.message);
        console.log('total_results', data.total_results);
      }
    })
    .catch((error) => {
      console.log('error', error.message);
      if (error.status.code === 402) {
        console.log('hit free trial daily limit');
        console.log('become a customer: https://opencagedata.com/pricing');
      }
    });
}

const place2coord = async (place) => {
  const data = await opencage.geocode({ q: place, countrycode: "il", key: process.env.OPENCAGE_API_KEY });
  return data.results;
}

router.get("/coordinates", async (req, res) => {
  place2coord(req.query.address)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      console.log(err);
      res.status(500).send(err);
    })
});

router.get("/address", async (req, res) => {
  coord2place(req.query.lat, req.query.lon)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      console.log(err);
      res.status(500).send(err);
    })
});


module.exports = router;