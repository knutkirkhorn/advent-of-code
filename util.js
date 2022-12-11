import path from 'node:path';
import {promises as fs} from 'node:fs';

export const sum = array => array.reduce((previous, current) => previous + current, 0);

export async function readInput(directoryPath) {
	const inputPath = path.join(directoryPath, 'input.txt');
	const input = await fs.readFile(inputPath, 'utf8');
	return input;
}
