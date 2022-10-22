/** 
 * Provides logger for backend services.
 * @module
 */

const winston = require('winston');
let loglevel = process.env.LOG_LEVEL ? process.env.LOG_LEVEL : "debug";

module.exports.getLogger = () => {
    return winston.createLogger({
        level: loglevel,
        transports: [
            new winston.transports.Console()
        ]
    });
}