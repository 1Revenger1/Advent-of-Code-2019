import * as fs from 'fs';
import * as chalk from 'chalk';

(async () => {

const day : number = 18;

console.log("+-------------------------------+");
console.log("|  " + chalk.blueBright("Advent of Code 2019:") + chalk.green(" Day", day) + "  |");
console.log("+-------------------------------+\n");

// Get file and split it into lines
let file : string[][] = fs.readFileSync("./input.txt", {
    encoding: "utf8",
}).split("\r\n").map(value => value.split(""));

enum BlockType {
    Wall,
    Air,
    Key,
    Door,
}

class Pos {
    x: number;
    y: number;
    constructor(x : number, y: number) {
        this.x = x;
        this.y = y;
    }
    toString = () => `${this.x},${this.y}`;
    add = (b : Pos) => new Pos(this.x + b.x, this.y + b.y);
}

let Directions = {
    NORTH: new Pos(0, -1),
    SOUTH: new Pos(0, 1),
    EAST : new Pos(1, 0),
    WEST : new Pos(-1, 0)
}

function distance(a : Pos, b: Pos) : number {
    return Math.sqrt(Math.pow(a.x + b.x, 2) + Math.pow(a.y + b.y, 2))
}

function findNeighbors(start: Pos) : Pos[] {
    let neighbors = [];
    for(let dir in Directions) {
        let pos = start.add(Directions[dir]);
        neighbors.push(pos);
    }
    return neighbors;
}

/**
 * A* algorithm
 * Finds shortest path as quickly as possible to goal
 * @param start Starting position
 * @param goal  Goal position
 */
function aStar(start : Pos, goal : Pos) {
    let discoveredSpots : Pos[] = [start];
    let cameFrom : Map<string, Pos> = new Map<string, Pos>();
    let gScore : Map<string,number> = new Map<string, number>();
    gScore.set(start.toString(), 0);

    let fScore : Map<string,number> = new Map<string, number>();
    fScore.set(start.toString(), distance(start, goal));

    while(discoveredSpots.length != 0) {
        let lowestScore : Pos = discoveredSpots[0];
        let lowestIndex = 0;
        discoveredSpots.forEach((pos, index) => {
            if(fScore.get(pos.toString()) < fScore.get(lowestScore.toString())) {
                lowestScore = pos;
                lowestIndex = index;
            }
        });

        // drawMaze(maze, new Pos(0,0), new Pos(80,80));
        if(lowestScore.x == goal.x && lowestScore.y == goal.y)
            return reconstruct_path(cameFrom, lowestScore);

        discoveredSpots.splice(lowestIndex, 1);
        let neighbors = findNeighbors(lowestScore);
        neighbors.forEach(neighbor => {
            if(maze.get(`${neighbor.x},${neighbor.y}`) == BlockType.Wall || maze.get(`${neighbor.x},${neighbor.y}`) == BlockType.Door) return;
            let score = gScore.get(lowestScore.toString()) + 1;
            if(score < (gScore.has(neighbor.toString()) ? gScore.get(neighbor.toString()) : Infinity)) {
                cameFrom.set(neighbor.toString(), lowestScore);
                gScore.set(neighbor.toString(), score);
                fScore.set(neighbor.toString(), distance(neighbor, goal));
                let inDiscoverd = false;
                discoveredSpots.forEach(value => { if(!inDiscoverd && value.x == neighbor.x && value.y == neighbor.y) inDiscoverd = true; });
                if(!inDiscoverd) discoveredSpots.push(neighbor);
            }
        });
    }

    return [];
}

/**
 * Breadth-First-Search
 * If no goal is defined, it'll find the place with the longest path
 * @param start Starting position
 * @param goal  Goal position you want to find
 */
function BFS(start : Pos, keysFound: string[], goal ?: Pos) {
    let discovered : string[] = [start.toString()];
    let queue : Pos[] = [start];
    let cameFrom : Map<string, Pos> = new Map<string, Pos>();
    let lastPos = start;

    let keysFoundTemp = [];

    while(queue.length > 0) {
        let spot = queue.shift();
        lastPos = spot;

        // If goal, return the path
        if(goal && spot.x == goal.x && spot.y == goal.y)
            return reconstruct_path(cameFrom, spot);

        let neighbors = findNeighbors(spot);
        neighbors.forEach(neighbor => {
            if(maze.get(neighbor.toString()) == BlockType.Wall) return;
            if(maze.get(neighbor.toString()) == BlockType.Door && !keysFound.includes(doorsPos.get(neighbor.toString()).toLowerCase())) {
                return;
            }
            if(maze.get(neighbor.toString()) == BlockType.Key && !keysFoundTemp.includes(neighbor.toString())) keysFoundTemp.push(neighbor.toString());
            if(!cameFrom.has(neighbor.toString()) && !discovered.includes(neighbor.toString())) {
                discovered.push(neighbor.toString());
                cameFrom.set(neighbor.toString(), spot);
                queue.push(neighbor);
            }
        });
    }
    
    let keysName = [];
    keys.forEach((pos, keyName) => {
        if(keysFoundTemp.includes(pos.toString())) keysName.push(keyName);
    });
    return keysName
}

function reconstruct_path(cameFrom : Map<string, Pos>, current: Pos) : Pos[] {
    let path : Pos[] = [current];
    while(cameFrom.has(current.toString())) {
        current = cameFrom.get(current.toString());
        path.unshift(current);
    }

    return path;
}

// Timing start
let startTime : number = new Date().getTime();

let keys = new Map<string, Pos>();
let doorsPos = new Map<string, string>();
let doors = new Map<string, Pos>();
let buffer = ""
let maze : Map<string,BlockType> = new Map<string,BlockType>();

file.forEach((value, indexY) => {
    value.forEach((spot, indexX) => { 
        buffer += spot
        if(spot != "#" && spot != ".") {
            if(spot == "@") {
                keys.set("@", new Pos(indexX,indexY));
                maze.set(new Pos(indexX, indexY).toString(), BlockType.Air);
            } else if(spot == spot.toUpperCase()) { 
                doors.set(spot, new Pos(indexX, indexY));
                maze.set(new Pos(indexX, indexY).toString(), BlockType.Door);
                doorsPos.set(new Pos(indexX, indexY).toString(), spot);
            } else if(spot == spot.toLowerCase()) { 
                keys.set(spot, new Pos(indexX, indexY));
                maze.set(new Pos(indexX, indexY).toString(), BlockType.Key);
            }
        } else {
            maze.set(new Pos(indexX, indexY).toString(), spot == "#" ? BlockType.Wall : BlockType.Air);
            
        }
    });
});

function drawMaze(maze : Map<string,BlockType>, min : Pos, max : Pos, pos?: Pos) {
    console.clear();
    let field : string[][] = new Array(max.y + Math.abs(min.y) + 3);
    for(let i = 0; i < field.length; i++) {
        field[i] = new Array(max.x + Math.abs(min.x) + 3).fill(" ");
    }
    
    let offsetX = min.x - 1;
    let offsetY = min.y - 1;
    
    maze.forEach((type, key) => {
        let pos = key.split(",").map(value => parseInt(value));
        field[pos[1] - offsetY][pos[0] - offsetX] = type == BlockType.Air ? " " : chalk.bgBlackBright(" ");
        if(type == BlockType.Door) field[pos[1] - offsetY][pos[0] - offsetX] = chalk.bgBlue(" ");
        if(type == BlockType.Key) field[pos[1] - offsetY][pos[0] - offsetX] = chalk.bgGreen(" ");
    });

    if(pos) field[pos.y - offsetY][pos.x - offsetX] = chalk.bgGreen(" ");
    
    console.log(field.map(value => value.join("")).join("\n"))
}

function distanceToCollectKeys(currentKey : string, keysLeft : string[], keysFound:string[], cache : Map<string, number>) : number {
    if(keysLeft.length == 0) {
        return 0;
    }

    let cacheKey = currentKey + keysLeft.sort().join("");
    if(cache.has(cacheKey)) { 
        return cache.get(cacheKey);
    }

    let keysFoundTemp = [...keysFound];
    if(keysFoundTemp.includes(currentKey)) return Infinity;
    keysFoundTemp.push(currentKey);

    console.log(`${keysFoundTemp}`)

    let result = Infinity;
    let reachableKeys = BFS(keys.get(currentKey), keysFoundTemp);
    reachableKeys.forEach(value => {
        let keysTemp = [...keysLeft];
        keysTemp.splice(keysTemp.indexOf(value), 1);
        let d = aStar(keys.get(currentKey), keys.get(value)).length + distanceToCollectKeys(value, keysTemp, keysFoundTemp, cache);

        result = Math.min(result, d);
    });

    if(result != 0) console.log(`${keysFoundTemp}, ${result}`);
    // console.log(cache);
    cache.set(cacheKey, result);

    return result;
}

let keysLeft = [];
keys.forEach((value, key) => {
    if(key == "@") return;
    keysLeft.push(key);
});

// console.log(BFS(keys.get("@")));
console.log(distanceToCollectKeys("@", keysLeft , [], new Map<string, number>()));

// Timing end
let part1End : number = new Date().getTime();

// Part 1 done
console.log(chalk.yellow("Part 1 done in: ") + chalk.red(part1End - startTime + " ms")
    + chalk.green(" Executing Part 2..."));


// Timing of Part 2 start
let startPart2Time : number = new Date().getTime();


// Timing end
let part2End : number = new Date().getTime();

// Part 2 done
console.log(chalk.yellow("Part 2 done in: ") + chalk.red(part2End - startPart2Time + " ms")
    + chalk.green(" Done executing...\n"));
console.log(chalk.blueBright("Total execution time of: ") + chalk.red(part2End - startTime + " ms"));
process.exit(0);
})();