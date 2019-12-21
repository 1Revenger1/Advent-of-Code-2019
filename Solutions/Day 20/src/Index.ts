import * as fs from 'fs';
import * as chalk from 'chalk';

(async () => {

const day : number = 0;

console.log("+------------------------------+");
console.log("|  " + chalk.blueBright("Advent of Code 2019:") + chalk.green(" Day", day) + "  |");
console.log("+------------------------------+\n");

// Get file and split it into lines
let file : string[][] = fs.readFileSync("./input.txt", {
    encoding: "utf8",
}).split("\n").map(row => row.split(""));

let field : string[][] = [];
console.log(file.length);
console.log(file[0].length);

let portals : Map<string, Pos> = new Map<string, Pos>;
for(let i = 2; i < file.length - 2 ; i++) {
    for(let j = 2; j < file[0].length - 2 ; j++) {
        if(field[i - 2] == null) field[i - 2] = new Array(file[0].length - 4);
        field[i - 2][j - 2] = file[i][j];

        if(i == 2 && file[i - 2][j - 2] == ".") {
            let portalName = file[i - 4][j - 2] + file[i - 3][j - 2];
            
        }
        if(i == 28 && file[i - 2][j - 2] == ".") {
            // Look below
        }
    }
}

// Timing start
let startTime : number = new Date().getTime();

function distance(a : Pos, b: Pos) : number {
    return Math.sqrt(Math.pow(a.x + b.x, 2) + Math.pow(a.y + b.y, 2))
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

function findNeighbors(start: Pos, field : any[][]) : Pos[] {
    let neighbors = [];
    for(let dir in Directions) {
        let pos = start.add(Directions[dir]);
        if(pos.x < 0 || pos.x > field[0].length) continue;
        if(pos.y < 0 || pos.y > field.length) continue;
        neighbors.push(pos);
    }
    return [];
}

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
            return gScore.get(lowestScore.toString());

        discoveredSpots = discoveredSpots.splice(lowestIndex, 1);
        let neighbors = findNeighbors(lowestScore, field);
        neighbors.forEach(neighbor => {
            if(field[neighbor.y][neighbor.x] = "#") return;
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

    return Infinity;
}

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