import * as fs from 'fs';
import * as chalk from 'chalk';
import { IntCodeinnator, Storage } from './IntCodeinnator';

(async () => {

const day : number = 19;

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

let field : boolean[] = [];
for(let y = 0; y < 50; y++) {
    for(let x = 0; x < 50; x++) {
        innator.reset();
        let output = await innator.run(null, null, [x, y]);
        field.push(output[output.length - 1] == 1);
    }
}

let sum = 0;
field.forEach(value => {
    if(value) sum++;
});

console.log(`Sum of tractor filled pixels: ${sum}`);

// Timing end
let part1End : number = new Date().getTime();

// Part 1 done
console.log(chalk.yellow("Part 1 done in: ") + chalk.red(part1End - startTime + " ms")
    + chalk.green(" Executing Part 2..."));

// Timing of Part 2 start
let startPart2Time : number = new Date().getTime();

let buffer = "";
let bufy = 0;
field.forEach(value => {
    buffer += value ? "#" : ".";
    bufy = ++bufy % 50;
    if(bufy == 0) buffer += "\n";
});

async function getXY(x: number, y: number) {
    innator.reset();
    return await innator.run(null, null, [x, y]); 
}

let x = 5;
let y = 20;
while(true) {
    // Find bottom of the tractor beam area
    y++;
    while(true) {
        let result = await getXY(x, y);
        if(result[0] == 0) x++;
        else break;
    }  
    // See if the opposite corner of a 100x100 box would fit
    let result = await getXY(x + 99, y - 99);
    if(result[0] == 1) break;
}

console.log(`100x100 Area at: ${x}, ${y-99}`);

// Timing end
let part2End : number = new Date().getTime();

// Part 2 done
console.log(chalk.yellow("Part 2 done in: ") + chalk.red(part2End - startPart2Time + " ms")
    + chalk.green(" Done executing...\n"));
console.log(chalk.blueBright("Total execution time of: ") + chalk.red(part2End - startTime + " ms"));
process.exit(0);
})();