import {promises as fs} from 'node:fs';
import path from 'node:path';

export const sum = array =>
	array.reduce((previous, current) => previous + current, 0);

export async function readInput(directoryPath) {
	const inputPath = path.join(directoryPath, 'input.txt');
	const input = await fs.readFile(inputPath, 'utf8');
	return input;
}

export function matchNumbers(input) {
	const numberRegex = /\d+/g;
	const matches = input.match(numberRegex);
	return matches.map(Number);
}
