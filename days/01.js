import {open} from 'node:fs/promises';

const file = await open('./days/01_input.txt');
const elfCalories = [];
let currentElfCalories = 0;

for await (const line of file.readLines()) {
	if (line === '') {
		elfCalories.push(currentElfCalories);
		currentElfCalories = 0;
	} else {
		currentElfCalories += Number.parseInt(line, 10);
	}
}

const sortedCalories = elfCalories.sort((a, b) => b - a);
const mostCarryingCalories = sortedCalories[0];
console.log('Most carrying calories:', mostCarryingCalories);

const sumTopThreeCarries = sortedCalories.slice(0, 3).reduce((previous, current) => previous + current, 0);
console.log('Sum top three elves:', sumTopThreeCarries);
