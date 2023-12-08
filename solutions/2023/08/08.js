import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {readInput} from '../../../util.js';

const directoryPath = path.dirname(fileURLToPath(import.meta.url));
const input = await readInput(directoryPath);

const lines = input
	.trim()
	.split('\n\n');
const directions = lines[0];
const mapLines = lines[1].split('\n');
const nodes = {};

for (const mapLine of mapLines) {
	const data = mapLine.split(' = ');
	const node = data[0];
	const [left, right] = data[1].replaceAll(/[()]/g, '').split(', ');
	nodes[node] = {left, right};
}

// Start at node labeled "AAA"
let currentNode = 'AAA';
let steps = 0;

while (currentNode !== 'ZZZ') {
	for (const direction of directions) {
		currentNode = direction === 'R'
			? nodes[currentNode].right
			: nodes[currentNode].left;
		steps++;
		if (currentNode === 'ZZZ') {
			break;
		}
	}
}

console.log('Steps required to reach ZZZ:', steps);
