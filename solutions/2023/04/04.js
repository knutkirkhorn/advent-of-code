import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {readInput, sum} from '../../../util.js';

const directoryPath = path.dirname(fileURLToPath(import.meta.url));
const input = await readInput(directoryPath);

const cardDataRegex = /Card( +)(\d+):( +)/;
const singleAndDoubleDigitNumberRegex = /\d{1,2}/g;

const scratchCards = input
	.trim()
	.split('\n')
	.map(card => {
		const cardData = card
			.replace(cardDataRegex, '')
			.split('|')
			.map(data => data.match(singleAndDoubleDigitNumberRegex));
		const [winningNumbers, placedNumbers] = cardData;
		return {
			winningNumbers,
			placedNumbers,
		};
	});

let totalPoints = 0;

for (const scratchCard of scratchCards) {
	let correctNumbers = 0;

	for (const placedNumber of scratchCard.placedNumbers) {
		if (scratchCard.winningNumbers.includes(placedNumber)) {
			correctNumbers++;
		}
	}

	totalPoints += Math.floor(2 ** (correctNumbers - 1));
}

console.log('The cards are worth points:', totalPoints);

const numberOfEachCard = {};

for (const [index, scratchCard] of scratchCards.entries()) {
	const currentGameIndex = index + 1;
	numberOfEachCard[currentGameIndex] = numberOfEachCard[currentGameIndex] || 1;
	const numberOfCurrentCard = numberOfEachCard[currentGameIndex];
	let matchingNumbers = 0;

	for (const placedNumber of scratchCard.placedNumbers) {
		if (scratchCard.winningNumbers.includes(placedNumber)) {
			matchingNumbers++;
			const wonCardIndex = currentGameIndex + matchingNumbers;
			const currentNumberOfWonCard = numberOfEachCard[wonCardIndex] || 1;
			numberOfEachCard[wonCardIndex] = currentNumberOfWonCard + numberOfCurrentCard;
		}
	}
}

const numberOfCards = sum(Object.values(numberOfEachCard));
console.log('Total scratchcards:', numberOfCards);
