/** 
 * Provides routing definitions for backend services.
 * @module
 */

'use strict';

const requestUtil = require('./requestUtil');
const dataUtil = require('./dataUtil');
const util = require('./util');
const variableUtil = require('./variableUtil');

/**
 * Defines routes for backend services.
 */
module.exports = {

    initRoutes : (app) => {
        
        const logger = app.get('logger');
        logger.info(`Starting router....`);
        
        // Define routes
        app.route('/srv/company')
            .get((req, res) => requestUtil.processRequest(variableUtil, 'doGetCompany', app, req, res));

        app.route('/srv/upload')
            .post((req, res) => requestUtil.processRequest(dataUtil, 'doUpload', app, req, res));

        app.route('/srv/download_csv')
            .get((req, res) => requestUtil.processRequest(dataUtil, 'doDownloadCSV', app, req, res));

        app.route('/srv/download_xlsx')
            .get((req, res) => requestUtil.processRequest(dataUtil, 'doDownloadXLSX', app, req, res));
    }

};