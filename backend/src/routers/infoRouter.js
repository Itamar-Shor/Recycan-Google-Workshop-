const express = require('express')
const router = new express.Router();
const fs = require("fs");

const privacy = fs.readFileSync("./src/content/privacy.html", { encoding: 'utf8', flag: 'r' });
const terms = fs.readFileSync("./src/content/terms.html", { encoding: 'utf8', flag: 'r' });

router.get("/privacy", function (req, res) {
    res.status(200).send(privacy);
});

router.get("/terms", function (req, res) {
    res.status(200).send(terms);
});

router.get("/easteregg", function (req, res) {
    res.status(200).send("<html><body>Congratulations, you found the easter egg!</body></html>");
});

module.exports = router;