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
	if (xPosition > 0 && isCharacterSymbol(engineSchematic[yPosition][xPosition - 1])) return true;
	// Check right
	if (xPosition < engineSchematic[yPosition].length - 1 && isCharacterSymbol(engineSchematic[yPosition][xPosition + 1])) return true;
	// Check above
	if (yPosition > 0 && isCharacterSymbol(engineSchematic[yPosition - 1][xPosition])) return true;
	// Check below
	if (yPosition < engineSchematic.length - 1 && isCharacterSymbol(engineSchematic[yPosition + 1][xPosition])) return true;

	// Check diagonally neighbors
	// Check top left
	if (yPosition > 0 && xPosition > 0 && isCharacterSymbol(engineSchematic[yPosition - 1][xPosition - 1])) return true;
	// Check top right
	if (yPosition > 0 && xPosition < engineSchematic[yPosition].length - 1 && isCharacterSymbol(engineSchematic[yPosition - 1][xPosition + 1])) return true;
	// Check bottom left
	if (yPosition < engineSchematic.length - 1 && xPosition > 0 && isCharacterSymbol(engineSchematic[yPosition + 1][xPosition - 1])) return true;
	// Check bottom right
	if (yPosition < engineSchematic.length - 1 && xPosition < engineSchematic[yPosition].length - 1 && isCharacterSymbol(engineSchematic[yPosition + 1][xPosition + 1])) return true;

	return false;
}

const partNumbers = [];

for (const [yPosition, line] of engineSchematic.entries()) {
	let currentNumber;
	let isCurrentNumberAdjacentToSymbol = false;

	for (const [xPosition, character] of line.entries()) {
		if (Number.isInteger(Number(character))) {
			currentNumber = `${currentNumber || ''}${character}`;

			const isCurrentCharacterAdjacentToSymbol = isNumberAdjacentToSymbol(xPosition, yPosition);
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
