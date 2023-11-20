import fs from 'fs';
import { parse } from "csv";
import { Range } from "./types";


export function startOfDay(date: Date): Date {
	const dt = new Date(date.valueOf());
	dt.setHours(0, 0, 0, 0);
	return dt;
}

export function startOfWeek(date: Date): Date {
	const dt = new Date(date.valueOf());
	const WEEK_START_ON = 1;
	const day = dt.getDay();
	const diff = (day < WEEK_START_ON ? 7 : 0) + day - WEEK_START_ON;

	dt.setDate(dt.getDate() - diff);
	dt.setHours(0, 0, 0, 0);
	return dt;
}

export function isWeekday(date: Date): boolean {
	const day = date.getDay();
	return day >= 1 && day <= 5;
}

export function timeInRange(date: Date, [low, high]: Range): boolean {
	const lo = new Time(low).getMins();
	const hi = new Time(high).getMins();
	if (lo >= hi) {
		throw new Error("invalid time range");
	}

	const time = new Time(date).getMins();
	return time >= lo && time <= hi;
}

export class Time {
	hours: number;
	minutes: number;

	constructor(time: string | Date) {
	let hours: number, minutes: number;

	if (typeof time === "string") {
		// expecting time in the HH:MM format
		if (/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/.test(time)) {
		[hours, minutes] = time.split(":").map((v) => parseInt(v));
		} else {
		throw new Error("invalid time string");
		}
	} else if (time instanceof Date) {
		hours = time.getHours();
		minutes = time.getMinutes();
	} else {
		throw new Error("only formatted string or date type allowed");
	}

	this.hours = hours;
	this.minutes = minutes;
	}

	getMins() {
	return this.hours * 60 + this.minutes;
	}
}

export interface InputRecord {
	FromLine: string;
	ToLine: string;
	DateTime: string;
}


//parse input CSV file
export const parseInputFile = (filePath: string): Promise<InputRecord[]> => {
	return new Promise((resolve, reject) => {
	const records: InputRecord[] = [];

	fs.createReadStream(filePath)
		.pipe(parse({ columns: true, delimiter: ',' }))
		.on('data', (data: InputRecord) => {
		records.push(data);
		})
		.on('end', () => {
		resolve(records);
		})
		.on('error', (error) => {
		reject(error);
		});
	});
};

