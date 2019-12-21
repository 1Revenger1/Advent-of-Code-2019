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
}).split("\n").map(value => value.split(""));


// Timing start
let startTime : number = new Date().getTime();

let keys = new Map<string, Pos>();
let doors = new Map<string, Pos>();
let buffer = ""
file.forEach((value, indexY) => {
    value.forEach((spot, indexX) => { 
        buffer += spot
        if(spot != "#" && spot != ".") {
            if(spot == "@") keys.set("@", {x: indexX, y: indexY});
            else if(spot == spot.toUpperCase()) doors.set(spot, {x: indexX, y: indexY});
            else if(spot == spot.toLowerCase()) keys.set(spot, {x: indexX, y: indexY});
        }
    });
    buffer += "\n";
});

console.log(buffer);
console.log(keys);

interface Pos {
    x: number,
    y: number,
}


let field : string[][] = file.map(value => [...value]);

function recursiveFinder(pos : Pos, pastPos : string[], target : Pos, steps : number) : number {
    console.log(pos);
    pastPos.push(`${pos.x},${pos.y}`);
    steps++;
    if(pos.x == target.x && pos.y == target.y) {
        return steps;
    } else {
        // North
        let northPos = {...pos};
        northPos.y--;
        let southPos = {...pos};
        southPos.y++;
        let eastPos = {...pos};
        eastPos.x++;
        let westPos = {...pos};
        westPos.x--;
        let results = new Array(4).fill(0);
        if(!pastPos.includes(`${northPos.x},${northPos.y}`) && field[northPos.y][northPos.x] != "#"
            && canGo(northPos)) results[0] = recursiveFinder(northPos, pastPos, target, steps);
        if(!pastPos.includes(`${southPos.x},${southPos.y}`) && field[southPos.y][southPos.x] != "#"
            && canGo(southPos)) results[1] = recursiveFinder(southPos, pastPos, target, steps);
        if(!pastPos.includes(`${eastPos.x},${eastPos.y}`) && field[eastPos.y][eastPos.x] != "#"
            && canGo(eastPos)) results[2] = recursiveFinder(eastPos, pastPos, target, steps);
        if(!pastPos.includes(`${westPos.x},${westPos.y}`) && field[westPos.y][westPos.x] != "#"
            && canGo(westPos)) results[3] = recursiveFinder(westPos, pastPos, target, steps);
        
        let smallest = 1000000000000000;

        results.forEach(value => {
            if(value == 0) return;
            if(value < smallest) smallest = value;
        });

        return smallest == 1000000000000000 ? 0 : smallest;
    }
}

function canGo(pos : Pos) : boolean {
    if(field[pos.y][pos.x] == ".") return true;
    else {
        if(!keys.has(field[pos.y][pos.x])) return true;
    }
    return false;
}

function foundKey(key : string) {
    field.forEach(row => {
        row.forEach(spot => {
            if (spot == key.toLowerCase()) { 
                spot = ".";
                keys.delete(key);
            }
            if (spot == key.toUpperCase()) { 
                spot = ".";
                doors.delete(key);
            }
        })
    })
}

console.log(recursiveFinder(keys.get("@"), [], keys.get("h"), 0));

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