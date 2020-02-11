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
    output[i] = new Array(3).fill(0);
    innators.push(new IntCodeinnator(storage));

    innators[i].run(null, null, [i], async () => {
        if(queue[i].length > 0) {
            if(queue[i][0].X != null) {
                let X = queue[i][0].X;
                queue[i][0].X = null;
                return X;
            } else {
                let Y = queue[i][0].Y;
                queue[i].shift();
                return Y;
            }
        } else return -1;
    }, (out) => {
        let packetIndex = output[i][0];
        if(packetIndex < 2) {
            output[i][packetIndex + 1] = out;
            output[i][0]++;
        } else {
            if(output[i][1] == 255) { 
                is255 = true;
                innators.forEach(innator => innator.haltInnator());
                console.log(out);
            } else {
                queue[output[i][1]].push({
                    Dest: output[i][1],
                    X: output[i][2],
                    Y: out
                });
                output[i][0] = 0;
            }
        }
     });
}

while(!is255) {
    await new Promise(res => setTimeout(() => {res()}, 10));
}

// Timing end
let part1End : number = new Date().getTime();

innators.forEach(innator => innator.reset());

// Part 1 done
console.log(chalk.yellow("Part 1 done in: ") + chalk.red(part1End - startTime + " ms")
    + chalk.green(" Executing Part 2..."));

// Timing of Part 2 start
let startPart2Time : number = new Date().getTime();

let natPacket : Packet = null;
let lastPacket : Packet = {Dest:0, X: 0, Y:0};
let timeout = null;
queue = new Array(50);
output = new Array(50);
is255 = false;

for(let i = 0; i < 50; i++) {
    queue[i] = [];
    output[i] = new Array(4).fill(0);
    innators.push(new IntCodeinnator(storage));

    innators[i].run(null, null, [i], async () => {
        if(queue[i].length > 0) {
            output[i][3] = 0;
            if(queue[i][0].X != null) {
                let X = queue[i][0].X;
                queue[i][0].X = null;
                return X;
            } else {
                let Y = queue[i][0].Y;
                queue[i].shift();
                return Y;
            }
        }
        let isIdle = false
        if(i == 0) 
            isIdle = output.every(value => value[3] > 2);

        if(isIdle) {
            queue[0].push(natPacket);
            if(natPacket.Y == lastPacket.Y) { 
                console.log(natPacket.Y)
                is255 = true;
                innators.forEach(innator => innator.haltInnator());
            }
            lastPacket = {Dest: natPacket.Dest, X: natPacket.X, Y: natPacket.Y};
        }

        output[i][3]++;
        return -1;
    }, (out) => {
        let packetIndex = output[i][0];
        if(packetIndex < 2) {
            output[i][packetIndex + 1] = out;
            output[i][0]++;
        } else {
            let packet = {
                Dest: output[i][1],
                X: output[i][2],
                Y: out
            };

            if(output[i][1] == 255) {
                natPacket = packet;
            } else {
                queue[output[i][1]].push(packet);
                output[i][0] = 0;
            }
        }
     });
}

while(!is255) {
    await new Promise(res => setTimeout(() => {res()}, 10));
}

// Timing end
let part2End : number = new Date().getTime();

// Part 2 done
console.log(chalk.yellow("Part 2 done in: ") + chalk.red(part2End - startPart2Time + " ms")
    + chalk.green(" Done executing...\n"));
console.log(chalk.blueBright("Total execution time of: ") + chalk.red(part2End - startTime + " ms"));
process.exit();
})();