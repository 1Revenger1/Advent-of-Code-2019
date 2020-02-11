import * as fs from 'fs';
import * as chalk from 'chalk';
import { IntCodeinnator, Storage } from './IntCodeinnator';

(async () => {

const day : number = 25;

console.log("+-------------------------------+");
console.log("|  " + chalk.blueBright("Advent of Code 2019:") + chalk.green(" Day", day) + "  |");
console.log("+-------------------------------+\n");

// Get file and split it into lines
let file : string = fs.readFileSync("./input.txt", {
    encoding: "utf8",
});

// Give string and returns ASCII code
function getInput(input : string) : number[] {
    return (input + "\n").split("").map(value => value.charCodeAt(0));
}

function getOutput(input : number) : string {
    return String.fromCharCode(input);
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

let storage = Storage.importFile(file);
let innator = new IntCodeinnator(storage);

// Timing start
let startTime : number = new Date().getTime();

let pos : Pos = new Pos(0, 0);

let buffer = "";

let index = 0;
let input = "";
function divideInput() {
    let output = input.charCodeAt(index++);
    if(index == input.length && input != "") {
        input = "";
        index = 0;
    }
    return output;
}

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.on("line", line => {
    input = line + "\n";
});

let output = await innator.run(null, null, null, async () => {
    await new Promise(res => { setInterval(() => { if(input.includes("\n")) res()}, 100)});
    let letter = divideInput();
    return letter;
}, output => {
    if(output == 10) { 
        console.log(buffer);
        buffer = "";
    } else buffer += getOutput(output);
});

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