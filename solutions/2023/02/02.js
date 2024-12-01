import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {readInput, sum} from '../../../util.js';

const directoryPath = path.dirname(fileURLToPath(import.meta.url));
const input = await readInput(directoryPath);

const gameRegex = /Game (\d+): (.+)/;
const games = input
	.trim()
	.split('\n')
	.map(line => {
		const regexMatch = line.match(gameRegex);
		const gameId = Number(regexMatch[1]);
		const gameCubeSets = regexMatch[2].split(';').map(set => {
			const splittedSet = set.split(',');
			const cubes = splittedSet.map(cube => {
				const splittedCube = cube.trim().split(' ');
				return {[splittedCube[1]]: Number(splittedCube[0])};
			});
			const combinedCubes = {};

			for (const cube of cubes) {
				const color = Object.keys(cube)[0];
				const number = cube[color];
				combinedCubes[color] = number;
			}
			return combinedCubes;
		});
		return {
			gameId,
			gameCubeSets,
		};
	});

const maxCubeCheck = {
	red: 12,
	green: 13,
	blue: 14,
};
const possibleGameIds = [];

for (const game of games) {
	let gameIsImpossible = false;

	for (const gameCubeSet of game.gameCubeSets) {
		for (const color of Object.keys(gameCubeSet)) {
			if (gameCubeSet[color] > maxCubeCheck[color]) {
				gameIsImpossible = true;
				break;
			}
		}

		if (gameIsImpossible) break;
	}

	if (gameIsImpossible) continue;
	possibleGameIds.push(game.gameId);
}

const sumPossibleGamesIds = sum(possibleGameIds);
console.log('Sum possible game IDs:', sumPossibleGamesIds);

let sumFewestPossibleCubes = 0;

for (const game of games) {
	const currentFewestPossibleCubes = {};

	for (const gameCubeSet of game.gameCubeSets) {
		for (const color of Object.keys(gameCubeSet)) {
			currentFewestPossibleCubes[color] = currentFewestPossibleCubes[color]
				? Math.max(currentFewestPossibleCubes[color], gameCubeSet[color])
				: gameCubeSet[color];
		}
	}

	const powerOfCubes = Object.values(currentFewestPossibleCubes).reduce(
		(accumulator, current) => accumulator * current,
		1,
	);
	sumFewestPossibleCubes += powerOfCubes;
}

console.log(
	'The sum of fewest possible cubes for each game:',
	sumFewestPossibleCubes,
);
