import path from 'node:path';
import {fileURLToPath} from 'node:url';
import gcd from '@knutkirkhorn/gcd';
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

const startingOnANodes = Object.keys(nodes).filter(node => node.endsWith('A'));
steps = 0;
const endingWithZSteps = [];

for (const node of startingOnANodes) {
	let currentSteps = 0;
	let currentStartingOnANode = node;

	while (!currentStartingOnANode.endsWith('Z')) {
		for (const direction of directions) {
			currentStartingOnANode = direction === 'R'
				? nodes[currentStartingOnANode].right
				: nodes[currentStartingOnANode].left;
			currentSteps++;
			if (currentStartingOnANode.endsWith('Z')) {
				break;
			}
		}
	}

	endingWithZSteps.push(currentSteps);
}

const sortedEndingWithZSteps = endingWithZSteps.sort((a, b) => a - b);

function leastCommonMultiple(a, b) {
	return (a * b) / gcd(a, b);
}

// eslint-disable-next-line unicorn/no-array-reduce
steps = sortedEndingWithZSteps.reduce((a, b) => leastCommonMultiple(a, b), sortedEndingWithZSteps[0]);
console.log('Steps required for all nodes to end on Z:', steps);
