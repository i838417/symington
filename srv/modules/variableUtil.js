/** 
 * Provides utility for user-provided env variables
 */

'use strict'
const commonUtil = require('./util');

module.exports = {

    doGetCompany: (app, req, res) => {
        const logger = app.get('logger');
        try {
            let oProductList = [];

            let company_name = process.env.COMPANY_NAME;
            let response =
            {
                "ResultData": company_name
            }
            res.status(200).send(response);
        } catch (error) {
            console.log(error);
            commonUtil.handleError(logger, res, error);
        }

    },

}