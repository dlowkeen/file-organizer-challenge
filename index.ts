import * as fs from 'fs';
const readline = require('readline');

const readInterface = readline.createInterface({
    input: fs.createReadStream('./data.txt', 'utf8'),
    // output: process.stdout,
    console: false
});

const globalStore: any = {};

readInterface.on('line', function(line: string) {
    const args = parseArgs(line);
    console.log(line);
    if (args.length > 0) {
        performAction(args, globalStore);
    }
});

function parseArgs(line: string) { 
    return line.split(' ');
}

function performAction(args: string[], globalStore: any) {
    switch (args[0]) {
        case 'CREATE':
            create(args[1], globalStore);
            break;
        case 'MOVE':
            move(args[1], args[2], globalStore)
            break;
        case 'DELETE':
            remove(args[1], globalStore);
            break;
        case 'LIST':
            const alphabetized = alphabetizeObjProps(globalStore);
            recursivePrint(alphabetized, 0);
            break;
        default:
            console.log('no command provided');
    }
}

function create(path: string, obj: any) {
    const pathArr = path.split('/');
    recursiveAdd(pathArr, obj);
}

function recursiveAdd(path: string[], obj: any) {
    const elem = path[0];
    if (obj.hasOwnProperty(elem)) {
        recursiveAdd(path.slice(1, path.length), obj[elem]);
    } else {
        obj[elem] = {};
        return;
    }
}

function remove(path: string, obj: any) {
    const pathArr = path.split('/');
    const result = recursiveRemove(pathArr, obj);
    if (result) {
        console.log(`Cannot delete ${pathArr.join('/')} - ${result} does not exist`)
    }
}

function recursiveRemove(path: string[], obj: any): string | null {
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

function move(source: string, destination: string, globalStore: any) {
    const sourcePath = source.split('/');
    const destPath = destination.split('/');
    const sourceRef = findSource(sourcePath, globalStore);
    moveToDest(sourceRef, destPath, globalStore);
}

function findSource(path: string[], obj: any): any {
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

function moveToDest(sourceNode: any, path: string[], obj: any): any {
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

function recursivePrint(obj: any, spaces: number) {
    let indents = '';
    for (let i  = 0; i < spaces; i++) {
        indents = indents + ' ';
    }
    for (const key of Object.keys(obj)) {
        console.log(indents + key);
        recursivePrint(obj[key], spaces + 2);
    }
}

function alphabetizeObjProps(obj: any) {
    const ordered = {};
    Object.keys(obj).sort().forEach(function(key) {
        ordered[key] = alphabetizeObjProps(obj[key]);
    });

    return ordered;
}