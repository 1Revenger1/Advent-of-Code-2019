import * as fs from 'fs';
import * as chalk from 'chalk';
import { IntCodeinnator, Storage } from './IntCodeinnator';
import { pseudoRandomBytes } from 'crypto';

(async () => {

const day : number = 24;

console.log("+-------------------------------+");
console.log("|  " + chalk.blueBright("Advent of Code 2019:") + chalk.green(" Day", day) + "  |");
console.log("+-------------------------------+\n");

// Get file and split it into lines
let file : string[][] = fs.readFileSync("./input.txt", {
    encoding: "utf8",
}).split("\r\n").map(value => value.split(""));

// Timing start
let startTime : number = new Date().getTime();

interface Pos {
    x: number,
    y: number,
}

interface Tyle {
    pos: Pos,
    isBug: boolean
}

function getAdjacent(pos: Pos) : Pos[] {
    return [
        {x: pos.x, y: pos.y + 1},
        {x: pos.x + 1, y: pos.y},
        {x: pos.x, y: pos.y - 1},
        {x: pos.x - 1, y: pos.y}
    ]
}

function doCycle(field : string[][]) {
    let changes : Tyle[] = [];

    field.forEach((row, indexY) => {
        row.forEach((tyle, indexX) => {
            let adjacent = 0;
            let neighbors = getAdjacent({x: indexX, y: indexY});
            neighbors.forEach(pos => {
                if(pos.x < 0 || pos.x > 4) return;
                if(pos.y < 0 || pos.y > 4) return;

                if(field[pos.y][pos.x] == "#") adjacent++;
            });

            if(tyle == "." && (adjacent == 1 || adjacent == 2)) {
                changes.push({pos: {x: indexX, y: indexY}, isBug: true});
            } else if(adjacent != 1)
                changes.push({pos: {x: indexX, y: indexY}, isBug: false});
        });
    });

    changes.forEach(change => {
        field[change.pos.y][change.pos.x] = change.isBug ? "#" : ".";
    });

    return field;
}

let fields : string[] = [];
do {
    fields.push(file.map(value => value.join("")).join("\n"));
    let buffer = file.map(value => value.join("")).join("\n");
    console.log(buffer + "\n");
    file = doCycle(file);
} while((!fields.includes(file.map(value => value.join("")).join("\n"))));

console.log(file.map(value => value.join("")).join("\n") + "\n");

let power = 1;
let score = 0;
for(let y = 0; y < 5; y++) {
    for(let x = 0; x < 5; x++) {
        if(file[y][x] == "#") score += power;
        power += power;
    }
}

console.log(score);

// Timing end
let part1End : number = new Date().getTime();

// Part 1 done
console.log(chalk.yellow("Part 1 done in: ") + chalk.red(part1End - startTime + " ms")
    + chalk.green(" Executing Part 2..."));

file = fs.readFileSync("./input.txt", {
    encoding: "utf8",
}).split("\r\n").map(value => value.split(""));

// Timing of Part 2 start
let startPart2Time : number = new Date().getTime();

let state : Map<number,string> = new Map<number,string>();
state.set(0, file.map(value => value.join("")).join("\n"));

function getAdjacentB(pos: Pos, depth: number) : number {
    let adjacent = 0;
    let map = state.get(depth).split("\n").map(value => value.split(""));
    let mapAbv = null;
    let mapBlw = null;

    try {
        mapAbv = state.get(depth + 1).split("\n").map(value => value.split(""));
    } catch (err) { /* WE DON"T CARE */ };
    try {
        mapBlw = state.get(depth - 1).split("\n").map(value => value.split(""));
    } catch (err) { /* We REALLY don't care */ };

    // console.log("ABOVE");
    /* -------------- ABOVE -------------- */
    if(pos.y + 1 > 4) {
        if(mapAbv != null) { if(mapAbv[3][2] == "#") adjacent++; }
    } else if(pos.y + 1 == 2 && pos.x == 2) {
        if(mapBlw != null) { mapBlw[0].forEach(type => { if(type == "#") adjacent++; }); }
    } else if(map[pos.y + 1][pos.x] == "#") adjacent++;

    // console.log("RIGHT");
    /* -------------- RIGHT -------------- */
    if(pos.x + 1 > 4) {
        if(mapAbv != null) { if(mapAbv[2][3] == "#") adjacent++; }
    } else if(pos.x + 1 == 2 && pos.y == 2) {
        if(mapBlw != null) { mapBlw.forEach(value => { if(value[0] == "#") adjacent++; }); }
    } else if(map[pos.y][pos.x + 1] == "#") adjacent++;

    // console.log("BELOW");
    /* -------------- BELOW -------------- */
    if(pos.y - 1 < 0) {
        if(mapAbv != null) { if(mapAbv[1][2] == "#") adjacent++; }
    } else if(pos.y - 1 == 2 && pos.x == 2) {
        if(mapBlw != null) { mapBlw[4].forEach(type => { if(type == "#") adjacent++; }); }
    } else if(map[pos.y - 1][pos.x] == "#") adjacent++;

    // console.log("LEFT");
    /* -------------- LEFT --------------- */   
    if(pos.x - 1 < 0) {
        if(mapAbv != null) { if(mapAbv[2][1] == "#") adjacent++; }
    } else if(pos.x - 1 == 2 && pos.y == 2) {
        if(mapBlw != null) { mapBlw.forEach(value => { if(value[4] == "#") adjacent++; }); }
    } else if(map[pos.y][pos.x - 1] == "#") adjacent++;
    
    // console.log(`Pos: (${pos.x}, ${pos.y}), Abv:${mapAbv != null}, Blw: ${mapBlw != null}, Adj: ${adjacent}`)

    return adjacent;
}

let top = 1;
let bot = -1;
function doCycleB() {
    let changesB : Map<number, Tyle[]> = new Map<number, Tyle[]>();

    state.set(top++ , ".....\n.....\n.....\n.....\n.....");
    state.set(bot-- , ".....\n.....\n.....\n.....\n.....");

    state.forEach((map, depth) => {
        changesB.set(depth, []);

        let field = map.split("\n").map(value => value.split("")); 
        field.forEach((row, indexY) => {
            row.forEach((tyle, indexX) => {
                if(indexX == 2 && indexY == 2) return;
                let adjacent = getAdjacentB({x: indexX, y: indexY}, depth);

                if(tyle == "." && (adjacent == 1 || adjacent == 2)) {
                    changesB.get(depth).push({pos: {x: indexX, y: indexY}, isBug: true});
                } else if(adjacent != 1 && tyle == "#")
                    changesB.get(depth).push({pos: {x: indexX, y: indexY}, isBug: false});
            });
        });
    });

    changesB.forEach((changes, depth) => {
        let field = state.get(depth).split("\n").map(value => value.split(""));
        changes.forEach(tile => {
            field[tile.pos.y][tile.pos.x] = tile.isBug ? "#" : ".";
        });
        state.set(depth, field.map(value => value.join("")).join("\n"));
    });
}

for(let i = 0; i < 200; i++) {
    doCycleB()
    // console.log(state.get(0) + "\n");
}

let bugs = 0;
state.forEach(value => {
    value.split("\r").forEach(row => row.split("").forEach(tyle => { if(tyle == "#") bugs++ }));
});

console.log(bugs);

// Timing end
let part2End : number = new Date().getTime();

// Part 2 done
console.log(chalk.yellow("Part 2 done in: ") + chalk.red(part2End - startPart2Time + " ms")
    + chalk.green(" Done executing...\n"));
console.log(chalk.blueBright("Total execution time of: ") + chalk.red(part2End - startTime + " ms"));
process.exit(0);
})();