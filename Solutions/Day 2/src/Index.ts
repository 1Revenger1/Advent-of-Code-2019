import * as fs from 'fs';
import * as chalk from 'chalk';

const day : number = 2;

console.log("+------------------------------+");
console.log("|  " + chalk.blueBright("Advent of Code 2019:") + chalk.green(" Day", day) + "  |");
console.log("+------------------------------+\n");

// Get file and split it into lines
let input : string = fs.readFileSync("./input.txt", {
    encoding: "utf8",
});

// Timing start
let startTime : number = new Date().getTime();

let strings : string[] = input.split(",");
let nums : number[] = [];

for(let i = 0; i < strings.length; i++) {
    nums[i] = parseInt(strings[i]);
}

let i : number = 0;

nums[1] = 12;
nums[2] = 2;

while(nums[i] != 99) {
    if(nums[i] == 1) {
        nums[nums[i + 3]] = (nums[nums[i + 1]] + nums[nums[i + 2]]);
    } else if(nums[i] == 2) {
        nums[nums[i + 3]] = (nums[nums[i + 1]] * nums[nums[i + 2]]);
    } else console.error("ERROR");

    i += 4;
}

console.log(nums[0]);

// Timing end
let part1End : number = new Date().getTime();

// Part 1 done
console.log(chalk.yellow("Part 1 done in: ") + chalk.red(part1End - startTime + " ms")
    + chalk.green(" Executing Part 2..."));

// Timing of Part 2 start
let startPart2Time : number = new Date().getTime();


for(let j = 0; j < 100; j++) {
    for(let k = 0; k < 100; k++) {
        // Reset
        for(let i = 0; i < strings.length; i++) {
            nums[i] = parseInt(strings[i]);
        }
        i = 0;

        nums[1] = j;
        nums[2] = k;

        while(nums[i] != 99) {
            if(nums[i] == 1) {
                nums[nums[i + 3]] = (nums[nums[i + 1]] + nums[nums[i + 2]]);
            } else if(nums[i] == 2) {
                nums[nums[i + 3]] = (nums[nums[i + 1]] * nums[nums[i + 2]]);
            } else console.error("ERROR");

            i += 4;
        }
        
        if(nums[0] == 19690720) {
            console.log("%d %d", j, k);
            break;
        }
    }
}


// Timing end
let part2End : number = new Date().getTime();

// Part 2 done
console.log(chalk.yellow("Part 2 done in: ") + chalk.red(part2End - startPart2Time + " ms")
    + chalk.green(" Done executing...\n"));
console.log(chalk.blueBright("Total execution time of: ") + chalk.red(part2End - startTime + " ms"));