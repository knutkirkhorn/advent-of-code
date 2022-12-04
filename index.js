import zeroFill from 'zero-fill';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {fork} from 'node:child_process';

let dayNumberInput = process.argv[2];
const today = new Date();

// Default to current day if within december
if (!dayNumberInput && today.getMonth() === 11 && today.getDate() <= 25) {
	dayNumberInput = today.getDate();
}

if (!dayNumberInput) {
	throw new Error('Need to specify day');
}

const dayNumber = zeroFill(2, dayNumberInput);
const directoryPath = path.dirname(fileURLToPath(import.meta.url));
const dayFilePath = path.join(directoryPath, `days/${dayNumber}/${dayNumber}.js`);

// Run the selected day
fork(dayFilePath);
