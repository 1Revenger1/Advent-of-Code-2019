import * as fs from 'fs';
import * as chalk from 'chalk';
import { IntCodeinnator, Storage } from './IntCodeinnator';

(async () => {

const day : number = 11;

console.log("+-------------------------------+");
console.log("|  " + chalk.blueBright("Advent of Code 2019:") + chalk.green(" Day", day) + "  |");
console.log("+-------------------------------+\n");

// Get file and split it into lines
let file : string = fs.readFileSync("./input.txt", {
    encoding: "utf8",
});

let storage = Storage.importFile(file);
let innator = new IntCodeinnator(storage);

let field : Panel[] = [];

interface Pos {
    x : number,
    y : number
}

interface Panel {
    pos : Pos,
    color : number
}

interface RoboPos {
    pos : Pos,
    hdg : roboHdg
}

enum roboHdg {
    UP,
    RIGHT,
    DOWN,
    LEFT
}

let roboPos : RoboPos = {
    pos : {
        x : 0,
        y : 0
    },
    hdg : roboHdg.UP
}

// Timing start
let startTime : number = new Date().getTime();

let firstOutput : number = null;

await innator.run(null, null, null, () => { return new Promise (res => {
    let input = null;
    field.forEach(value => {
        if(roboPos.pos.x == value.pos.x && roboPos.pos.y == value.pos.y) { 
            input = value.color;
            //console.log("Hello....?");
        }
    });

    if(input == null) {
        field.push({pos: {x: roboPos.pos.x, y: roboPos.pos.y}, color: 0});    
        input = 0;
    }
    //console.log(`${roboPos.pos.x}, ${roboPos.pos.y}, ${field.length}`);
    res(input);
})}, async output => {
    if(firstOutput == null) firstOutput = output;
    else {
        let packet = {
            color: firstOutput,
            turn: output
        }

        field.forEach(value => {
            if(roboPos.pos.x == value.pos.x && roboPos.pos.y == value.pos.y) {
                value.color = packet.color;
            }
        });

        if(packet.turn == 1) {
            roboPos.hdg = ++roboPos.hdg % 4;
        } else {
            roboPos.hdg = --roboPos.hdg;
            if(roboPos.hdg < 0) roboPos.hdg += 4;
        }

        switch(roboPos.hdg) {
            case roboHdg.UP: roboPos.pos.y++; break;
            case roboHdg.RIGHT: roboPos.pos.x++; break;
            case roboHdg.DOWN: roboPos.pos.y--; break;
            case roboHdg.LEFT: roboPos.pos.x--; break;
        }

        firstOutput = null;
    }
});

console.log(field.length);

// Timing end
let part1End : number = new Date().getTime();

// Part 1 done
console.log(chalk.yellow("Part 1 done in: ") + chalk.red(part1End - startTime + " ms")
    + chalk.green(" Executing Part 2..."));

innator.reset();

// Timing of Part 2 start
let startPart2Time : number = new Date().getTime();

firstOutput = null;
roboPos = {
    pos : {
        x : 0,
        y : 0
    },
    hdg : roboHdg.UP
}
field = [
    {
        pos: { x: 0, y:0},
        color: 1
    }
]

await innator.run(null, null, null, () => { return new Promise (res => {
    let input = null;
    field.forEach(value => {
        if(roboPos.pos.x == value.pos.x && roboPos.pos.y == value.pos.y) { 
            input = value.color;
        }
    });

    if(input == null) {
        field.push({pos: {x: roboPos.pos.x, y: roboPos.pos.y}, color: 0});    
        input = 0;
    }
    
    res(input);
})}, async output => {
    if(firstOutput == null) firstOutput = output;
    else {
        let packet = {
            color: firstOutput,
            turn: output
        }

        field.forEach(value => {
            if(roboPos.pos.x == value.pos.x && roboPos.pos.y == value.pos.y) {
                value.color = packet.color;
            }
        });

        if(packet.turn == 1) {
            roboPos.hdg = ++roboPos.hdg % 4;
        } else {
            roboPos.hdg = --roboPos.hdg;
            if(roboPos.hdg < 0) roboPos.hdg += 4;
        }

        switch(roboPos.hdg) {
            case roboHdg.UP: roboPos.pos.y++; break;
            case roboHdg.RIGHT: roboPos.pos.x++; break;
            case roboHdg.DOWN: roboPos.pos.y--; break;
            case roboHdg.LEFT: roboPos.pos.x--; break;
        }

        firstOutput = null;
    }
});

let image : number[][] = [];
field.forEach(value => {
    if(image[-value.pos.y] == null) image[-value.pos.y] = [];
    image[-value.pos.y][value.pos.x] = value.color;
});

for(let i = 0; i < image.length; i++) {
    let buffer = "";
    if(image[i] != null) 
        for(let pixel of image[i]) {
            if(pixel == null) buffer += " ";
            else if(pixel == 1) buffer += chalk.blue(pixel);
            else buffer += chalk.black(pixel);
        }
    console.log(buffer);
}

// Timing end
let part2End : number = new Date().getTime();

// Part 2 done
console.log(chalk.yellow("Part 2 done in: ") + chalk.red(part2End - startPart2Time + " ms")
    + chalk.green(" Done executing...\n"));
console.log(chalk.blueBright("Total execution time of: ") + chalk.red(part2End - startTime + " ms"));
process.exit(0);
})();