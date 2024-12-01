import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {readInput, sum} from '../../../util.js';

const directoryPath = path.dirname(fileURLToPath(import.meta.url));
const input = await readInput(directoryPath);

const engineSchematic = input
	.trim()
	.split('\n')
	.map(line => [...line]);

function isCharacterSymbol(character) {
	if (Number.isInteger(Number(character))) return false;

	return character !== '.';
}

function isNumberAdjacentToSymbol(xPosition, yPosition) {
	// Check direct neighbors
	// Check left
	if (
		xPosition > 0 &&
		isCharacterSymbol(engineSchematic[yPosition][xPosition - 1])
	)
		return true;
	// Check right
	if (
		xPosition < engineSchematic[yPosition].length - 1 &&
		isCharacterSymbol(engineSchematic[yPosition][xPosition + 1])
	)
		return true;
	// Check above
	if (
		yPosition > 0 &&
		isCharacterSymbol(engineSchematic[yPosition - 1][xPosition])
	)
		return true;
	// Check below
	if (
		yPosition < engineSchematic.length - 1 &&
		isCharacterSymbol(engineSchematic[yPosition + 1][xPosition])
	)
		return true;

	// Check diagonally neighbors
	// Check top left
	if (
		yPosition > 0 &&
		xPosition > 0 &&
		isCharacterSymbol(engineSchematic[yPosition - 1][xPosition - 1])
	)
		return true;
	// Check top right
	if (
		yPosition > 0 &&
		xPosition < engineSchematic[yPosition].length - 1 &&
		isCharacterSymbol(engineSchematic[yPosition - 1][xPosition + 1])
	)
		return true;
	// Check bottom left
	if (
		yPosition < engineSchematic.length - 1 &&
		xPosition > 0 &&
		isCharacterSymbol(engineSchematic[yPosition + 1][xPosition - 1])
	)
		return true;
	// Check bottom right
	if (
		yPosition < engineSchematic.length - 1 &&
		xPosition < engineSchematic[yPosition].length - 1 &&
		isCharacterSymbol(engineSchematic[yPosition + 1][xPosition + 1])
	)
		return true;

	return false;
}

function isCharacterAsterisk(character) {
	if (Number.isInteger(Number(character))) return false;

	return character === '*';
}

function getAdjacentAsterisks(xPosition, yPosition) {
	const adjacentAsterisks = [];
	// Check direct neighbors
	// Check left
	if (
		xPosition > 0 &&
		isCharacterAsterisk(engineSchematic[yPosition][xPosition - 1])
	) {
		adjacentAsterisks.push({x: xPosition - 1, y: yPosition});
	}
	// Check right
	if (
		xPosition < engineSchematic[yPosition].length - 1 &&
		isCharacterAsterisk(engineSchematic[yPosition][xPosition + 1])
	) {
		adjacentAsterisks.push({x: xPosition + 1, y: yPosition});
	}
	// Check above
	if (
		yPosition > 0 &&
		isCharacterAsterisk(engineSchematic[yPosition - 1][xPosition])
	) {
		adjacentAsterisks.push({x: xPosition, y: yPosition - 1});
	}
	// Check below
	if (
		yPosition < engineSchematic.length - 1 &&
		isCharacterAsterisk(engineSchematic[yPosition + 1][xPosition])
	) {
		adjacentAsterisks.push({x: xPosition, y: yPosition + 1});
	}

	// Check diagonally neighbors
	// Check top left
	if (
		yPosition > 0 &&
		xPosition > 0 &&
		isCharacterAsterisk(engineSchematic[yPosition - 1][xPosition - 1])
	) {
		adjacentAsterisks.push({x: xPosition - 1, y: yPosition - 1});
	}
	// Check top right
	if (
		yPosition > 0 &&
		xPosition < engineSchematic[yPosition].length - 1 &&
		isCharacterAsterisk(engineSchematic[yPosition - 1][xPosition + 1])
	) {
		adjacentAsterisks.push({x: xPosition + 1, y: yPosition - 1});
	}
	// Check bottom left
	if (
		yPosition < engineSchematic.length - 1 &&
		xPosition > 0 &&
		isCharacterAsterisk(engineSchematic[yPosition + 1][xPosition - 1])
	) {
		adjacentAsterisks.push({x: xPosition - 1, y: yPosition + 1});
	}
	// Check bottom right
	if (
		yPosition < engineSchematic.length - 1 &&
		xPosition < engineSchematic[yPosition].length - 1 &&
		isCharacterAsterisk(engineSchematic[yPosition + 1][xPosition + 1])
	) {
		adjacentAsterisks.push({x: xPosition + 1, y: yPosition + 1});
	}

	return adjacentAsterisks;
}

const partNumbers = [];

for (const [yPosition, line] of engineSchematic.entries()) {
	let currentNumber;
	let isCurrentNumberAdjacentToSymbol = false;

	for (const [xPosition, character] of line.entries()) {
		if (Number.isInteger(Number(character))) {
			currentNumber = `${currentNumber || ''}${character}`;

			const isCurrentCharacterAdjacentToSymbol = isNumberAdjacentToSymbol(
				xPosition,
				yPosition,
			);
			if (isCurrentCharacterAdjacentToSymbol) {
				isCurrentNumberAdjacentToSymbol = true;
			}

			continue;
		}

		if (currentNumber) {
			if (isCurrentNumberAdjacentToSymbol) {
				partNumbers.push(Number(currentNumber));
			}
			currentNumber = undefined;
			isCurrentNumberAdjacentToSymbol = false;
		}
	}

	if (currentNumber && isCurrentNumberAdjacentToSymbol) {
		partNumbers.push(Number(currentNumber));
		currentNumber = undefined;
		isCurrentNumberAdjacentToSymbol = false;
	}
}

const sumOfPartNumbers = sum(partNumbers);
console.log('Sum of part numbers:', sumOfPartNumbers);

const gears = {};

for (const [yPosition, line] of engineSchematic.entries()) {
	let currentNumber;
	let adjacentAsterisks = [];

	for (const [xPosition, character] of line.entries()) {
		if (Number.isInteger(Number(character))) {
			currentNumber = `${currentNumber || ''}${character}`;
			const currentAdjacentAsterisks = getAdjacentAsterisks(
				xPosition,
				yPosition,
			);
			adjacentAsterisks.push(...currentAdjacentAsterisks);
			continue;
		}

		if (currentNumber) {
			for (const adjacentAsterisk of adjacentAsterisks) {
				const index = `${adjacentAsterisk.x}-${adjacentAsterisk.y}`;
				gears[index] = gears[index] || new Set();
				gears[index].add(Number(currentNumber));
			}
			currentNumber = undefined;
			adjacentAsterisks = [];
		}
	}

	if (currentNumber) {
		for (const adjacentAsterisk of adjacentAsterisks) {
			const index = `${adjacentAsterisk.x}-${adjacentAsterisk.y}`;
			gears[index] = gears[index] || new Set();
			gears[index].add(Number(currentNumber));
		}
		currentNumber = undefined;
		adjacentAsterisks = [];
	}
}

const gearRatios = Object.values(gears)
	.filter(gear => gear.size === 2)
	.map(gear => [...gear])
	.map(gear => gear[0] * gear[1]);
const sumGearRatios = sum(gearRatios);
console.log('Sum gear ratios:', sumGearRatios);
