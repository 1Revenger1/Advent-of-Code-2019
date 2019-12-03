import * as fs from 'fs';
import * as chalk from 'chalk';
import { IntCodeinnator, Storage } from './IntCodeinnator';
import { kMaxLength } from 'buffer';

const day : number = 0;

console.log("+------------------------------+");
console.log("|  " + chalk.blueBright("Advent of Code 2019:") + chalk.green(" Day", day) + "  |");
console.log("+------------------------------+\n");

// Get file and split it into lines
let file : string[] = fs.readFileSync("./input.txt", {
    encoding: "utf8",
}).split('\n');

// Timing start
let startTime : number = new Date().getTime();

interface pos {
    x: number;
    y: number;
    steps: number;
}

interface inter {
    x: number;
    y: number;
    stepsOne: number;
    stepsTwo: number;
}

let positions : pos[] = [{x: 0, y:0, steps: 0}];
let intersections : inter[] = [];

// Calculate the segments for the first wire
file[0].split(",").forEach(input => {
    let lastPos :pos = positions[positions.length - 1];

    switch(input.charAt(0)){
        case("R"):
            input = input.replace("R", "");
            let num = parseInt(input);
            positions.push({x: lastPos.x + num, y: lastPos.y, steps:lastPos.steps + num});
            break;
        case("U"):
            input = input.replace("U", "");
            let num1 = parseInt(input);
            positions.push({x: lastPos.x, y: lastPos.y + num1, steps:lastPos.steps + num1});
            break;
        case("D"):
            input = input.replace("D", "");
            let num2 = parseInt(input);
            positions.push({x: lastPos.x, y: lastPos.y - num2, steps:lastPos.steps + num2});
            break;
        case("L"):
            input = input.replace("L", "");
            let num3 = parseInt(input);
            positions.push({x: lastPos.x - num3, y: lastPos.y, steps:lastPos.steps + num3});
            break;
    }
});

// Calculate if the point crosses any of the first segments in the first wire
// We don't care about steps
function posContains(positions : pos[], curPos : pos){
    for(let i = 1; i < positions.length - 1; i++) {
        // Check if it crosses the x plane
        // If so, check if the y's are in the segment before and after this point in wire 1
        if(positions[i].x === curPos.x) {
            if(positions[i].y > positions[i -1].y) {
                if(curPos.y < positions[i].y && curPos.y > positions[i - 1].y) {
                    intersections.push({...curPos, stepsOne:0, stepsTwo:0});
                }
            } else {
                if(curPos.y > positions[i].y && curPos.y < positions[i - 1].y) {
                    intersections.push({...curPos, stepsOne:0, stepsTwo:0});
                }
            }
            if(positions[i].y > positions[i + 1].y) {
                if(curPos.y < positions[i].y && curPos.y > positions[i + 1].y) {
                    intersections.push({...curPos, stepsOne:0, stepsTwo:0});
                }
            } else {
                if(curPos.y > positions[i].y && curPos.y < positions[i + 1].y) {
                    intersections.push({...curPos, stepsOne:0, stepsTwo:0});
                }
            }
        }

        // Check if it crosses the y plane
        // If so, check if the x's are in the segment before and after this point in wire 1
        if(positions[i].y === curPos.y) {
            if(positions[i].x > positions[i -1].x) {
                if(curPos.x < positions[i].x && curPos.x > positions[i - 1].x) {
                    intersections.push({...curPos, stepsOne:0, stepsTwo:0});
                }
            } else {
                if(curPos.x > positions[i].x && curPos.x < positions[i - 1].x) {
                    intersections.push({...curPos, stepsOne:0, stepsTwo:0});
                }
            }
            if(positions[i].x > positions[i + 1].x) {
                if(curPos.x < positions[i].x && curPos.x > positions[i + 1].x) {
                    intersections.push({...curPos, stepsOne:0, stepsTwo:0});
                }
            } else {
                if(curPos.x > positions[i].x && curPos.x < positions[i + 1].x) {
                    intersections.push({...curPos, stepsOne:0, stepsTwo:0});
                }
            }
        }
    }
    return false;
}

// Go through each step/point rather than each segment for wire 2
// Check if any point intersects then add it
// We don't care about steps right now
let curPos : pos = {x: 0, y:0, steps: 0}
file[1].split(",").forEach(input => {
    let lastPos :pos = curPos;

    switch(input.charAt(0)){
        case("R"):
            input = input.replace("R", "");
            let num = parseInt(input);
            for(let i = lastPos.x; i <= lastPos.x + num; i++) {
                posContains(positions, {x: i, y: lastPos.y, steps:lastPos.steps + i});
            }
            curPos = {x: lastPos.x + num, y: lastPos.y, steps:lastPos.steps + num};
            break;
        case("U"):
            input = input.replace("U", "");
            let num1 = parseInt(input);
            for(let i = lastPos.y; i <= lastPos.y + num1; i++) {
                posContains(positions, {x: lastPos.x, y: i, steps:lastPos.steps + i})
            }
            curPos = {x: lastPos.x, y: lastPos.y + num1, steps:lastPos.steps + num1};
            break;
        case("D"):
            input = input.replace("D", "");
            let num2 = parseInt(input);
            for(let i = lastPos.y; i >= lastPos.y - num2; i--) {
                posContains(positions, {x: lastPos.x, y: i, steps:lastPos.steps + i})
            }
            curPos = {x: lastPos.x, y: lastPos.y - num2, steps:lastPos.steps + num2};
            break;
        case("L"):
            input = input.replace("L", "");
            let num3 = parseInt(input);
            for(let i = lastPos.x; i >= lastPos.x - num3; i--) {
                posContains(positions, {x: i, y: lastPos.y, steps:lastPos.steps + i})
            }
            curPos = {x: lastPos.x - num3, y: lastPos.y, steps:lastPos.steps + num3};
            break;
    }
});

