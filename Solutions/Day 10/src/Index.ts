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

let exampleInput : string = `.#..##.###...#######
##.############..##.
.#.######.########.#
.###.#######.####.#.
#####.##.#.##.###.##
..#####..#.#########
####################
#.####....###.#.#.##
##.#################
#####.##.###..####..
..######..##.#######
####.##.####...##..#
.#####..#.######.###
##...#.##########...
#.##########.#######
.####.#.###.###.#.##
....##.##.###..#####
.#.#.###########.###
#.#.#.#####.####.###
###.##.####.##.#..##`;

enum Type {
    ASTERIOD,
    BLANK
}

interface Pos {
    x : number,
    y : number,
    type : Type,
    numberOfVisible : number,
    hits : {x: number, y: number, slope: number}[]
}

// Timing start
let startTime : number = new Date().getTime();

let inputRows = exampleInput.split("\n");
//let inputRows = file.split("\r\n");
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
                let dyOrig = pos.y - target.y;
                let dxOrig = pos.x - target.x;

                let dy = dyOrig;
                let dx = dxOrig;

                if(dy == 0 && dx != 0) dx = Math.sign(dx);
                else if(dx == 0 && dy != 0) dy = Math.sign(dy);
                else if(dx != 0 && dy != 0) {
                    let slope = dyOrig / dxOrig;
                    
                    let recursiveFun = (slope, x) => {
                        // console.log(`${slope}, ${x}`)
                        if(Number.isInteger(slope * x) || Math.abs(Math.round(slope * x) - slope * x) < 0.0000001) return x;
                        else return recursiveFun(slope, x + Math.sign(x))
                    }
                    
                    dx = recursiveFun(slope, Math.sign(dxOrig));
                    dy = Math.round(dx * slope);
                }

                let possiblePosX = target.x + dx;
                let possiblePosY = target.y + dy;

                let canSee = true;
                while(possiblePosX != pos.x || possiblePosY != pos.y) {
                    
                    if(input[possiblePosY][possiblePosX].type == Type.ASTERIOD) { 
                        canSee = false;
                        break;
                    }

                    possiblePosX += dx;
                    possiblePosY += dy;
                }
                if(canSee) { 
                    let slope = Math.atan2(dyOrig, dxOrig);

                    pos.numberOfVisible++;
                    pos.hits.push({
                        x: target.x,
                        y: target.y,
                        slope: slope
                    })
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

console.log(pos);

// Timing end
let part1End : number = new Date().getTime();

// Part 1 done
console.log(chalk.yellow("Part 1 done in: ") + chalk.red(part1End - startTime + " ms")
    + chalk.green(" Executing Part 2..."));

// Timing of Part 2 start
let startPart2Time : number = new Date().getTime();

let angle = Math.PI / 2;
let destroy = 0;
let lastDestroyed = null;
while(destroy < 200) {
    
    let difference = Math.PI;
    let toBeRemoved = null;
    pos.hits.forEach((value, index) => {
        let isCardinal = false;

        if(isCardinal && angle - value.slope == difference) {
            let posToBeRemoved = pos.hits[toBeRemoved];
            if(Math.sqrt(Math.pow(value.x - pos.x, 2) + Math.pow(value.y - pos.y, 2))
                < Math.sqrt(Math.pow(posToBeRemoved.x - pos.x, 2) + Math.pow(posToBeRemoved.y - pos.y, 2))) {
                    toBeRemoved = index;
            }
        }

        if(destroy == 0 && angle - value.slope == 0) {
            if(toBeRemoved != null) {
                if(value.y > pos.hits[toBeRemoved].y) toBeRemoved = index;
            } else toBeRemoved = index;
        }  else if(angle - value.slope < difference && angle - value.slope > 0) {
            toBeRemoved = index;
            difference = angle - value.slope;
            if(value.slope % (Math.PI / 2) == 0) isCardinal = true;
        }
    });

    if(toBeRemoved != null) {
        console.log(pos.hits[toBeRemoved]);
        destroy++;
        angle = pos.hits[toBeRemoved].slope;
        lastDestroyed = {...pos.hits[toBeRemoved]};
        delete pos.hits[toBeRemoved];
    } else {
        angle = Math.PI;
    }
}

console.log(lastDestroyed);

// Timing end
let part2End : number = new Date().getTime();

// Part 2 done
console.log(chalk.yellow("Part 2 done in: ") + chalk.red(part2End - startPart2Time + " ms")
    + chalk.green(" Done executing...\n"));
console.log(chalk.blueBright("Total execution time of: ") + chalk.red(part2End - startTime + " ms"));
process.exit(0);
})();