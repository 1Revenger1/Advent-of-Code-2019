import * as fs from 'fs';
import * as chalk from 'chalk';
import { IntCodeinnator, Storage } from './IntCodeinnator';

const day : number = 4;

console.log("+------------------------------+");
console.log("|  " + chalk.blueBright("Advent of Code 2019:") + chalk.green(" Day", day) + "  |");
console.log("+------------------------------+\n");

let bottom : number = 245182; 
let top: number = 790572;

// Timing start
let startTime : number = new Date().getTime();

let fuzzyCount = 0;
let absCount = 0;

for(let i = bottom; i <= top; i++) {
    let stringNum = "" + i;
    let adjacent = false;
    let fuzzyAdj = false;
    let incr = true;

    for(let j = 1; j < stringNum.length - 2; j++) {
        let bef = parseInt(stringNum.charAt(j - 1));
        let cur = parseInt(stringNum.charAt(j));
        let aft = parseInt(stringNum.charAt(j + 1));
        let aft2 = parseInt(stringNum.charAt(j + 2));
        if(cur < bef || aft < cur || aft2 < aft) {
            incr = false;
            break;
        }
        
        if(j == 1 && bef == cur && cur != aft) {
            adjacent = true;
            fuzzyAdj = true;
        } else if(j == stringNum.length - 3 && cur != aft && aft == aft2) {
            adjacent = true;
            fuzzyAdj = true;
        }

        if(cur == aft) fuzzyAdj = true;
        if(bef != cur && cur == aft && aft != aft2) adjacent = true;
        
    }

    if(adjacent && incr)
        absCount++;
    
    if(fuzzyAdj && incr)
        fuzzyCount++;
}

console.log(`Fuzzy Count: ${fuzzyCount}`);

// Timing end
let part1End : number = new Date().getTime();

// Part 1 done
console.log(chalk.yellow("Part 1 done in: ") + chalk.red(part1End - startTime + " ms")
    + chalk.green(" Executing Part 2..."));

// Timing of Part 2 start
let startPart2Time : number = new Date().getTime();

console.log(`Absolute Count: ${absCount}`);

// Timing end
let part2End : number = new Date().getTime();

// Part 2 done
console.log(chalk.yellow("Part 2 done in: ") + chalk.red(part2End - startPart2Time + " ms")
    + chalk.green(" Done executing...\n"));
console.log(chalk.blueBright("Total execution time of: ") + chalk.red(part2End - startTime + " ms"));