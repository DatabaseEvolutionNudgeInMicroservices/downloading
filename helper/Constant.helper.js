// Libraries

const dotenv = require('dotenv');

/**
 * @overview Represents the helper constants.
 */

// Configuration

dotenv.config();

// Constants

const FILE_SYSTEM_SEPARATOR = process.env.FILE_SYSTEM_SEPARATOR;
const TEMP_FOLDER_NAME = 'TEMP';

module.exports = {
    FILE_SYSTEM_SEPARATOR,
    TEMP_FOLDER_NAME,
}