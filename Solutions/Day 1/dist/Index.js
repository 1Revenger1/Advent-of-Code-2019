"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
let file = fs.readFileSync("./input.txt", {
    encoding: "utf8",
});
let input = file.split("\n");
console.log("Advent of Code: %s\n", fs.readdirSync("../"));
let sum = 0;
input.forEach((line) => {
    let num = parseInt(line);
    sum += Math.floor(num / 3.0) - 2;
});
console.log("Part 1 Answer: %d", sum);
function recursiveTotal(num) {
    let fuel = Math.floor(num / 3.0) - 2;
    if (fuel <= 0)
        return 0;
    else {
        return fuel + recursiveTotal(fuel);
    }
}
sum = 0;
input.forEach((line) => {
    let num = parseInt(line);
    sum += recursiveTotal(num);
});
console.log("Part 2 Answer: %d", sum);
//# sourceMappingURL=Index.js.map