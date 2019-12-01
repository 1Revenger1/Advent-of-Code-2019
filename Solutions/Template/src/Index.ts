import * as fs from 'fs';

let file : string = fs.readFileSync("./input.txt", {
    encoding: "utf8",
});

let input : string[] = file.split("\n");

console.log("Advent of Code: %s\n", fs.readdirSync("../"));

input.forEach((line : string) => {
    console.log(line);
});