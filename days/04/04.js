/* eslint-disable unicorn/prevent-abbreviations */
import {promises as fs} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const directoryPath = path.dirname(fileURLToPath(import.meta.url));
const inputPath = path.join(directoryPath, 'input.txt');
const fileContent = await fs.readFile(inputPath, 'utf8');
const pairs = fileContent
	.split('\n')
	.filter(line => line !== '')
	.map(pair => pair.split(',').map(sections => sections.split('-').map(Number)));
const fullyContainingAssignmentPairs = pairs.filter(pair => (
	(pair[0][0] >= pair[1][0] && pair[0][1] <= pair[1][1])
	|| (pair[0][0] <= pair[1][0] && pair[0][1] >= pair[1][1])
)).length;

console.log('Fully containing assignment pairs:', fullyContainingAssignmentPairs);

function rangeToArray(range) {
	const array = [];

	for (let i = range[0]; i <= range[1]; i++) {
		array.push(i);
	}

	return array;
}

const partlyContainingAssignmentPairs = pairs.filter(pair => {
	const firstRange = rangeToArray(pair[0]);
	const secondRange = rangeToArray(pair[1]);
	return firstRange.find(item => secondRange.includes(item)) || secondRange.find(item => firstRange.includes(item));
}).length;
console.log('Partly containing assignment pairs:', partlyContainingAssignmentPairs);
