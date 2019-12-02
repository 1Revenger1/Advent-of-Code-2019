"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const chalk = require("chalk");
const day = 0;
console.log("+------------------------------+");
console.log("|  " + chalk.blueBright("Advent of Code 2019:") + chalk.green(" Day", day) + "  |");
console.log("+------------------------------+\n");
// Get file and split it into lines
let file = fs.readFileSync("./input.txt", {
    encoding: "utf8",
}).split("\n");
// Timing start
let startTime = new Date().getTime();
file.forEach((line) => {
    console.log(line);
});
// Timing end
let part1End = new Date().getTime();
// Part 1 done
console.log(chalk.yellow("Part 1 done in: ") + chalk.red(part1End - startTime + " ms")
    + chalk.green(" Executing Part 2..."));
// Timing of Part 2 start
let startPart2Time = new Date().getTime();
file.forEach((line) => {
    console.log(chalk.blue(line));
});
// Timing end
let part2End = new Date().getTime();
// Part 2 done
console.log(chalk.yellow("Part 2 done in: ") + chalk.red(part2End - startPart2Time + " ms")
    + chalk.green(" Done executing...\n"));
console.log(chalk.blueBright("Total execution time of: ") + chalk.red(part2End - startTime + " ms"));
//# sourceMappingURL=Index.js.map