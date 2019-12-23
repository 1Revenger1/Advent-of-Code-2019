import * as fs from 'fs';
import * as chalk from 'chalk';
import { IntCodeinnator, Storage } from './IntCodeinnator';

(async () => {

const day : number = 23;

console.log("+-------------------------------+");
console.log("|  " + chalk.blueBright("Advent of Code 2019:") + chalk.green(" Day", day) + "  |");
console.log("+-------------------------------+\n");

// Get file and split it into lines
let file : string = fs.readFileSync("./input.txt", {
    encoding: "utf8",
});

// Timing start
let startTime : number = new Date().getTime();

interface Packet {
    Dest: number,
    X: number,
    Y: number,
}

let storage = Storage.importFile(file);
let innators : IntCodeinnator[] = [];
let queue : Packet[][] = new Array(50);
let output : number[][] = new Array(50);
let is255 = false;

for(let i = 0; i < 50; i++) {
    queue[i] = [];
    output[i] = [];
    innators.push(new IntCodeinnator(storage));
    innators[i].run(null, null, [i], async () => {
        if(queue[i].length > 0) {
            console.log(queue[i].length);
            if(queue[i][0].X != NaN) {
                let X = queue[i][0].X;
                queue[i][0].X = NaN;
                return X;
            } else {
                let Y = queue[i][0].Y;
                queue[i].shift();
                return Y;
            }
        } else return -1;
    }, output => { 
        let packetIndex = output[i][0];
        console.log(`Output: ${i}`)
        if(packetIndex < 2) {
            output[i][packetIndex + 1] = output;
            output[i][0]++;
        } else {
            if(output[i][1] == 255) { 
                is255 = true;
                console.log(output);
                innators.forEach(innator => innator.haltInnator());
                process.exit(0);
            } else {
                queue[output[i][1]].push({
                    Dest: output[i][1],
                    X: output[i][2],
                    Y: output
                });
                output[i][0] = 0;
            }
        }
     })
}




// Timing end
let part1End : number = new Date().getTime();

// Part 1 done
console.log(chalk.yellow("Part 1 done in: ") + chalk.red(part1End - startTime + " ms")
    + chalk.green(" Executing Part 2..."));


// Timing of Part 2 start
let startPart2Time : number = new Date().getTime();

// Timing end
let part2End : number = new Date().getTime();

// Part 2 done
console.log(chalk.yellow("Part 2 done in: ") + chalk.red(part2End - startPart2Time + " ms")
    + chalk.green(" Done executing...\n"));
console.log(chalk.blueBright("Total execution time of: ") + chalk.red(part2End - startTime + " ms"));

})();