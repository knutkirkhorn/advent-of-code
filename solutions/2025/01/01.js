import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {readInput} from '../../../util.js';

const directoryPath = path.dirname(fileURLToPath(import.meta.url));
const input = await readInput(directoryPath);

const lines = input
	.trim()
	.split('\n')
	.map(line => [line.slice(0, 1), Number(line.slice(1))]);

let dialNumber = 50;
let zeroDialPoints = 0;

// Find number of times the dial points at zero
for (const [direction, amount] of lines) {
	if (direction === 'L') {
		dialNumber = (dialNumber - amount) % 100;
	} else if (direction === 'R') {
		dialNumber = (dialNumber + amount) % 100;
	}

	if (dialNumber === 0) zeroDialPoints++;
}

console.log('Zero dial points:', zeroDialPoints);
