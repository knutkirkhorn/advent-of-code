import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {matchNumbers, readInput} from '../../../util.js';

const directoryPath = path.dirname(fileURLToPath(import.meta.url));
const input = await readInput(directoryPath);

const seedMap = input.trim().split('\n\n');
const initialSeeds = matchNumbers(seedMap[0]);

function convertInputToMap(seedMapInput) {
	return seedMapInput
		.split(':\n')[1]
		.split('\n')
		.map(line => {
			const numbers = matchNumbers(line);
			return {
				destinationRangeStart: numbers[0],
				sourceRangeStart: numbers[1],
				rangeLength: numbers[2],
			};
		});
}

const seedMaps = seedMap
	.slice(1, seedMap.length)
	.map(currentSeedMap => convertInputToMap(currentSeedMap));

function findSeedLocationNumber(seed) {
	let currentPosition = seed;

	for (const currentSeedMap of seedMaps) {
		let destination;

		for (const mapLine of currentSeedMap) {
			if (
				mapLine.sourceRangeStart <= currentPosition &&
				currentPosition <= mapLine.sourceRangeStart + mapLine.rangeLength
			) {
				destination =
					mapLine.destinationRangeStart +
					(currentPosition - mapLine.sourceRangeStart);
				break;
			}
		}

		if (destination) {
			currentPosition = destination;
		}
	}

	return currentPosition;
}

function findLowestSeedLocationNumber(seeds) {
	let lowestLocationNumber;

	for (const seed of seeds) {
		const currentPosition = findSeedLocationNumber(seed);

		if (!lowestLocationNumber) {
			lowestLocationNumber = currentPosition;
		}

		if (currentPosition < lowestLocationNumber) {
			lowestLocationNumber = currentPosition;
		}
	}

	return lowestLocationNumber;
}

const lowestInitialSeedsLocationNumber =
	findLowestSeedLocationNumber(initialSeeds);
console.log(
	'Lowest location number for initial seeds:',
	lowestInitialSeedsLocationNumber,
);
