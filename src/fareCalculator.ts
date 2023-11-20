import { Trip, Payment } from "./types";
import FareGetter from "./fareGetter";

export default class FareService {
	// Maintain history of payments.
	private payments: Payment[] = [];

	// Calculate Total Fare
	public calculateTotalFare(trips: Trip[]): number {
	trips.sort((a, b) => a.endTime.getTime() - b.endTime.getTime());
	let totalFare = 0;
	for (const trip of trips) {
		const fare = this.calculateFare(trip);
		const {source, destination, endTime } = trip;
		console.log(
		`Fare for Passenger on ${endTime.toLocaleString()} from ${source} to ${destination} is $${fare}.`
		);
		totalFare += fare;
	}
	return totalFare;
	}

	// Calculate Fare of each trip.
	private calculateFare(trip: Trip): number {
	const { source, destination, endTime } = trip;
	const pastPayments = this.payments.filter(
		(j) =>
		j.source === source &&
		j.destination === destination &&
		j.endTime <= endTime
	);
	const fareGetter = new FareGetter(source, destination);

	const fare = fareGetter.getFare(pastPayments, endTime);

	this.payments.push({ ...trip, fare });
	return fare;
	}
}



