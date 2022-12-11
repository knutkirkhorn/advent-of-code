import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {readInput} from '../../util.js';

const directoryPath = path.dirname(fileURLToPath(import.meta.url));
const input = await readInput(directoryPath);

const movements = input
	.trim()
	.split('\n')
	.map(line => line.split(' '));

const head = {x: 0, y: 0};
const tail = {x: 0, y: 0};
const tailVisitedPositions = new Set();

function updateTailPositionIfNeeded() {
	// If two steps directly in one direction
	if (tail.x === head.x) {
		if (tail.y === head.y + 2) {
			tail.y--;
		} else if (tail.y === head.y - 2) {
			tail.y++;
		}
	} else if (tail.y === head.y) {
		if (tail.x === head.x + 2) {
			tail.x--;
		} else if (tail.x === head.x - 2) {
			tail.x++;
		}
	}

	// If two steps in one direction and one in another
	if (tail.x === head.x - 1) {
		if (tail.y === head.y - 2) {
			tail.x++;
			tail.y++;
		} else if (tail.y === head.y + 2) {
			tail.x++;
			tail.y--;
		}
	} else if (tail.x === head.x + 1) {
		if (tail.y === head.y - 2) {
			tail.x--;
			tail.y++;
		} else if (tail.y === head.y + 2) {
			tail.x--;
			tail.y--;
		}
	} else if (tail.y === head.y - 1) {
		if (tail.x === head.x - 2) {
			tail.x++;
			tail.y++;
		} else if (tail.x === head.x + 2) {
			tail.x--;
			tail.y++;
		}
	} else if (tail.y === head.y + 1) {
		if (tail.x === head.x - 2) {
			tail.x++;
			tail.y--;
		} else if (tail.x === head.x + 2) {
			tail.x--;
			tail.y--;
		}
	}
}

for (const movement of movements) {
	const [direction] = movement;
	const distance = Number(movement[1]);

	for (let index = 0; index < distance; index++) {
		// Move head
		if (direction === 'R') head.x++;
		if (direction === 'U') head.y++;
		if (direction === 'L') head.x--;
		if (direction === 'D') head.y--;

		updateTailPositionIfNeeded();

		tailVisitedPositions.add(`${tail.x},${tail.y}`);
	}
}

console.log('Distinct positions tail visited:', tailVisitedPositions.size);
