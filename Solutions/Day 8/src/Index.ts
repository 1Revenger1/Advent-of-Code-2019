import * as fs from 'fs';
import * as chalk from 'chalk';
import { IntCodeinnator, Storage } from './IntCodeinnator';

(async () => {

const day : number = 0;

console.log("+------------------------------+");
console.log("|  " + chalk.blueBright("Advent of Code 2019:") + chalk.green(" Day", day) + "  |");
console.log("+------------------------------+\n");

// Get file and split it into lines
let input : number[] = fs.readFileSync("./input.txt", {
    encoding: "utf8",
}).split("").map((value, index, array) => {return parseInt(value)});

const height = 6;
const width = 25;

// Timing start
let startTime : number = new Date().getTime();

interface Layer {
    layer: number[][];
    numZeros: number;
    numOnes: number;
    numTwos: number;
}

let i = 0, j = 0;
let layers : Layer[] = [];
let layer : number[][] = [];
let numZeros = 0;
let numOnes = 0;
let numTwos = 0;
let row : number[] = [];
input.forEach((value) => {
    if(value == 0) numZeros++;
    if(value == 1) numOnes++;
    if(value == 2) numTwos++;

    row[j] = value;

    if(++j == width) {
        layer.push([...row]);
        row = [];
        i++;
        j = 0;
    }

    if(i == height) {
        layers.push({
            layer: [...layer],
            numZeros: numZeros,
            numOnes: numOnes,
            numTwos: numTwos
        });
        layer = [];
        numZeros = numOnes = numTwos = 0;
        i = 0;
        j = 0;
    }
});

let tempLayer = layers[0];
for(const layer of layers) {
    if(layer.numZeros < tempLayer.numZeros) tempLayer = layer;
}

console.log(tempLayer.numTwos * tempLayer.numOnes);

// Timing end
let part1End : number = new Date().getTime();

// Part 1 done
console.log(chalk.yellow("Part 1 done in: ") + chalk.red(part1End - startTime + " ms")
    + chalk.green(" Executing Part 2..."));

// Timing of Part 2 start
let startPart2Time : number = new Date().getTime();

let image : number[][] = Array(height).fill(Array(width).fill(2));

for(const layer of layers) {
    for(const row in layer.layer) {
        for(const pixel in layer.layer[row]) {
            if((image[row][pixel] != 1 && image[row][pixel] != 0) && layer.layer[row][pixel] != 2) image[row][pixel] = layer.layer[row][pixel]; 
        }
    }
}

for(const layer of image) {
    let buffer = "";
    for(const pixel of layer) {
        if(pixel == 0) buffer += (chalk.black(pixel));
        if(pixel == 1) buffer += (chalk.white(pixel));
        if(pixel == 2) buffer += (" ");
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