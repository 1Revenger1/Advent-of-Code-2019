"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
let file = fs.readFileSync("./input.txt", {
    encoding: "utf8",
});
let input = file.split("\n");
console.log("Advent of Code: %s\n", fs.readdirSync("../"));
input.forEach((line) => {
    console.log(line);
});
//# sourceMappingURL=Index.js.map