const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const logger = require('./config/logger');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/envioRoutes');

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan('combined', { stream: logger.stream })); 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));








app.use((err, req, res, next) => {
    logger.error(err.message, { stack: err.stack, url: req.url });
    res.status(err.status || 500).json({
        error: process.env.NODE_ENV === 'development' ? err.message : 'Error interno del servidor'
    });
});

module.exports = app;