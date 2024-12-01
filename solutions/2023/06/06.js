import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {matchNumbers, readInput} from '../../../util.js';

const directoryPath = path.dirname(fileURLToPath(import.meta.url));
const input = await readInput(directoryPath);

const lines = input.trim().split('\n');
const races = [];
const [times, distances] = lines.map(line => matchNumbers(line.split(':')[1]));

for (const [index, time] of times.entries()) {
	races.push({
		time,
		distance: distances[index],
	});
}

function findPossibleWinWaysForRace(race) {
	let possibleWinWays = 0;

	for (let milliseconds = 1; milliseconds < race.time; milliseconds++) {
		const timeToMove = race.time - milliseconds;
		const traveledDistance = timeToMove * milliseconds;
		if (traveledDistance > race.distance) {
			possibleWinWays++;
		}
	}

	return possibleWinWays;
}

let numberOfDifferentWinWays = 1;

for (const race of races) {
	const possibleWinWays = findPossibleWinWaysForRace(race);
	numberOfDifferentWinWays *= possibleWinWays;
}

console.log('Number of ways to win:', numberOfDifferentWinWays);

const combinedRace = lines
	.map(line => line.split(':')[1].replaceAll(' ', ''))
	.map(Number);
const combinedPossibleWinWays = findPossibleWinWaysForRace({
	time: combinedRace[0],
	distance: combinedRace[1],
});

console.log(
	'Different win ways with combined numbers:',
	combinedPossibleWinWays,
);
