/* eslint-disable unicorn/prevent-abbreviations */
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {readInput} from '../../../util.js';

const directoryPath = path.dirname(fileURLToPath(import.meta.url));
const input = await readInput(directoryPath);

const treeGrid = input
	.split('\n')
	.filter(line => line !== '')
	.map(line => [...line]);

// Set initial to all trees at the edge
let visibleTrees = (treeGrid.length * 2) + ((treeGrid[0].length * 2) - 4);

function isVisibleOnLeftSide(treeHeight, xPosition, yPosition) {
	for (let x = xPosition - 1; x >= 0; x--) {
		if (treeGrid[yPosition][x] >= treeHeight) return false;
	}

	return true;
}

function isVisibleOnRightSide(treeHeight, xPosition, yPosition) {
	for (let x = xPosition + 1; x < treeGrid[yPosition].length; x++) {
		if (treeGrid[yPosition][x] >= treeHeight) return false;
	}

	return true;
}

function isVisibleOnTop(treeHeight, xPosition, yPosition) {
	for (let y = yPosition - 1; y >= 0; y--) {
		if (treeGrid[y][xPosition] >= treeHeight) return false;
	}

	return true;
}

function isVisibleOnBottom(treeHeight, xPosition, yPosition) {
	for (let y = yPosition + 1; y < treeGrid.length; y++) {
		if (treeGrid[y][xPosition] >= treeHeight) return false;
	}

	return true;
}

for (let i = 1; i < treeGrid.length - 1; i++) {
	for (let j = 1; j < treeGrid[i].length - 1; j++) {
		const currentTree = Number(treeGrid[i][j]);
		const isCurrentTreeVisible = isVisibleOnLeftSide(currentTree, j, i)
			|| isVisibleOnRightSide(currentTree, j, i)
			|| isVisibleOnTop(currentTree, j, i)
			|| isVisibleOnBottom(currentTree, j, i);

		if (isCurrentTreeVisible) visibleTrees++;
	}
}

console.log('Visible trees:', visibleTrees);

function findLeftScenicScore(treeHeight, xPosition, yPosition) {
	let viewableTrees = 0;

	for (let x = xPosition - 1; x >= 0; x--) {
		viewableTrees++;

		if (treeGrid[yPosition][x] >= treeHeight) break;
	}

	return viewableTrees;
}

function findRightScenicScore(treeHeight, xPosition, yPosition) {
	let viewableTrees = 0;

	for (let x = xPosition + 1; x < treeGrid[yPosition].length; x++) {
		viewableTrees++;

		if (treeGrid[yPosition][x] >= treeHeight) break;
	}

	return viewableTrees;
}

function findTopScenicScore(treeHeight, xPosition, yPosition) {
	let viewableTrees = 0;

	for (let y = yPosition - 1; y >= 0; y--) {
		viewableTrees++;

		if (treeGrid[y][xPosition] >= treeHeight) break;
	}

	return viewableTrees;
}

function findBottomScenicScore(treeHeight, xPosition, yPosition) {
	let viewableTrees = 0;

	for (let y = yPosition + 1; y < treeGrid.length; y++) {
		viewableTrees++;

		if (treeGrid[y][xPosition] >= treeHeight) break;
	}

	return viewableTrees;
}

const scenicScores = [];

for (let i = 1; i < treeGrid.length - 1; i++) {
	for (let j = 1; j < treeGrid[i].length - 1; j++) {
		const currentTree = Number(treeGrid[i][j]);

		const scenicScore = findLeftScenicScore(currentTree, j, i)
			* findRightScenicScore(currentTree, j, i)
			* findTopScenicScore(currentTree, j, i)
			* findBottomScenicScore(currentTree, j, i);

		scenicScores.push({currentTree, scenicScore});
	}
}

const sortedScenicScores = scenicScores.sort((a, b) => b.scenicScore - a.scenicScore);
console.log('Highest scenic score:', sortedScenicScores[0]);
