import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {readInput, sum} from '../../util.js';

const directoryPath = path.dirname(fileURLToPath(import.meta.url));
const input = await readInput(directoryPath);

const programInstructions = input
	.trim()
	.split('\n')
	.map(line => line.split(' '));

let cycleCount = 0;
let registerValue = 1;
const registerValues = {};

for (const programInstruction of programInstructions) {
	const [instruction] = programInstruction;
	const instructionValue = Number(programInstruction[1]);

	if (instruction === 'noop') {
		cycleCount++;
		registerValues[cycleCount] = registerValue;
	} else {
		// Instruction is "addx <value>"
		cycleCount += 2;
		registerValues[cycleCount - 1] = registerValue;
		registerValues[cycleCount] = registerValue;
		registerValue += instructionValue;
		registerValues[cycleCount + 1] = registerValue;
	}
}

// Signal strength = cycle number * value at cycle
const interestingSignalStrengths = [
	registerValues[20] * 20,
	registerValues[60] * 60,
	registerValues[100] * 100,
	registerValues[140] * 140,
	registerValues[180] * 180,
	registerValues[220] * 220,
];
const sumInterestingSignalStrengths = sum(interestingSignalStrengths);
console.log('Sum interesting signal strengths:', sumInterestingSignalStrengths);

function printCrtRow(startIndex, endIndex) {
	const crtPixels = [];
	let crtCounter = 0;

	for (let index = 1; index <= Object.entries(registerValues).slice(startIndex, endIndex).length; index++, crtCounter++) {
		const currentRegisterValue = registerValues[index + startIndex];

		// Check if CRT counter is inside the sprite
		if (currentRegisterValue <= crtCounter + 1 && currentRegisterValue >= crtCounter - 1) {
			crtPixels.push('#');
		} else {
			crtPixels.push('.');
		}
	}

	return crtPixels.join('');
}

console.log('CRT output:');

for (let index = 0; index < Object.entries(registerValues).length; index += 40) {
	console.log(printCrtRow(index, index + 40));
}
