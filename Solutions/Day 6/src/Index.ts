import * as fs from 'fs';
import * as chalk from 'chalk';
import { IntCodeinnator, Storage } from './IntCodeinnator';

(async () => {

const day : number = 6;

console.log("+------------------------------+");
console.log("|  " + chalk.blueBright("Advent of Code 2019:") + chalk.green(" Day", day) + "  |");
console.log("+------------------------------+\n");

// Get file and split it into lines
let file : string[] = fs.readFileSync("./input.txt", {
    encoding: "utf8",
}).split("\r\n");

// Timing start
let startTime : number = new Date().getTime();

let orbits = new Map<String, String>();

file.forEach(orbit => {
    if(orbit == '') return;
    let orbitSplit = orbit.split(")");
    let root = orbitSplit[0];
    let satellite = orbitSplit[1];
    orbits.set(satellite, root);
});

let count = 0;

orbits.forEach((value, key, map) => {
    count++;
    while(map.has(value)) {
        count++;
        value = map.get(value);
    }
});

console.log(count);

// Timing end
let part1End : number = new Date().getTime();

// Part 1 done
console.log(chalk.yellow("Part 1 done in: ") + chalk.red(part1End - startTime + " ms")
    + chalk.green(" Executing Part 2..."));

// Timing of Part 2 start
let startPart2Time : number = new Date().getTime();

let travelled = [];

function recursiveSolver(to, countSteps) {
    if(travelled.includes(to)) return false;
    travelled.push(to);
    
    if(to == "SAN") {
        console.log(countSteps);
        return true;
    }

    countSteps++;

    if(orbits.has(to) && recursiveSolver(orbits.get(to), countSteps)) {
        return true;
    }
    
    for (let element of orbits) {
        if(element[1] == to && recursiveSolver(element[0], countSteps)) {
            return true;
        }
    }
    return false;
}

recursiveSolver(orbits.get("YOU"), -1);

// Timing end
let part2End : number = new Date().getTime();

// Part 2 done
console.log(chalk.yellow("Part 2 done in: ") + chalk.red(part2End - startPart2Time + " ms")
    + chalk.green(" Done executing...\n"));
console.log(chalk.blueBright("Total execution time of: ") + chalk.red(part2End - startTime + " ms"));
process.exit(0);
})();