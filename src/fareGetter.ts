import { Route, Payment, CapDuration } from "./types";
import { isWeekday, startOfDay, startOfWeek, timeInRange } from "./utils";
import { Line } from "./types";
import { fareData, peakHourData } from "./constants";

export default class FareFinder {
	private route: Route;

	constructor(fromLine: Line, toLine: Line) {
	this.route = this.getRoute(fromLine, toLine);
	}

	private getRoute(fromLine: Line, toLine: Line): Route{
	const route = fareData.find(
		(x) => x.fromLine === fromLine && x.toLine === toLine 
	);
	if(!route){
		throw new Error("no such route found.")
	}
	return route;
	}

	public getFare(pastPayments: Payment[], datetime: Date): number {
	let fare = this.getTimeBasedFare(datetime); // Actual fare based on peak/no-peak time
	function sum(arr: number[]): number {
		return arr.reduce((a, b) => a + b, 0);
	}

	for (const duration of Object.keys(CapDuration)) {
		const fareCapForDuration = this.getCap(duration); // get the cap value for day/week
		const capStart = this.getCapStart(datetime, duration); // get the initial timeframe for cap calculation.
		const paymentsThisDuration = pastPayments.filter(
		(j) => j.endTime >= capStart
		);
		const farePaidThisDuration = sum(paymentsThisDuration.map((j) => j.fare)); // total fare paid before this trip.
		if (farePaidThisDuration >= fareCapForDuration) {
		fare = 0;
		break;
		}
		fare = Math.min(fare, fareCapForDuration - farePaidThisDuration); // previousFares + currentFare should not exceed Cap Value. 
	}

	return fare;
	}

	private getCap(duration: string): number {
	return this.route.caps[duration as CapDuration];
	}

	private getCapStart(datetime: Date, duration: string): Date {
	switch (duration as CapDuration) {
		case CapDuration.DAILY:
		return startOfDay(datetime);
		case CapDuration.WEEKLY:
		return startOfWeek(datetime);
		default:
		throw new Error("invalid cap duration");
	}
	}

	private getTimeBasedFare(date: Date): number {
	return this.isPeakHour(date)
		? this.route.peakFare
		: this.route.nonPeakFare;
	}

	// returns true if time comes in peak hour range.
	private isPeakHour(date: Date): boolean {
	let key;

	if (isWeekday(date)) {
		key = "WEEKDAY";
	} else {
		key = date.getDay() == 6 ? "SATURDAY" : "SUNDAY";
	}

	const peakRanges = peakHourData[key];
	return peakRanges.some((range) => timeInRange(date, range));
	}
}