import * as fs from 'fs';
import * as chalk from 'chalk';
import { IntCodeinnator, Storage } from './IntCodeinnator';

(async () => {

const day : number = 0;

console.log("+------------------------------+");
console.log("|  " + chalk.blueBright("Advent of Code 2019:") + chalk.green(" Day", day) + "  |");
console.log("+------------------------------+\n");

// Timing start
let startTime : number = new Date().getTime();

// Get file and split it into lines
let file : number[] = fs.readFileSync("./input.txt", {
    encoding: "utf8",
}).split("").map(value => parseInt(value));

const basePattern = [1, -1];

function phase(input : number[]) {
    let output = new Array(input.length).fill(0);
    let inputIndex = 0;
    let patternIndex = 0;

    while(inputIndex < input.length) {
        let patternCount = inputIndex + 1;
        for(let i = inputIndex; i < output.length; i++) {
            patternCount--;
            if(patternCount == -1) {
                patternCount = inputIndex;
                patternIndex = ++patternIndex % 2;
                i += inputIndex + 1;
                if(!(i < input.length)) break;
            }
            output[inputIndex] += input[i] * basePattern[patternIndex];
        }
        output[inputIndex] = Math.abs(output[inputIndex]) % 10;
        inputIndex++;
        patternIndex = 1;
    }
    return output;
}

let output = [...file];
for(let i = 0; i < 100; i++) {
    output = phase(output);
}

console.log(output);

// Timing end
let part1End : number = new Date().getTime();

// Part 1 done
console.log(chalk.yellow("Part 1 done in: ") + chalk.red(part1End - startTime + " ms")
    + chalk.green(" Executing Part 2..."));


// Timing of Part 2 start
let startPart2Time : number = new Date().getTime();

output = [];
// make output
for(let i = 0; i < 10000; i++) {
    for(let j = 0; j < file.length; j++) {
        output[(i * file.length) + j] = file[j];
    }
}

let offsetStr = "";
for(let i = 0; i < 7; i++) {
    offsetStr += file[i];
}
let offset = parseInt(offsetStr);

for(let i = 0; i < 100; i++) {
    for(let j = output.length - 2; j > offset - 1; j--) {
        output[j] = Math.abs(output[j] + output[j + 1]) % 10;
    }
}

let outputStr = "";
for(let i = offset; i < offset + 8; i++) {
    outputStr += output[i];
}

console.log(outputStr);

// Timing end
let part2End : number = new Date().getTime();

// Part 2 done
console.log(chalk.yellow("Part 2 done in: ") + chalk.red(part2End - startPart2Time + " ms")
    + chalk.green(" Done executing...\n"));
console.log(chalk.blueBright("Total execution time of: ") + chalk.red(part2End - startTime + " ms"));
process.exit(0);
})();