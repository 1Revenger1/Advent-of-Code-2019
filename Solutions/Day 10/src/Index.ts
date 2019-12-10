import * as fs from 'fs';
import * as chalk from 'chalk';
import { IntCodeinnator, Storage } from './IntCodeinnator';

(async () => {

const day : number = 10;

console.log("+-------------------------------+");
console.log("|  " + chalk.blueBright("Advent of Code 2019:") + chalk.green(" Day", day) + "  |");
console.log("+-------------------------------+\n");

// Get file and split it into lines
let file : string = fs.readFileSync("./input.txt", {
    encoding: "utf8",
});

enum Type {
    ASTERIOD,
    BLANK
}

interface Pos {
    x : number,
    y : number,
    type: Type,
    numberOfVisible?: number,
    hits?: Pos[][]
}

// Given an integer dx, multiply slope by dx until we find an integer dy
// This has some rounding errors so check if within 0.0000001 of a whole int
function recursiveIntSlope(slope : number, x : number) {
    if(Math.abs(Math.round(slope * x) - slope * x) < 0.0000001) return x;
    else return recursiveIntSlope(slope, x + Math.sign(x))
}

function canSeePoint(field : Pos[][], target : Pos, pos : Pos) : boolean {
    let dyOrig = pos.y - target.y;
    let dxOrig = pos.x - target.x;

    let dy = dyOrig;
    let dx = dxOrig;

    // Get the smallest whole number intervals for points along the line
    if(dy == 0 && dx != 0) dx = Math.sign(dx);
    else if(dx == 0 && dy != 0) dy = Math.sign(dy);
    else if(dx != 0 && dy != 0) {
        let slope = dyOrig / dxOrig;
        
        dx = recursiveIntSlope(slope, Math.sign(dxOrig));
        dy = Math.round(dx * slope);
    }

    // Begin by looking at the target to where we are
    let possiblePosX = target.x + dx;
    let possiblePosY = target.y + dy;

    let canSee = true;
    // Loop untill either we hit another asteroid or we hit ourselves
    while(possiblePosX != pos.x || possiblePosY != pos.y) {
        
        // Check it exists and is an asteroid
        // If we hit an asteroid, then there is no line of site
        if(input[possiblePosY][possiblePosX] && input[possiblePosY][possiblePosX].type == Type.ASTERIOD) { 
            canSee = false;
            break;
        }

        possiblePosX += dx;
        possiblePosY += dy;
    }

    return canSee;
}

function printField(field : Pos[][]) : string[] {
    let stringField = [];
    for(let i = 0; i < field.length; i++) {
        let buffer = "";
        for(let j = 0; j < input[0].length; j++) {
            if(pos.x == j && pos.y == i) buffer += chalk.redBright("X");
            else if(field[i][j] && field[i][j].type == Type.ASTERIOD) buffer += chalk.gray("#");
            else buffer += chalk.black(".");
        }
        stringField.push(buffer);
    }
    return stringField;
}

// Timing start
let startTime : number = new Date().getTime();

let inputRows = file.split("\n");
let input : Pos[][] = [];

for(let row1 in inputRows) {
    let row = parseInt(row1);
    let colValues = inputRows[row].split("");
    if(input[row] == null) input[row] = [];

    colValues.forEach((value, index) => {
        input[row][index] = {
            x : index,
            y : row,
            type : value == "#" ? Type.ASTERIOD : Type.BLANK,
            numberOfVisible : 0,
            hits : []
        }
    });
}

for(let inputRow of input) {
    for(let pos of inputRow) {
        if(pos.type != Type.ASTERIOD) continue;
        // Loop through each asteroid, then find slope
        for(let checkRow of input) {
            for(let target of checkRow) {
                if(target.type != Type.ASTERIOD || (target.x == pos.x && target.y == pos.y)) continue;

                if(canSeePoint(input, pos, target)) { 
                    if(pos.hits[target.y] == null) pos.hits[target.y] = new Array();
                    pos.numberOfVisible++;
                    pos.hits[target.y][target.x] = {
                        x: target.x,
                        y: target.y,
                        type: Type.ASTERIOD
                    };
                }
            }
        }
    }
}

let pos : Pos = input[0][0];
input.forEach(value => {
    value.forEach(position => {
        if(pos.numberOfVisible < position.numberOfVisible) pos = position;
    })
})

console.log(`X: ${pos.x}, Y: ${pos.y}, Number Visible: ${pos.numberOfVisible}`);

// Timing end
let part1End : number = new Date().getTime();

// Part 1 done
console.log(chalk.yellow("Part 1 done in: ") + chalk.red(part1End - startTime + " ms")
    + chalk.green(" Executing Part 2..."));

// Timing of Part 2 start
let startPart2Time : number = new Date().getTime();

let angle = Math.PI / 2;
let destroy = 0;
let wrap = true;
let origField = printField(input);

while(destroy < 200) {
    
    let difference = Math.PI;
    let toBeRemoved : Pos;
    let tempAngle = 0;
    pos.hits.forEach((value, index) => {
        value.forEach((target, indexX) => {
            if(target.x == pos.x && target.y == pos.y) return;
            if(target == null) return;
            let dyOrig = pos.y - target.y;
            let dxOrig = pos.x - target.x;

            let anglePos = Math.atan2(dyOrig, -dxOrig);
            if(wrap) { if (angle - anglePos < 0 || angle - anglePos > difference) return; }
            else if(angle - anglePos <= 0 || angle - anglePos > difference) return;
            if(canSeePoint(pos.hits, target, pos)) {
                difference = angle - anglePos;
                toBeRemoved = target;
                tempAngle = anglePos;
            }
        });
    });

    if(toBeRemoved != null) {
        destroy++;
        if(destroy == 200) {
            console.log("\nOriginal: " + new Array(input.length - 10).join(" ") + "\t\tVaporized:")
            console.log(printField(pos.hits).map((value, index) => { return origField[index] + "\t" + value}).join("\n"));
            console.log(`\nX: ${toBeRemoved.x} Y: ${toBeRemoved.y}\n`); 
        }

        delete pos.hits[toBeRemoved.y][toBeRemoved.x];
        angle = tempAngle;
        wrap = false;
    } else {
        angle = Math.PI;
        wrap = true;
    }
}

// Timing end
let part2End : number = new Date().getTime();

// Part 2 done
console.log(chalk.yellow("Part 2 done in: ") + chalk.red(part2End - startPart2Time + " ms")
    + chalk.green(" Done executing...\n"));
console.log(chalk.blueBright("Total execution time of: ") + chalk.red(part2End - startTime + " ms"));
process.exit(0);
})();