import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {readInput} from '../../../util.js';

const directoryPath = path.dirname(fileURLToPath(import.meta.url));
const input = await readInput(directoryPath);

const monkeys = input
	.trim()
	.split('\n\n')
	.map(monkeyInput => {
		const newMonkeyObject = monkeyInput.split('\n')
			.map(currentInput => currentInput.trim());

		const items = newMonkeyObject[1].split('Starting items: ')[1].split(', ').map(Number);
		const [type, amount] = newMonkeyObject[2].split('Operation: new = old ')[1].split(' ');
		const divisibleBy = Number(newMonkeyObject[3].split('Test: divisible by ')[1]);
		const divisibleTrue = Number(newMonkeyObject[4].split('If true: throw to monkey ')[1]);
		const divisibleFalse = Number(newMonkeyObject[5].split('If false: throw to monkey ')[1]);

		return {
			items,
			operation: {
				type: amount === 'old' ? '**' : type,
				amount: Number(amount),
			},
			test: {
				divisible_by: divisibleBy,
				true: divisibleTrue,
				false: divisibleFalse,
			},
			inspections: 0,
		};
	});

// Loop 20 rounds
for (let round = 0; round < 20; round++) {
	for (const monkey of monkeys) {
		for (const item of monkey.items) {
			let newWorryLevel;

			switch (monkey.operation.type) {
				case '*':
					newWorryLevel = item * monkey.operation.amount;
					break;
				case '+':
					newWorryLevel = item + monkey.operation.amount;
					break;
				case '**':
					newWorryLevel = item * item;
					break;
				default:
					throw new Error('Unsupported operation type');
			}

			// Monkey is bored of item
			newWorryLevel = Math.floor(newWorryLevel / 3);

			// Give item to other monkey
			if (newWorryLevel % monkey.test.divisible_by === 0) {
				monkeys[monkey.test.true].items.push(newWorryLevel);
			} else {
				monkeys[monkey.test.false].items.push(newWorryLevel);
			}

			// Remove item from current monkey
			monkey.items = monkey.items.filter(currentItem => currentItem !== item);

			monkey.inspections++;
		}
	}
}

const twoMonkeysWithMostInspections = monkeys.sort((a, b) => b.inspections - a.inspections).slice(0, 2);
const monkeyBusiness = twoMonkeysWithMostInspections[0].inspections * twoMonkeysWithMostInspections[1].inspections;
console.log('Monkey business:', monkeyBusiness);
