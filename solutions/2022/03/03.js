/* eslint-disable unicorn/prefer-spread */
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {readInput, sum} from '../../../util.js';

const directoryPath = path.dirname(fileURLToPath(import.meta.url));
const fileContent = await readInput(directoryPath);
const rucksackContents = fileContent.split('\n').filter(line => line !== '');

function convertCharToPriority(char) {
	return char.codePointAt(0) >= 97
		? char.codePointAt(0) - 96 // a -> z
		: char.codePointAt(0) - 38; // A -> Z
}

const priorities = rucksackContents.map(rucksackContent => {
	const firstHalf = rucksackContent.slice(0, rucksackContent.length / 2).split('');
	const secondHalf = rucksackContent.slice(rucksackContent.length / 2, rucksackContent.length).split('');
	const commonItemType = firstHalf.find(itemType => secondHalf.includes(itemType));
	const itemPriority = convertCharToPriority(commonItemType);
	return itemPriority;
});
const sumPriorities = sum(priorities);
console.log('Sum priorities:', sumPriorities);

const groupsOfThree = [];

for (let index = 0; index < rucksackContents.length; index += 3) {
	groupsOfThree.push([
		rucksackContents[index],
		rucksackContents[index + 1],
		rucksackContents[index + 2],
	]);
}

const groupPriorities = groupsOfThree.map(group => {
	const firstContents = group[0].split('');
	const secondContents = group[1].split('');
	const thirdContents = group[2].split('');
	const commonItemType = firstContents
		.filter(itemType => secondContents.includes(itemType))
		.find(itemType => thirdContents.includes(itemType));
	const priority = convertCharToPriority(commonItemType);
	return priority;
});
const groupSumPriorities = sum(groupPriorities);
console.log('Sum group priorities', groupSumPriorities);