let distance = 1000000000000;
// Calculate taxicab distance, then check if it's lower
intersections.forEach((position : inter) => {
    let tempDistance = Math.abs(position.x) + Math.abs(position.y);
    if(tempDistance < distance) distance = tempDistance;
});

console.log(distance);

// Timing end
let part1End : number = new Date().getTime();

// Part 1 done
console.log(chalk.yellow("Part 1 done in: ") + chalk.red(part1End - startTime + " ms")
    + chalk.green(" Executing Part 2..."));


// Timing of Part 2 start
let startPart2Time : number = new Date().getTime();

// See the minimum number of steps needed to hit each intersection for wire 2
// Iterate through each step/position
curPos = {x: 0, y:0, steps: 0}
file[1].split(",").forEach(input => {
    let lastPos :pos = curPos;

    switch(input.charAt(0)){
        case("R"):
            input = input.replace("R", "");
            let num = parseInt(input);
            for(let i = lastPos.x; i <= lastPos.x + num; i++) {
                intersections.forEach((position : inter) => {
                    if(position.x === i && position.y === lastPos.y) { 
                        position.stepsTwo = lastPos.steps + Math.abs(i - lastPos.x);
                    }
                });
            }
            curPos = {x: lastPos.x + num, y: lastPos.y, steps:lastPos.steps + num};
            break;
        case("U"):
            input = input.replace("U", "");
            let num1 = parseInt(input);
            for(let i = lastPos.y; i <= lastPos.y + num1; i++) {
                intersections.forEach((position : inter) => {
                    if(position.x === lastPos.x && position.y === i) { 
                        position.stepsTwo = lastPos.steps + Math.abs(i - lastPos.y);
                    }
                });
            }
            curPos = {x: lastPos.x, y: lastPos.y + num1, steps:lastPos.steps + num1};
            break;
        case("D"):
            input = input.replace("D", "");
            let num2 = parseInt(input);
            for(let i = lastPos.y; i >= lastPos.y - num2; i--) {
                intersections.forEach((position : inter) => {
                    if(position.x === lastPos.x && position.y === i) { 
                        position.stepsTwo = lastPos.steps + Math.abs(i - lastPos.y);
                    }
                });
            }
            curPos = {x: lastPos.x, y: lastPos.y - num2, steps:lastPos.steps + num2};
            break;
        case("L"):
            input = input.replace("L", "");
            let num3 = parseInt(input);
            for(let i = lastPos.x; i >= lastPos.x - num3; i--) {
                intersections.forEach((position : inter) => {
                    if(position.x === i && position.y === lastPos.y) { 
                        position.stepsTwo = lastPos.steps + Math.abs(i - lastPos.x);
                    }
                });
            }
            curPos = {x: lastPos.x - num3, y: lastPos.y, steps:lastPos.steps + num3};
            break;
    }
});

// See the minimum number of steps needed to hit each intersection for wire 1
// Iterate through each step/position
curPos = {x: 0, y:0, steps: 0}
file[0].split(",").forEach(input => {
    let lastPos :pos = curPos;

    switch(input.charAt(0)){
        case("R"):
            input = input.replace("R", "");
            let num = parseInt(input);
            for(let i = lastPos.x; i <= lastPos.x + num; i++) {
                intersections.forEach((position : inter) => {
                    if(position.x === i && position.y === lastPos.y) { 
                        position.stepsOne = lastPos.steps + Math.abs(i - lastPos.x);
                    }
                });
            }
            curPos = {x: lastPos.x + num, y: lastPos.y, steps:lastPos.steps + num};
            break;
        case("U"):
            input = input.replace("U", "");
            let num1 = parseInt(input);
            for(let i = lastPos.y; i <= lastPos.y + num1; i++) {
                intersections.forEach((position : inter) => {
                    if(position.x === lastPos.x && position.y === i) { 
                        position.stepsOne = lastPos.steps + Math.abs(i - lastPos.y);
                    }
                });
            }
            curPos = {x: lastPos.x, y: lastPos.y + num1, steps:lastPos.steps + num1};
            break;
        case("D"):
            input = input.replace("D", "");
            let num2 = parseInt(input);
            for(let i = lastPos.y; i >= lastPos.y - num2; i--) {
                intersections.forEach((position : inter) => {
                    if(position.x === lastPos.x && position.y === i) { 
                        position.stepsOne = lastPos.steps + Math.abs(i - lastPos.y);
                    }
                });
            }
            curPos = {x: lastPos.x, y: lastPos.y - num2, steps:lastPos.steps + num2};
            break;
        case("L"):
            input = input.replace("L", "");
            let num3 = parseInt(input);
            for(let i = lastPos.x; i >= lastPos.x - num3; i--) {
                intersections.forEach((position : inter) => {
                    if(position.x === i && position.y === lastPos.y) { 
                        position.stepsOne = lastPos.steps + Math.abs(i - lastPos.x);
                    }
                });
            }
            curPos = {x: lastPos.x - num3, y: lastPos.y, steps:lastPos.steps + num3};
            break;
    }
});

let totSteps : number = 1000000000000000;
// Calculate total steps then see if it's lower
intersections.forEach((position : inter) => {
    totSteps = (position.stepsOne + position.stepsTwo < totSteps) ? position.stepsOne + position.stepsTwo : totSteps
});

console.log(totSteps);

// Timing end
let part2End : number = new Date().getTime();

// Part 2 done
console.log(chalk.yellow("Part 2 done in: ") + chalk.red(part2End - startPart2Time + " ms")
    + chalk.green(" Done executing...\n"));
console.log(chalk.blueBright("Total execution time of: ") + chalk.red(part2End - startTime + " ms"));