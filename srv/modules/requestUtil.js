/** 
 * Provides request utility
 */

'use strict';

const request = require('request');

module.exports = {
    
    /**
     *  process request and sends response.
     */
     processRequest : (module, method, ...args) => {
        
        const res = args[2];
        try {
            // Process request
            module[method].apply(module, args);
            
        } catch (err) {

            res.status(400).json({ message: err.message });
            
        }
    }
}