import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {readInput} from '../../../util.js';

const directoryPath = path.dirname(fileURLToPath(import.meta.url));
const input = await readInput(directoryPath);

function findDistinctCharactersPosition(numberOfDistinctCharacters) {
	let distinctCharacters = [];
	let position = 0;

	// eslint-disable-next-line unicorn/no-for-loop
	for (let index = 0; index < input.length; index++) {
		const currentCharacter = input[index];

		if (distinctCharacters.includes(currentCharacter)) {
			distinctCharacters = distinctCharacters.slice(
				distinctCharacters.indexOf(currentCharacter) + 1,
			);
		}

		distinctCharacters.push(currentCharacter);

		if (distinctCharacters.length === numberOfDistinctCharacters) {
			position = index + 1;
			break;
		}
	}

	return position;
}

console.log('Start of packet position:', findDistinctCharactersPosition(4));
console.log('Start of message position:', findDistinctCharactersPosition(14));
