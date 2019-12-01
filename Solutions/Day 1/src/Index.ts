import * as fs from 'fs';
import { format } from 'path';

let file : string = fs.readFileSync("./input.txt", {
    encoding: "utf8",
});

let input : string[] = file.split("\n");

console.log("Advent of Code: %s\n", fs.readdirSync("../"));

let sum : number = 0;

input.forEach((line : string) => {
    let num : number = parseInt(line);
    sum += Math.floor(num / 3.0) - 2;
});

console.log("Part 1 Answer: %d", sum);

function recursiveTotal(num : number) : number {
    let fuel : number = Math.floor(num / 3.0) - 2;
    if(fuel <= 0) return 0;
    else {
        return fuel + recursiveTotal(fuel);
    }
}

sum = 0;

input.forEach((line : string) => {
    let num : number = parseInt(line);
    sum += recursiveTotal(num);
});

console.log("Part 2 Answer: %d", sum);