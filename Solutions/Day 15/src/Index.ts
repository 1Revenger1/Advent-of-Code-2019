import * as fs from 'fs';
import * as chalk from 'chalk';
import { IntCodeinnator, Storage } from './IntCodeinnator';

(async () => {

const day : number = 15;

console.log("+-------------------------------+");
console.log("|  " + chalk.blueBright("Advent of Code 2019:") + chalk.green(" Day", day) + "  |");
console.log("+-------------------------------+\n");

// Get file and split it into lines
let file : string = fs.readFileSync("./input.txt", {
    encoding: "utf8",
});

enum BlockType {
    Wall,
    Air,
    Oxygen
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

        if(lowestScore.x == goal.x && lowestScore.y == goal.y)
            return reconstruct_path(cameFrom, lowestScore);

        discoveredSpots.splice(lowestIndex, 1);
        let neighbors = findNeighbors(lowestScore);
        neighbors.forEach(neighbor => {
            if(maze.get(`${neighbor.x},${neighbor.y}`) == BlockType.Wall) return;
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
function BFS(start : Pos, goal ?: Pos) {
    let discovered : string[] = [start.toString()];
    let queue : Pos[] = [start];
    let cameFrom : Map<string, Pos> = new Map<string, Pos>();
    let lastPos = start;

    while(queue.length > 0) {
        let spot = queue.shift();
        lastPos = spot;

        // If goal, return the path
        if(goal && spot.x == goal.x && spot.y == goal.y)
            return reconstruct_path(cameFrom, spot);

        let neighbors = findNeighbors(spot);
        neighbors.forEach(neighbor => {
            if(maze.get(neighbor.toString()) == BlockType.Wall) return;
            if(!cameFrom.has(neighbor.toString()) && !discovered.includes(neighbor.toString())) {
                discovered.push(neighbor.toString());
                cameFrom.set(neighbor.toString(), spot);
                queue.push(neighbor);
            }
        });
    }

    return reconstruct_path(cameFrom, lastPos);
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

let storage = Storage.importFile(file);
let innator = new IntCodeinnator(storage);

let direction = Directions.NORTH;

let pos : Pos = new Pos(0, 0);
let minPos : Pos = new Pos(0, 0);
let maxPos : Pos = new Pos(0, 0);
let maze : Map<string,BlockType> = new Map<string,BlockType>();
maze.set(pos.toString(), BlockType.Air);

function goLeft(input) {
    switch(input) {
        case Directions.NORTH : return Directions.WEST;
        case Directions.EAST : return Directions.NORTH;
        case Directions.SOUTH : return Directions.EAST;
        case Directions.WEST : return Directions.SOUTH;
    }
}

function goRight(input) {
    switch(input) {
        case Directions.NORTH : return Directions.EAST;
        case Directions.EAST : return Directions.SOUTH;
        case Directions.SOUTH : return Directions.WEST;
        case Directions.WEST : return Directions.NORTH;
    }
}

function drawMaze(maze : Map<string,BlockType>, min : Pos, max : Pos) {
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
        if(type == BlockType.Oxygen) field[pos[1] - offsetY][pos[0] - offsetX] = chalk.bgBlue(" ");
    });

    field[-offsetY][-offsetX] = chalk.bgRed(" ");
    field[pos.y - offsetY][pos.x - offsetX] = chalk.bgGreen(" ");
    
    console.log(field.map(value => value.join("")).join("\n"))
}

let oxyPos : Pos = null;

innator.setup(null, null, null, async () => {
    await new Promise(res => setTimeout(() => res(), 10));
    switch (direction) {
        case Directions.NORTH: return 1;
        case Directions.EAST: return 4;
        case Directions.SOUTH: return 2;
        case Directions.WEST: return 3;
    }
}, output => {
    let blockInFront = pos.add(direction);
    if(pos.x < minPos.x) minPos.x = blockInFront.x;
    if(pos.x > maxPos.x) maxPos.x = blockInFront.x;
    if(pos.y < minPos.y) minPos.y = blockInFront.y;
    if(pos.y > maxPos.y) maxPos.y = blockInFront.y;

    // Right handed search - try to discover what's to the right
    if(output == 0) {
        direction = goLeft(direction);

        maze.set(blockInFront.toString(), BlockType.Wall);
    } else {
        if(output == 2) {
            oxyPos = new Pos(blockInFront.x, blockInFront.y);
            maze.set(blockInFront.toString(), BlockType.Oxygen);
        } else {
            maze.set(blockInFront.toString(), BlockType.Air);
        }
        drawMaze(maze, minPos, maxPos);
        direction = goRight(direction);
        pos = new Pos(blockInFront.x, blockInFront.y);

        if(pos.x == 0 && pos.y == 0) innator.haltInnator();
    }
});

await innator.run();

console.log(oxyPos.toString());
drawMaze(maze, minPos, maxPos);
console.log(aStar(new Pos(0, 0), oxyPos).length - 1);

// Timing end
let part1End : number = new Date().getTime();

// Part 1 done
console.log(chalk.yellow("Part 1 done in: ") + chalk.red(part1End - startTime + " ms")
    + chalk.green(" Executing Part 2..."));

// Timing of Part 2 start
let startPart2Time : number = new Date().getTime();

// Find the longest path - don't specify a goal
console.log(BFS(oxyPos).length - 1);

// Timing end
let part2End : number = new Date().getTime();

// Part 2 done
console.log(chalk.yellow("Part 2 done in: ") + chalk.red(part2End - startPart2Time + " ms")
    + chalk.green(" Done executing...\n"));
console.log(chalk.blueBright("Total execution time of: ") + chalk.red(part2End - startTime + " ms"));
process.exit(0);
})();