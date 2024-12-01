import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {readInput, sum} from '../../../util.js';

const directoryPath = path.dirname(fileURLToPath(import.meta.url));
const input = await readInput(directoryPath);

const lines = input.trim().split('\n');
const listOne = [];
const listTwo = [];

// Add numbers to each list
for (const line of lines) {
	const lineNumbers = line.split('   ');
	listOne.push(Number(lineNumbers[0]));
	listTwo.push(Number(lineNumbers[1]));
}

// Sort the lists
listOne.sort((a, b) => a - b);
listTwo.sort((a, b) => a - b);

// Find differences between each index in lists
const differences = [];
// eslint-disable-next-line unicorn/no-for-loop
for (let index = 0; index < listOne.length; index++) {
	const difference = Math.abs(listOne[index] - listTwo[index]);
	differences.push(difference);
}

// Find the sum of the differences
const sumDifferences = sum(differences);
console.log('Sum differences:', sumDifferences);

// Find the occurrences of each number in the right list from the left one
let similarityScore = 0;

// eslint-disable-next-line unicorn/no-for-loop
for (let index = 0; index < listOne.length; index++) {
	const number = listOne[index];
	const count = listTwo.filter(value => value === number).length;
	similarityScore += number * count;
}

console.log('Similarity score:', similarityScore);
