import * as fs from 'fs';
import * as helpers from './common/file-helpers';
import { callWithErrorWrapping } from './common/utils';
import logger from './services/logger';
const readline = require('readline');

const readInterface = readline.createInterface({
    input: fs.createReadStream('./data.txt', 'utf8')
});

const globalStore: any = {};

readInterface.on('line', function(line: string) {
    const args = helpers.parseArgs(line);
    logger.trace(line);
    if (args.length > 0) {
        const { err } = callWithErrorWrapping(helpers.performAction, [args, globalStore], 'Error Performing Action');
        if (err) {
            // Add any specific error handling we want to do here!
            throw err;
        }
    }
});
