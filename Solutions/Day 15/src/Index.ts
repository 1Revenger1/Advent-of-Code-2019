import * as fs from 'fs';
import * as chalk from 'chalk';
import { IntCodeinnator, Storage } from './IntCodeinnator';

(async () => {

const day : number = 15;

console.log("+-------------------------------+");
console.log("|  " + chalk.blueBright("Advent of Code 2019:") + chalk.green(" Day", day) + "  |");
console.log("+-------------------------------+\n");

// Get file and split it into lines
let file : string = fs.readFileSync("./input.txt", {
    encoding: "utf8",
});

enum BlockType {
    Wall,
    Air,
    Oxygen
}

enum Direction {
    North, East, South, West
}

interface Pos {
    x: number,
    y: number
}

// Timing start
let startTime : number = new Date().getTime();

let storage = Storage.importFile(file);
let innator = new IntCodeinnator(storage);

let direction = Direction.North;

let hitWall = true;
let pos : Pos = {x: 0, y: 0};
let minPos : Pos = {x: 0, y: 0};
let maxPos : Pos = {x: 0, y: 0};
let wallsFound : Pos[] = [];

let foundOxy = false;

innator.setup(null, null, null, async () => {
    switch (direction) {
        case Direction.North: return 1;
        case Direction.East: return 4;
        case Direction.South: return 2;
        case Direction.West: return 3;
    }
}, output => {
    let blockInFront = {...pos};
    switch(direction) {
        case Direction.North: blockInFront.y++; break;
        case Direction.South: blockInFront.y--; break;
        case Direction.East: blockInFront.x++; break;
        case Direction.West: blockInFront.x--; break;
    }

    if(output == 2) foundOxy = true;
    if(output == 0) {
        let blockToSide = {x: pos.x, y: pos.y};
        let sideDir = (direction + 1) % 4;
        switch(sideDir) {
            case Direction.North: blockToSide.y++; break;
            case Direction.South: blockToSide.y--; break;
            case Direction.East:  blockToSide.x++; break;
            case Direction.West:  blockToSide.x--; break;
        }

        let sideWall = false;
        wallsFound.forEach(value => {sideWall = value.x == blockToSide.x && value.y == blockToSide.y ? true : (false || sideWall)})
        if((sideWall)) {
            direction--;
            if(direction < 0) direction = 3;
        } else {
            direction = ++direction % 4;
        }

        let inFront = false;
        wallsFound.forEach(value => {inFront = value.x == blockInFront.x && value.y == blockInFront.y? true : (false || sideWall)});

        if(!inFront) {
            wallsFound.push({...blockInFront});
            // direction = Math.floor(Math.random() * 4);
            let field : string[][] = new Array(maxPos.y + Math.abs(minPos.y) + 3);
            for(let i = 0; i < field.length; i++) {
                field[i] = new Array(maxPos.x + Math.abs(minPos.x) + 3).fill(" ");
            }
            
            let offsetX = minPos.x - 1;
            let offsetY = minPos.y - 1;
            
            
            wallsFound.forEach(wall => {
                field[wall.y - offsetY][wall.x - offsetX] = "#";
            });

            field[-offsetY][-offsetX] = chalk.bgRed(" ");
            
            console.log(field.map(value => value.join("")).join("\n"))
            console.log("---------------------------------------------------");
        }
    } else {
        pos = {...blockInFront};
        if(pos.x < minPos.x) minPos.x = pos.x;
        if(pos.x > maxPos.x) maxPos.x = pos.x;
        if(pos.y < minPos.y) minPos.y = pos.y;
        if(pos.y > maxPos.y) maxPos.y = pos.y;
    }
});

while(!foundOxy) await innator.run();



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
process.exit(0);
})();