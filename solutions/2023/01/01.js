import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {readInput} from '../../../util.js';

const directoryPath = path.dirname(fileURLToPath(import.meta.url));
const input = await readInput(directoryPath);

const lines = input
	.trim()
	.split('\n');

let sumCalibrationValues = 0;

for (const line of lines) {
	let firstDigit;
	let lastDigit;

	for (const character of line) {
		if (!firstDigit && Number.isInteger(Number(character))) {
			firstDigit = character;
		}

		if (Number.isInteger(Number(character))) {
			lastDigit = character;
		}
	}

	const combinedNumber = `${firstDigit}${lastDigit}`;
	sumCalibrationValues += Number(combinedNumber);
}

console.log('Sum of calibration values:', sumCalibrationValues);

const numberWords = [
	'one',
	'two',
	'three',
	'four',
	'five',
	'six',
	'seven',
	'eight',
	'nine',
];
let sumAllCalibrationValues = 0;

for (const line of lines) {
	let firstDigit;
	let lastDigit;

	for (let index = 0; index < line.length; index++) {
		const character = line[index];

		if (!firstDigit) {
			if (Number.isInteger(Number(character))) {
				firstDigit = Number(character);
			} else {
				for (const numberWord of numberWords) {
					if (!firstDigit && line.indexOf(numberWord) === index) {
						firstDigit = numberWords.indexOf(numberWord) + 1;
						break;
					}
				}
			}
		}

		if (Number.isInteger(Number(character))) {
			lastDigit = Number(character);
		} else {
			for (const numberWord of numberWords) {
				// eslint-disable-next-line unicorn/prefer-string-slice
				if (line.substring(index).indexOf(numberWord) === 0) {
					lastDigit = numberWords.indexOf(numberWord) + 1;
					break;
				}
			}
		}
	}

	const combinedNumber = `${firstDigit}${lastDigit}`;
	sumAllCalibrationValues += Number(combinedNumber);
}

console.log('Sum of calibration values including spelled out numbers:', sumAllCalibrationValues);
