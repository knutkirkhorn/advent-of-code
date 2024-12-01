import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {readInput, sum} from '../../../util.js';

const directoryPath = path.dirname(fileURLToPath(import.meta.url));
const input = await readInput(directoryPath);

const measurements = input.trim().split('\n').map(Number);

let measurementIncreases = 0;

for (const [index, measurement] of measurements.entries()) {
	if (index === 0) continue;

	if (measurement > measurements[index - 1]) {
		measurementIncreases++;
	}
}

console.log(
	'Measurements larger than the previous measurement:',
	measurementIncreases,
);

let slidingMeasurementIncreases = 0;

for (let index = 1; index < measurements.length; index++) {
	const previousSlidingWindow = measurements.slice(index - 1, index + 2);
	const sumPreviousSlidingWindow = sum(previousSlidingWindow);
	const currentSlidingWindow = measurements.slice(index, index + 3);
	const sumCurrentSlidingWindow = sum(currentSlidingWindow);

	if (sumCurrentSlidingWindow > sumPreviousSlidingWindow) {
		slidingMeasurementIncreases++;
	}
}

console.log(
	'Sliding measurements larger than previous measurement:',
	slidingMeasurementIncreases,
);
