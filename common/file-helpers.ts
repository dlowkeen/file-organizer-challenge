import logger from '../services/logger';

export const parseArgs = (line: string) => { 
    return line.split(' ');
}

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


export const create = (path: string, obj: any) => {
    const pathArr = path.split('/');
    recursiveAdd(pathArr, obj);
}

export const recursiveAdd = (path: string[], obj: any) => {
    const elem = path[0];
    if (obj.hasOwnProperty(elem)) {
        recursiveAdd(path.slice(1, path.length), obj[elem]);
    } else {
        obj[elem] = {};
        return;
    }
}

export const remove = (path: string, obj: any) => {
    const pathArr = path.split('/');
    const result = recursiveRemove(pathArr, obj);
    if (result) {
        console.log(`Cannot delete ${pathArr.join('/')} - ${result} does not exist`)
    }
}

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

export const move = (source: string, destination: string, globalStore: any) => {
    const sourcePath = source.split('/');
    const destPath = destination.split('/');
    const sourceRef = findSource(sourcePath, globalStore);
    moveToDest(sourceRef, destPath, globalStore);
}

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

export const alphabetizeObjProps = (obj: any) => {
    const ordered = {};
    Object.keys(obj).sort().forEach(function(key) {
        ordered[key] = alphabetizeObjProps(obj[key]);
    });

    return ordered;
}