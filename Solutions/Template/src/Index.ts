import * as fs from 'fs';
import * as chalk from 'chalk';
import { IntCodeinnator, Storage } from './IntCodeinnator';

(async () => {

const day : number = 0;

console.log("+------------------------------+");
console.log("|  " + chalk.blueBright("Advent of Code 2019:") + chalk.green(" Day", day) + "  |");
console.log("+------------------------------+\n");

// Get file and split it into lines
let file : string = fs.readFileSync("./input.txt", {
    encoding: "utf8",
});

let storage = Storage.importFile(file);
let innator = new IntCodeinnator(storage);

// Timing start
let startTime : number = new Date().getTime();

let output = await innator.run(12, 2);
console.log(innator.peekMemory(0));

// Timing end
let part1End : number = new Date().getTime();

// Part 1 done
console.log(chalk.yellow("Part 1 done in: ") + chalk.red(part1End - startTime + " ms")
    + chalk.green(" Executing Part 2..."));

innator.reset();

// Timing of Part 2 start
let startPart2Time : number = new Date().getTime();

output = await innator.run(12, 2);
console.log(innator.peekMemory(0));

// Timing end
let part2End : number = new Date().getTime();

// Part 2 done
console.log(chalk.yellow("Part 2 done in: ") + chalk.red(part2End - startPart2Time + " ms")
    + chalk.green(" Done executing...\n"));
console.log(chalk.blueBright("Total execution time of: ") + chalk.red(part2End - startTime + " ms"));
process.exit(0);
})();