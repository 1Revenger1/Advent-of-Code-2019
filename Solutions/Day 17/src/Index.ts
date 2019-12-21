import * as fs from 'fs';
import * as chalk from 'chalk';
import { IntCodeinnator, Storage } from './IntCodeinnator';

(async () => {

const day : number = 17;

console.log("+-------------------------------+");
console.log("|  " + chalk.blueBright("Advent of Code 2019:") + chalk.green(" Day", day) + "  |");
console.log("+-------------------------------+\n");

// Get file and split it into lines
let file : string = fs.readFileSync("./input.txt", {
    encoding: "utf8",
});

let storage = Storage.importFile(file);
let innator = new IntCodeinnator(storage);

// Timing start
let startTime : number = new Date().getTime();

let output = await innator.run();

let index = 0;
let line = 0;

let buffer : string[][] = [[]];
output.forEach(value => {
    if(buffer[line] == null) buffer[line] = [];
    switch(value) {
        case 10: line++; index = 0; break;
        default: buffer[line][index++] = String.fromCharCode(value);
    }
})
delete buffer[buffer.length - 1];

let alignment = 0;
buffer.forEach((row, indexY) => {
    if(indexY == buffer.length - 2 || indexY == 0) return;
    row.forEach((pixel, indexX) => {
        if(indexX == row.length - 1 || indexX == 0) return;
        if(pixel == "#"
        && buffer[indexY + 1][indexX] == "#"
        && buffer[indexY - 1][indexX] == "#"
        && buffer[indexY][indexX + 1] == "#"
        && buffer[indexY][indexX - 1] == "#") {
            alignment += (indexX) * (indexY)
        }
    });
})

console.log(alignment);

function drawField(field: string[][]) {
    let outputBuf = "";
    field.forEach(value => {
        value.forEach(value => {
            outputBuf += value;
        })
        outputBuf += "\n";
    })
    console.log(outputBuf);
}

drawField(buffer);
// Timing end
let part1End : number = new Date().getTime();

// Part 1 done
console.log(chalk.yellow("Part 1 done in: ") + chalk.red(part1End - startTime + " ms")
    + chalk.green(" Executing Part 2..."));

let memory = storage.getMemory();
memory[0] = 2;
storage.setMemory(memory);
innator.reset();

// Timing of Part 2 start
let startPart2Time : number = new Date().getTime();

function getInput(input : string) : number[] {
    return output = (input + "\n").split("").map(value => value.charCodeAt(0));
}

let input = [].concat(getInput("A,A,B,C,B,C,B,A,C,A"),
getInput("R,8,L,12,R,8"),
getInput("L,10,L,10,R,8"),
getInput("L,12,L,12,L,10,R,10"), getInput("n"));

let innatorOut = await innator.run(null, null, input);
console.log(innatorOut[innatorOut.length - 1]);

// Timing end
let part2End : number = new Date().getTime();

// Part 2 done
console.log(chalk.yellow("Part 2 done in: ") + chalk.red(part2End - startPart2Time + " ms")
    + chalk.green(" Done executing...\n"));
console.log(chalk.blueBright("Total execution time of: ") + chalk.red(part2End - startTime + " ms"));
process.exit(0);
})();