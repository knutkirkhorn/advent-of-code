import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {readInput, sum} from '../../util.js';

const directoryPath = path.dirname(fileURLToPath(import.meta.url));
const fileContent = await readInput(directoryPath);

const shapeBonus = {
	X: 1, // Rock
	Y: 2, // Paper
	Z: 3, // Scissors
};

const opponentIndexes = {
	A: 0, // Rock
	B: 1, // Paper
	C: 2, // Scissors
};

const myIndexes = {
	X: 0, // Rock
	Y: 1, // Paper
	Z: 2, // Scissors
};

const scoreDifferences = {
	0: 3, // Draw
	1: 6, // Won
	2: 0, // Lost
};

function modulo(number1, number2) {
	return ((number1 % number2) + number2) % number2;
}

function calculateScoreRoundOne(round) {
	const [opponentChoice, myChoice] = round.split(' ');
	const roundDifference = myIndexes[myChoice] - opponentIndexes[opponentChoice];
	const outcomeScore = scoreDifferences[modulo(roundDifference, 3)];
	const shapeScore = shapeBonus[myChoice];
	return outcomeScore + shapeScore;
}

const scoreOne = sum(fileContent.split('\n')
	.filter(line => line !== '')
	.map(round => calculateScoreRoundOne(round)));
console.log('Score round 1:', scoreOne);

const outcomeDifference = {
	X: -1, // Lose
	Y: 0, // Draw
	Z: 1, // Win
};

const myIndexesReversed = {
	0: 'X',
	1: 'Y',
	2: 'Z',
};

function calculateScoreRoundTwo(round) {
	const [opponentChoice, outcome] = round.split(' ');
	const myChoice = opponentIndexes[opponentChoice] + outcomeDifference[outcome];
	const roundDifference = myChoice - opponentIndexes[opponentChoice];
	const outcomeScore = scoreDifferences[modulo(roundDifference, 3)];
	const shapeScore = shapeBonus[myIndexesReversed[modulo(myChoice, 3)]];
	return outcomeScore + shapeScore;
}

const scoreTwo = sum(fileContent.split('\n')
	.filter(line => line !== '')
	.map(round => calculateScoreRoundTwo(round)));
console.log('Score round 2:', scoreTwo);
