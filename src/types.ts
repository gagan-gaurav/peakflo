export enum CapDuration {
	DAILY = "DAILY",
	WEEKLY = "WEEKLY",
}
export type Line = "Green" | "Red";

export type Range = [string, string];

export type Trip = {
	source: Line;
	destination: Line;
	endTime: Date;
};

export type Payment = Trip & { fare: number };

export type Route = {
	fromLine: Line;
	toLine: Line;
	peakFare: number;
	nonPeakFare: number;
	caps: Record<CapDuration, number>;
};

