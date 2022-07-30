require('./DB/mongoose');
const express = require('express')
const binsRouter = require('./routers/binsRouter');
const geoRouter = require('./routers/geoRouter')
const usersRouter = require('./routers/usersRouter')
const infoRouter = require('./routers/infoRouter');
const app = express();

app.use(express.json());
app.disable('etag');

app.use('/bins', binsRouter);
app.use('/location', geoRouter);
app.use('/users', usersRouter);
app.use('/', infoRouter);

const port = process.env.PORT || 3000;

app.listen(port, '0.0.0.0', () => {
    console.log("Server is up on port", port);
});