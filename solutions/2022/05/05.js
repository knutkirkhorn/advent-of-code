/* eslint-disable unicorn/prevent-abbreviations */
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {readInput} from '../../../util.js';

const directoryPath = path.dirname(fileURLToPath(import.meta.url));
const fileContent = await readInput(directoryPath);

const [stacks, rearrangements] = fileContent
	.split('\n\n')
	.map(part => part.split('\n').filter(line => line !== ''));

const arrangedStacks = {};

stacks.reverse();

for (const stack of stacks.slice(1)) {
	for (let counter = 1, i = 1; i < stack.length; i += 4, counter++) {
		if (stack[i] === ' ') continue;

		// Create array if not set already
		if (arrangedStacks[counter] === undefined) arrangedStacks[counter] = [];

		arrangedStacks[counter].push(stack[i]);
	}
}

for (const rearrangement of rearrangements) {
	const amount = Number(rearrangement.split('move ')[1].split(' ')[0]);
	const from = rearrangement.split('from ')[1].split(' ')[0];
	const to = rearrangement.split('to ')[1].split(' ')[0];

	for (let i = 0; i < amount; i++) {
		const element = arrangedStacks[from].pop();
		arrangedStacks[to].push(element);
	}
}

const rearrangedTopCrates = Object.values(arrangedStacks)
	.map(stack => stack.at(-1))
	.join('');
console.log('Rearranged top crates:', rearrangedTopCrates);

const multipleArrangedStacks = {};

for (const stack of stacks.slice(1)) {
	for (let counter = 1, i = 1; i < stack.length; i += 4, counter++) {
		if (stack[i] === ' ') continue;

		// Create array if not set already
		if (multipleArrangedStacks[counter] === undefined)
			multipleArrangedStacks[counter] = [];

		multipleArrangedStacks[counter].push(stack[i]);
	}
}

for (const rearrangement of rearrangements) {
	const amount = Number(rearrangement.split('move ')[1].split(' ')[0]);
	const from = rearrangement.split('from ')[1].split(' ')[0];
	const to = rearrangement.split('to ')[1].split(' ')[0];

	const movingElements = multipleArrangedStacks[from].slice(
		multipleArrangedStacks[from].length - amount,
	);
	multipleArrangedStacks[to].push(...movingElements);
	multipleArrangedStacks[from].splice(
		multipleArrangedStacks[from].length - amount,
	);
}

const multipleRearrangedTopCrates = Object.values(multipleArrangedStacks)
	.map(stack => stack.at(-1))
	.join('');
console.log('Multiple rearranged top crates:', multipleRearrangedTopCrates);
