import * as fs from 'fs';
import * as chalk from 'chalk';
import { IntCodeinnator, Storage } from './IntCodeinnator';

(async () => {

const day : number = 0;

console.log("+------------------------------+");
console.log("|  " + chalk.blueBright("Advent of Code 2019:") + chalk.green(" Day", day) + "  |");
console.log("+------------------------------+\n");

// Get file and split it into lines
let input : string = fs.readFileSync("./input.txt", {
    encoding: "utf8",
});//.split("").map((value, index, array) => { return parseInt(value)});

const storage = Storage.importFile(input);
const storageTest = Storage.importFile("109,1,204,-1,1001,100,1,100,1008,100,16,101,1006,101,0,99");
const innator = new IntCodeinnator(storage);

// Timing start
let startTime : number = new Date().getTime();

let output = await innator.run(null, null, [1]);
console.log(output);

// Timing end
let part1End : number = new Date().getTime();

// Part 1 done
console.log(chalk.yellow("Part 1 done in: ") + chalk.red(part1End - startTime + " ms")
    + chalk.green(" Executing Part 2..."));

// Timing of Part 2 start
let startPart2Time : number = new Date().getTime();

innator.reset();
output = await innator.run(null, null, [2]);
console.log(output);

// Timing end
let part2End : number = new Date().getTime();

// Part 2 done
console.log(chalk.yellow("Part 2 done in: ") + chalk.red(part2End - startPart2Time + " ms")
    + chalk.green(" Done executing...\n"));
console.log(chalk.blueBright("Total execution time of: ") + chalk.red(part2End - startTime + " ms"));
process.exit(0);
})();