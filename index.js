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
import makeDir from 'make-dir';
import config from './config.js';

async function fileExists(filePath) {
	try {
		const fileStat = await fs.stat(filePath);
		return fileStat.isFile();
	} catch {
		return false;
	}
}

async function downloadInputFile(year, dayNumber, inputFilePath) {
	const unpaddedDayNumber = Number(dayNumber);
	const inputUrl = `https://adventofcode.com/${year}/day/${unpaddedDayNumber}/input`;
	const cookieJar = new CookieJar();
	await cookieJar.setCookie(`session=${config.cookieSession}`, 'https://adventofcode.com');
	const {body: inputContent} = await got(inputUrl, {cookieJar});

	// Save input file
	await fs.writeFile(inputFilePath, inputContent);
}

async function directoryExists(directoryPath) {
	try {
		const directoryStat = await fs.stat(directoryPath);
		return directoryStat.isDirectory();
	} catch {
		return false;
	}
}

async function checkAndCreateDayDirectories(dayDirectoryPath) {
	const dayDirectoryExists = await directoryExists(dayDirectoryPath);

	if (dayDirectoryExists) return;

	console.log('Creating day directory...');
	await makeDir(dayDirectoryPath);
}

const yearInput = process.argv.length > 3
	? process.argv[2]
	: new Date().getFullYear();
let dayNumberInput = process.argv.length > 3
	? process.argv[3]
	: process.argv[2];
const today = new Date();
const isWithinDecember = today.getMonth() === 11 && today.getDate() <= 25;

// Default to current day if within december
if (!dayNumberInput && isWithinDecember) {
	dayNumberInput = today.getDate();
}

if (yearInput < 2015 || yearInput > today.getFullYear()) {
	throw new Error('Year must be between 2015 and current year');
}

if (dayNumberInput < 1 || dayNumberInput > 25) {
	throw new Error('Day must be between 1 and 25');
}

if (!dayNumberInput) {
	throw new Error('Need to specify day');
}

if (Number(yearInput) === today.getFullYear() && today.getMonth() !== 11) {
	throw new Error('It is not December for current year yet');
}

const dayNumber = zeroFill(2, dayNumberInput);
const directoryPath = path.dirname(fileURLToPath(import.meta.url));
const yearDirectoryPath = path.join(directoryPath, `solutions/${yearInput}`);
const dayDirectoryPath = path.join(yearDirectoryPath, `${dayNumber}`);
const dayFilePath = path.join(dayDirectoryPath, `${dayNumber}.js`);
const dayInputFilePath = path.join(dayDirectoryPath, 'input.txt');

await checkAndCreateDayDirectories(dayDirectoryPath);
const dayFileExists = await fileExists(dayFilePath);

if (!dayFileExists) {
	console.error(logSymbols.error, `File \`./solutions/${yearInput}/${dayNumber}/${dayNumber}.js\` does not exist`);
	console.log('Creating day file...');
	await fs.writeFile(dayFilePath, '');
	console.log(logSymbols.success, `Created day file (\`./solutions/${yearInput}/${dayNumber}/${dayNumber}.js\`)`);
}

const inputFileExists = await fileExists(dayInputFilePath);

if (!inputFileExists) {
	console.error(logSymbols.error, 'File `input.txt` does not exist');

	// If the cookie session is set, download the input file
	if (config.cookieSession) {
		console.log(logSymbols.info, 'Downloading input...');
		await downloadInputFile(yearInput, dayNumber, dayInputFilePath);
		console.log(logSymbols.success, 'Downloaded input');
	} else {
		console.log('Set the `COOKIE_SESSION` environment variable to download it');
		process.exit(1);
	}
}

// Run the selected day
fork(dayFilePath);
