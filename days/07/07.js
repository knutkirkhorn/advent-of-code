/* eslint-disable no-param-reassign */
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {readInput, sum} from '../../util.js';

const directoryPath = path.dirname(fileURLToPath(import.meta.url));
const input = await readInput(directoryPath);

const lines = input
	.split('\n')
	.filter(line => line !== '');

function updateDeep(currentObject, line, currentDirectoryPath) {
	if (currentDirectoryPath.length === 1) {
		if (line.startsWith('dir ')) {
			const directory = line.split('dir ')[1];
			currentObject[currentDirectoryPath[0]][directory] = {};
			return;
		}

		const [fileSize, fileName] = line.split(' ');
		currentObject[currentDirectoryPath[0]][fileName] = Number(fileSize);
		return;
	}

	const nextPath = currentDirectoryPath.slice(1, currentDirectoryPath.length);
	updateDeep(currentObject[currentDirectoryPath[0]], line, nextPath);
}

const fileSystem = {'/': {}};
const currentDirectory = [];

// Create file system hierarchy
for (const line of lines) {
	if (line.startsWith('$ cd ')) {
		const directory = line.split('$ cd ')[1];

		if (directory === '..') {
			currentDirectory.pop();
		} else {
			currentDirectory.push(directory);
		}
		continue;
	}

	if (line.startsWith('$')) continue;

	if (line.startsWith('dir ')) {
		updateDeep(fileSystem, line, currentDirectory);
		continue;
	}

	updateDeep(fileSystem, line, currentDirectory);
}

const directoriesWithSummedSizes = [];
const directoriesMost100k = [];

function sumDirectory(directory, parent) {
	let directorySize = 0;
	const children = Object.values(directory);

	for (const [index, child] of children.entries()) {
		if (typeof child === 'object') {
			directorySize += sumDirectory(child, Object.keys(directory)[index]);
		} else if (typeof child === 'number') {
			directorySize += child;
		}
	}

	if (directorySize <= 100_000) {
		directoriesMost100k.push({name: parent, size: directorySize});
	}

	directoriesWithSummedSizes.push({name: parent, size: directorySize});

	return directorySize;
}

const usedSpace = sumDirectory(fileSystem['/'], '/');
console.log('Sum of directories below 100k size:', sum(directoriesMost100k.map(directory => directory.size)));

const totalSpace = 70_000_000;
const minimumAvailableSpace = 30_000_000;
const availableSpace = totalSpace - usedSpace;
const neededSpace = minimumAvailableSpace - availableSpace;
const sortedSummedDirectories = directoriesWithSummedSizes.sort((a, b) => b.size - a.size);

// Smallest directory with needed space
const directoryToDelete = sortedSummedDirectories.reverse().find(directory => directory.size >= neededSpace);
console.log('Directory to delete:', directoryToDelete);
