import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {readInput} from '../../../util.js';

const directoryPath = path.dirname(fileURLToPath(import.meta.url));
const input = await readInput(directoryPath);

const movements = input
	.trim()
	.split('\n')
	.map(line => line.split(' '));

const head = {x: 0, y: 0};
let tails = [{x: 0, y: 0}];
let tailVisitedPositions = [new Set()];

function updateTailPositionIfNeeded() {
	for (const [index, tail] of Object.entries(tails)) {
		const currentHead = Number(index) === 0 ? head : tails[index - 1];

		// If two steps directly in one direction
		if (tail.x === currentHead.x) {
			if (tail.y === currentHead.y + 2) {
				tail.y--;
			} else if (tail.y === currentHead.y - 2) {
				tail.y++;
			}
		} else if (tail.y === currentHead.y) {
			if (tail.x === currentHead.x + 2) {
				tail.x--;
			} else if (tail.x === currentHead.x - 2) {
				tail.x++;
			}
		}

		// If two steps in one direction and one in another
		if (tail.x === currentHead.x - 1) {
			if (tail.y === currentHead.y - 2) {
				tail.x++;
				tail.y++;
			} else if (tail.y === currentHead.y + 2) {
				tail.x++;
				tail.y--;
			}
		} else if (tail.x === currentHead.x + 1) {
			if (tail.y === currentHead.y - 2) {
				tail.x--;
				tail.y++;
			} else if (tail.y === currentHead.y + 2) {
				tail.x--;
				tail.y--;
			}
		} else if (tail.y === currentHead.y - 1) {
			if (tail.x === currentHead.x - 2) {
				tail.x++;
				tail.y++;
			} else if (tail.x === currentHead.x + 2) {
				tail.x--;
				tail.y++;
			}
		} else if (tail.y === currentHead.y + 1) {
			if (tail.x === currentHead.x - 2) {
				tail.x++;
				tail.y--;
			} else if (tail.x === currentHead.x + 2) {
				tail.x--;
				tail.y--;
			}
		}

		// If two steps away in both directions
		if (tail.x === currentHead.x + 2) {
			if (tail.y === currentHead.y + 2) {
				tail.x--;
				tail.y--;
			} else if (tail.y === currentHead.y - 2) {
				tail.x--;
				tail.y++;
			}
		} else if (tail.x === currentHead.x - 2) {
			if (tail.y === currentHead.y + 2) {
				tail.x++;
				tail.y--;
			} else if (tail.y === currentHead.y - 2) {
				tail.x++;
				tail.y++;
			}
		}

		tailVisitedPositions[index].add(`${tail.x},${tail.y}`);
	}
}

function simulateMovements() {
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
		}
	}
}

simulateMovements();

console.log(
	'Distinct positions tail visited:',
	tailVisitedPositions.at(-1).size,
);

// Reset tails and visited positions
head.x = 0;
head.y = 0;
tails = [];
tailVisitedPositions = [];

// Add 9 tails
for (let index = 0; index < 9; index++) {
	tails.push({x: 0, y: 0});
	tailVisitedPositions.push(new Set());
}

simulateMovements();

console.log(
	'Distinct positions tail #9 visited:',
	tailVisitedPositions.at(-1).size,
);
