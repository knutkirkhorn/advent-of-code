import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {readInput} from '../../../util.js';

const directoryPath = path.dirname(fileURLToPath(import.meta.url));
const input = await readInput(directoryPath);

const stuff = input
	.trim()
	.split('\n\n')
	.map(part => part.split('\n'));

console.log('stuff', stuff);
