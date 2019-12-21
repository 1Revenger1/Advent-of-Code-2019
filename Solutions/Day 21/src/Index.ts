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

// Give string and returns ASCII code
function getInput(input : string) : number[] {
    return (input + "\n").split("").map(value => value.charCodeAt(0));
}

function getOutput(input : number) : string {
    return String.fromCharCode(input);
}

// Timing start
let startTime : number = new Date().getTime();

let inputs : number[] = [].concat(
    // Checks if there is any gap
    getInput("NOT A J"),
    getInput("NOT B T"),
    getInput("OR T J"),
    getInput("NOT C T"),
    getInput("OR T J"),
    // Jump if there is a gap 
    // and if there is a place to land
    getInput("AND D J"),
    getInput("WALK")
);

let buffer = "";
let output = await innator.run(null, null, inputs, null, out => { buffer += getOutput(out)});
console.log(output[output.length - 1]);

// Timing end
let part1End : number = new Date().getTime();

// Part 1 done
console.log(chalk.yellow("Part 1 done in: ") + chalk.red(part1End - startTime + " ms")
    + chalk.green(" Executing Part 2..."));

innator.reset();

// Timing of Part 2 start
let startPart2Time : number = new Date().getTime();

inputs = [].concat(
    // Check if there is any gaps
    getInput("NOT A J"),
    getInput("NOT B T"),
    getInput("OR T J"),
    getInput("NOT C T"),
    getInput("OR T J"),
    // Jump if there is a place to land at and there are gaps
    getInput("AND D J"),
    // Check if A is a gap or if H (8) is a block <-- this works somehow?
    getInput("NOT A T"),
    getInput("OR H T"),
    getInput("AND T J"),
    getInput("RUN")
);

buffer = "";
output = await innator.run(null, null, inputs, null, out => { buffer += getOutput(out)});
if(output.length > 100) console.log(buffer);
else console.log(output[output.length - 1]);

// Timing end
let part2End : number = new Date().getTime();

// Part 2 done
console.log(chalk.yellow("Part 2 done in: ") + chalk.red(part2End - startPart2Time + " ms")
    + chalk.green(" Done executing...\n"));
console.log(chalk.blueBright("Total execution time of: ") + chalk.red(part2End - startTime + " ms"));
process.exit(0);
})();