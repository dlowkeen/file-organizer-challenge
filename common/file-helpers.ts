import logger from '../services/logger';

/**
 * Returns an array of the line split by spaces.
 * @param line string
 */
export const parseArgs = (line: string) => { 
    return line.split(' ');
}

/**
 * Takes the argument and decides which command to execute.
 * @param args command and file paths
 * @param store object containing file directory
 */
export const performAction = (args: string[], store: any) => {
    switch (args[0]) {
        case 'CREATE':
            create(args[1], store);
            break;
        case 'MOVE':
            move(args[1], args[2], store)
            break;
        case 'DELETE':
            remove(args[1], store);
            break;
        case 'LIST':
            const alphabetized = alphabetizeObjProps(store);
            recursivePrint(alphabetized, 0);
            break;
        default:
            logger.trace('No command provided');
    }
}

/**
 * Initiates recursively adding the correct folder.
 * @param path file path you wish to create
 * @param obj global store/directory
 */
export const create = (path: string, obj: any) => {
    const pathArr = path.split('/');
    recursiveAdd(pathArr, obj);
}

/**
 * Continues searching for the file path until it does not find the property.
 * Then adds file to global store.
 * @param path file path you wish to create
 * @param obj global store/directory
 */
export const recursiveAdd = (path: string[], obj: any) => {
    const elem = path[0];
    if (obj.hasOwnProperty(elem)) {
        recursiveAdd(path.slice(1, path.length), obj[elem]);
    } else {
        obj[elem] = {};
        return;
    }
}

/**
 * Initiates recursively removing the correct folder.
 * @param path file path you wish to remove
 * @param obj global store/directory
 */
export const remove = (path: string, obj: any) => {
    const pathArr = path.split('/');
    const result = recursiveRemove(pathArr, obj);
    if (result) {
        console.log(`Cannot delete ${pathArr.join('/')} - ${result} does not exist`)
    }
}

/**
 * Continues searching for the file path until it does not find the property.
 * Then deletes the file on global store. If not found, returns the element.
 * @param path file path you wish to create
 * @param obj global store/directory
 */
export const recursiveRemove = (path: string[], obj: any): string | null => {
    const elem = path[0];
    if (obj.hasOwnProperty(elem)) {
        if (path.length <= 1) {
            delete obj[elem];
            return null;
        } else {
            return recursiveRemove(path.slice(1, path.length), obj[elem]);
        }
    } else {
        return elem;
    }
}

/**
 * Moves source file to destination on the global store.
 * @param source file path you wish to move
 * @param destination location you wish to move sourec to
 * @param obj global store/directory
 */
export const move = (source: string, destination: string, obj: any) => {
    const sourcePath = source.split('/');
    const destPath = destination.split('/');
    const sourceRef = findSource(sourcePath, obj);
    moveToDest(sourceRef, destPath, obj);
}

/**
 * Finds and deletes the specified file in path and returns a copy of the element.
 * @param path file path you wish to search
 * @param obj global store/directory
 */
export const findSource = (path: string[], obj: any): any => {
    const elem = path[0];
    if (obj.hasOwnProperty(elem)) {
        if (path.length <= 1) {
            const copy = obj[elem];
            delete obj[elem];
            return { [elem]: copy };
        } else {
            return findSource(path.slice(1, path.length), obj[elem]);
        }
    } else {
        return 'path not found';
    }
}

/**
 * Adds copied sourceNode to path.
 * @param sourceNode copied source node
 * @param path file path you wish to move to
 * @param obj global store/directory
 */
export const moveToDest = (sourceNode: any, path: string[], obj: any): any => {
    const elem = path[0];
    if (obj.hasOwnProperty(elem)) {
        if (path.length <= 1) {
            const keys = Object.keys(sourceNode);
            for (let key of keys) {
                obj[elem][key] = sourceNode[key];
            }
            return;
        } else {
            return moveToDest(sourceNode, path.slice(1, path.length), obj[elem]);
        }
    } else {
        return 'path not found';
    }
}

/**
 * Prints the global object with specified spaces as indents
 * @param obj global store/directory
 * @param spaces # of spaces for indents
 */
export const recursivePrint = (obj: any, spaces: number) => {
    let indents = '';
    for (let i  = 0; i < spaces; i++) {
        indents = indents + ' ';
    }
    for (const key of Object.keys(obj)) {
        console.log(indents + key);
        recursivePrint(obj[key], spaces + 2);
    }
}

/**
 * Returns an object with keys alphabetized.
 * @param obj global store/directory
 */
export const alphabetizeObjProps = (obj: any) => {
    const ordered = {};
    Object.keys(obj).sort().forEach(function(key) {
        ordered[key] = alphabetizeObjProps(obj[key]);
    });
    return ordered;
}