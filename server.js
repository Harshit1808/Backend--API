const app = require('./app');
const PORT = process.env.PORT || 3000;
const express = require('express');
const router = express.Router();
app.use(router);
const server = app.listen(PORT, function () {
    console.info('Express server listening on port ' + PORT);
});