"use strict";

module.exports={
    
    handleError: (logger, responseObject, error) => {
		logger.error(error);

		if( error.response ) {
			responseObject.status(error.response.status);

			if( error.response.data.error) {
				logger.error("Error: " + JSON.stringify(error.response.data));
				responseObject.send(error.response.data.error.message);
			} 
			else {
				logger.error("Error: " + error.response.statusText);
				responseObject.send(error.response.statusText);
			}
		}
		else {
			responseObject.status("500");
			var errObj = {error: error};
			if( error.message) {
				errObj.message = error.message;
			}
			if( error.data ) {
				errObj.data = error.data;
			}
			if( error.stack ) {
				errObj.stack = error.stack;
			}
			logger.error("Error: " + JSON.stringify(error));
			responseObject.send(errObj);
		}
	},

	createErrorObject: (statusCode, errorMessage) => {
		return {response:{status:statusCode, statusText:errorMessage}}
	},

    getDate: function () {
        let ts = Date.now();
    
        let date_ob = new Date(ts);
        let date = date_ob.getDate().toString();
        if (date.length === 1) {
            date = '0' + date;
        }
        let month = (date_ob.getMonth() + 1).toString();
        if (month.length === 1) {
            month = '0' + month;
        }
        let year = date_ob.getFullYear();
    
        // prints date & time in YYYY-MM-DD format
        return (year.toString() + month.toString() + date.toString());
    },

}