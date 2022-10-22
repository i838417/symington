/** 
 * Provides app with backend services 
 */

'use strict';

const express = require('express');
const bodyParser = require("body-parser");
const router = require('./router');
const xsenv = require('@sap/xsenv');
var JWTStrategy = require('@sap/xssec').JWTStrategy;
const passport = require('passport');
const appLogger = require('./logger');

/**
 * Starts server
 */
module.exports = {

    startServer: () => {

        //create applicaiton
        const app = express();
        app.use("/srv", express.static(__dirname + "/srv"))

        // Get log
        const logger = appLogger.getLogger();
        app.set('logger', logger);

        //xsuaa security
        xsenv.loadEnv();
        const services = xsenv.getServices({ uaa: { tag: 'xsuaa' } });
        passport.use(new JWTStrategy(xsenv.getServices({xsuaa:{tag:'xsuaa'}}).xsuaa)); 

        app.use(passport.initialize());
        app.use(passport.authenticate('JWT', { session: false }));

        app.use(express.json());
        app.use(express.urlencoded({ extended: false }));

        // Init routes
        router.initRoutes(app);

        // Start server  
        const port = process.env.PORT || 5001;
        app.listen(port, () => { 
             logger.info(`Starting server at ${port}`);
        });
    }
}