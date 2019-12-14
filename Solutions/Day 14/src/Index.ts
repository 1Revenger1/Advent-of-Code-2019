import * as fs from 'fs';
import * as chalk from 'chalk';
import { IntCodeinnator, Storage } from './IntCodeinnator';

(async () => {

const day : number = 14;

console.log("+------------------------------+");
console.log("|  " + chalk.blueBright("Advent of Code 2019:") + chalk.green(" Day", day) + "  |");
console.log("+------------------------------+\n");

// Get file and split it into lines
let file : string[] = fs.readFileSync("./input.txt", {
    encoding: "utf8",
}).split("\n");

interface Ingredient {
    type: string,
    amount: number
}

interface Recipe {
    ingredients: Ingredient[],
    result: Ingredient
}

// Timing start
let startTime : number = new Date().getTime();

// Get recipes
let recipiesArr : Recipe[] = file.map(value => {
    let ingrediantObj : Ingredient[] = [];
    let parts = value.split("=>").map(value => value.trim());
    let ingredients = parts[0].split(",").map(value => value.trim());

    ingredients.forEach(value => {
        let parts = value.split(" ");
        ingrediantObj.push({
            type: parts[1].trim(),
            amount: parseInt(parts[0])
        });
    });

    let resultArr = parts[1].split(" ");

    return {
        ingredients: ingrediantObj,
        result: {
            type: resultArr[1],
            amount: parseInt(resultArr[0])
        }
    }

});

let recipies = {};
recipiesArr.forEach(value => {
    recipies[value.result.type] = value;
});

let bank = {"ORE": 0};

function reaction(currentStep : Recipe, neededAmount : number) : number {
    let reactionTimes = Math.ceil(neededAmount / currentStep.result.amount);

    if(currentStep.ingredients[0].type == "ORE") {
        bank[currentStep.result.type] += currentStep.result.amount * reactionTimes;
        return currentStep.ingredients[0].amount * reactionTimes;
    } else {
        let totalOre = 0;    
        currentStep.ingredients.forEach((ingred) => {
            if(bank[ingred.type] == null) bank[ingred.type] = 0;
            if(ingred.amount * reactionTimes > bank[ingred.type])
                totalOre += reaction(recipies[ingred.type], ingred.amount * reactionTimes - bank[ingred.type]);
            bank[ingred.type] -= ingred.amount * reactionTimes;
        });
        bank[currentStep.result.type] += currentStep.result.amount * reactionTimes;
        return totalOre;
    }
}

console.log(reaction(recipies["FUEL"], 1));


// Timing end
let part1End : number = new Date().getTime();

// Part 1 done
console.log(chalk.yellow("Part 1 done in: ") + chalk.red(part1End - startTime + " ms")
    + chalk.green(" Executing Part 2..."));

// Timing of Part 2 start
let startPart2Time : number = new Date().getTime();

let high = 2000000;
let low = 0;
while(low < high) {
    let mid = Math.round((high + low) / 2)
    bank = {"ORE": 0};
    if(reaction(recipies["FUEL"], mid) < 1000000000000) low = mid + 1;
    else high = mid - 1;
}
console.log(low);

// Timing end
let part2End : number = new Date().getTime();

// Part 2 done
console.log(chalk.yellow("Part 2 done in: ") + chalk.red(part2End - startPart2Time + " ms")
    + chalk.green(" Done executing...\n"));
console.log(chalk.blueBright("Total execution time of: ") + chalk.red(part2End - startTime + " ms"));
process.exit(0);
})();