import * as fs from 'fs';
import * as chalk from 'chalk';
import { IntCodeinnator, Storage } from './IntCodeinnator';
import { EventEmitter } from 'events';
(async () => {

const day : number = 7;

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

let output = [];

for(let i = 0; i < 5; i++) {
    for(let j = 0; j < 5; j++) {
        if([i].includes(j)) continue;
        for(let k = 0; k < 5; k++) {
            if([i, j].includes(k)) continue;
            for(let m = 0; m < 5; m++) {
                if([i, j, k].includes(m)) continue;
                for(let n = 0; n < 5; n++) {
                    if([i, j, k, m].includes(n)) continue;
                    innator.reset();
                    let out = (await innator.run(null, null, [i, 0]))[0];
                    innator.reset();
                    out = (await innator.run(null, null, [j, out]))[0];
                    innator.reset();
                    out = (await innator.run(null, null, [k, out]))[0];
                    innator.reset();
                    out = (await innator.run(null, null, [m, out]))[0];
                    innator.reset();
                    output.push((await innator.run(null, null, [n, out]))[0]);
                }
            }
        }
    }
}

let max = 0;
for(let x of output) {
    if(x > max) max = x;
}

console.log(max);

// Timing end
let part1End : number = new Date().getTime();

// Part 1 done
console.log(chalk.yellow("Part 1 done in: ") + chalk.red(part1End - startTime + " ms")
    + chalk.green(" Executing Part 2..."));

innator.reset();

// Timing of Part 2 start
let startPart2Time : number = new Date().getTime();

let innator1 = new IntCodeinnator(storage);
let innator2 = new IntCodeinnator(storage);
let innator3 = new IntCodeinnator(storage);
let innator4 = new IntCodeinnator(storage);
let innator5 = new IntCodeinnator(storage);

output = [];
for(let i = 5; i < 10; i++) {
    for(let j = 5; j < 10; j++) {
        if([i].includes(j)) continue;
        for(let k = 5; k < 10; k++) {
            if([i, j].includes(k)) continue;
            for(let m = 5; m < 10; m++) {
                if([i, j, k].includes(m)) continue;
                for(let n = 5; n < 10; n++) {
                    if([i, j, k, m].includes(n)) continue;
                    innator1.reset();
                    innator2.reset();
                    innator3.reset();
                    innator4.reset();
                    innator5.reset();
                                        
                    let wrapAroundEvent = new EventEmitter();

                    innator5.run(null, null, [n], () => {
                        return new Promise(res => wrapAroundEvent.once("45", (arg) => { res(arg)}))
                    }, (output) => wrapAroundEvent.emit("wrap", output)).then(out => {output.push(out); wrapAroundEvent.emit("done")});
                    innator4.run(null, null, [m], () => {
                        return new Promise(res => wrapAroundEvent.once("34", (arg) => {res(arg)}))
                    }, (output) => wrapAroundEvent.emit("45", output));
                    innator3.run(null, null, [k], () => {
                        return new Promise(res => wrapAroundEvent.once("23", (arg) => {res(arg)}))
                    }, (output) => wrapAroundEvent.emit("34", output));
                    innator2.run(null, null, [j], () => {
                        return new Promise(res => wrapAroundEvent.once("12", (arg) => {res(arg)}))
                    }, (output) => wrapAroundEvent.emit("23", output));
                    innator1.run(null, null, [i, 0], () => {
                        return new Promise(res => wrapAroundEvent.once("wrap", (arg) => { res(arg)}))
                    }, (output) => wrapAroundEvent.emit("12", output));

                    await new Promise(res => wrapAroundEvent.once("done", (arg) => {res()}));
                }
            }
        }
    }
}

max = 0;
for(let x of output) {
    if(x[x.length - 1] > max) max = x[x.length - 1];
}

console.log(max);

// Timing end
let part2End : number = new Date().getTime();

// Part 2 done
console.log(chalk.yellow("Part 2 done in: ") + chalk.red(part2End - startPart2Time + " ms")
    + chalk.green(" Done executing...\n"));
console.log(chalk.blueBright("Total execution time of: ") + chalk.red(part2End - startTime + " ms"));
process.exit(0);
})();