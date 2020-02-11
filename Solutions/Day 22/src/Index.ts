import * as fs from 'fs';
import * as chalk from 'chalk';
import { modInv, modPow } from 'bigint-crypto-utils';

(async () => {

const day : number = 0;

console.log("+------------------------------+");
console.log("|  " + chalk.blueBright("Advent of Code 2019:") + chalk.green(" Day", day) + "  |");
console.log("+------------------------------+\n");

enum OperationType {
    DealNewStack,
    Cut,
    DealIncremN,
    Null,
}

interface Operation {
    type : OperationType,
    n ?: number
};

// Get file and split it into lines
let file : Operation[] = fs.readFileSync("./input.txt", {
    encoding: "utf8",
}).split("\n").map(value => {
    let input = value.split(" ");
    if(value.includes("deal into")) {
        return {
            type : OperationType.DealNewStack,
        }
    }
    else if(value.includes("deal with")) {
        return {
            type: OperationType.DealIncremN,
            n : parseInt(input[3])
        }
    }
    else if(value.includes("cut")) {
        return {
            type: OperationType.Cut,
            n : parseInt(input[1])
        }
    }

    return {type: OperationType.Null};
});

// Timing start
let startTime : number = new Date().getTime();

let cards = new Array(10007).fill(0).map((value, index) => { return index});

while(file.length > 0) {
    let op = file.shift();
    let newArray = [];

    switch(op.type) {
        case OperationType.Cut:
            if(op.n < 0) {
                // Make this the front of the array/cards
                let array = cards.splice(cards.length + op.n, op.n * -1)
                while(cards.length > 0) array.push(cards.shift());
                cards = [...array];
            } else {
                // Save off for later to put at back of array
                let array = cards.splice(0, op.n);
                while(cards.length > 0) newArray.push(cards.shift());
                cards = newArray.concat(array);
            }
            break;
        case OperationType.DealNewStack:
            while(cards.length > 0) newArray.push(cards.pop());
            cards = [...newArray];
            break;
        case OperationType.DealIncremN:
            newArray = new Array(10007);
            let n = 0;
            while(cards.length > 0) {
                newArray[n] = cards.shift();
                n = (n + op.n) % 10007;
            }
            cards = [...newArray];
            break;
    }
}
let index2019 = 0;
cards.forEach((value, index) => { if(value == 2019) index2019 = index})
console.log(index2019);

// Timing end
let part1End : number = new Date().getTime();

// Part 1 done
console.log(chalk.yellow("Part 1 done in: ") + chalk.red(part1End - startTime + " ms")
    + chalk.green(" Executing Part 2..."));

// Timing of Part 2 start
let startPart2Time : number = new Date().getTime();
file = fs.readFileSync("./input.txt", {
    encoding: "utf8",
}).split("\n").map(value => {
    let input = value.split(" ");
    if(value.includes("deal into")) {
        return {
            type : OperationType.DealNewStack,
        }
    }
    else if(value.includes("deal with")) {
        return {
            type: OperationType.DealIncremN,
            n : parseInt(input[3])
        }
    }
    else if(value.includes("cut")) {
        return {
            type: OperationType.Cut,
            n : parseInt(input[1])
        }
    }

    return {type: OperationType.Null};
});

let incrementMul = 1n;
let offsetDiff = 0n;
let cardSizes = 119315717514047n;
let card2020 = 2020;
//let modinv = (n : bigint) => (n ** (cardSizes - 2n)) % cardSizes;

while(file.length > 0) {
    let op = file.shift();
    switch(op.type) {
        case OperationType.Cut:
            offsetDiff += incrementMul * BigInt(op.n);
            break;
        case OperationType.DealNewStack:
            incrementMul *= BigInt(-1);
            offsetDiff += incrementMul % cardSizes;
            break;
        case OperationType.DealIncremN:
            incrementMul *= modInv(BigInt(op.n), cardSizes);
            break;
    }
}

let increment = modPow(incrementMul, 101741582076661n, cardSizes);
let offset = offsetDiff * (1n-increment) * modInv((1n-incrementMul) % cardSizes, cardSizes);
console.log((offset + 2020n * increment) % cardSizes);

// Timing end
let part2End : number = new Date().getTime();

// Part 2 done
console.log(chalk.yellow("Part 2 done in: ") + chalk.red(part2End - startPart2Time + " ms")
    + chalk.green(" Done executing...\n"));
console.log(chalk.blueBright("Total execution time of: ") + chalk.red(part2End - startTime + " ms"));
process.exit(0);
})();