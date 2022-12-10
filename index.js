/* eslint-disable unicorn/no-process-exit */
import zeroFill from 'zero-fill';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {fork} from 'node:child_process';
import fs from 'node:fs/promises';
import logSymbols from 'log-symbols';
// eslint-disable-next-line import/no-unresolved
import got from 'got';
import {CookieJar} from 'tough-cookie';
import config from './config.js';

async function fileExists(filePath) {
	try {
		const fileStat = await fs.stat(filePath);
		return fileStat.isFile();
	} catch {
		return false;
	}
}

async function downloadInputFile(dayNumber, inputFilePath) {
	// Download input file
	const unpaddedDayNumber = Number(dayNumber);
	const inputUrl = `https://adventofcode.com/2022/day/${unpaddedDayNumber}/input`;
	const cookieJar = new CookieJar();
	await cookieJar.setCookie(`session=${config.cookieSession}`, 'https://adventofcode.com');
	const {body: inputContent} = await got(inputUrl, {cookieJar});

	// Save input file
	await fs.writeFile(inputFilePath, inputContent);
}

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
const dayDirectoryPath = path.join(directoryPath, `days/${dayNumber}`);
const dayFilePath = path.join(dayDirectoryPath, `${dayNumber}.js`);
const dayInputFilePath = path.join(dayDirectoryPath, 'input.txt');

const dayFileExists = await fileExists(dayFilePath);

if (!dayFileExists) {
	console.error(logSymbols.error, `File \`${dayNumber}.js\` does not exist`);
	process.exit(1);
}

const inputFileExists = await fileExists(dayInputFilePath);

if (!inputFileExists) {
	console.error(logSymbols.error, 'File `input.txt` does not exist');

	// If the cookie session is set, download the input file
	if (config.cookieSession) {
		console.log(logSymbols.info, 'Downloading input...');
		await downloadInputFile(dayNumber, dayInputFilePath);
		console.log(logSymbols.success, 'Downloaded input');
	} else {
		console.log('Set the `SESSION_COOKIE` environment variable to download it');
	}

	process.exit(1);
}

// Run the selected day
fork(dayFilePath);
