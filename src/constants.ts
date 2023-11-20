import { Route } from "./types";

export const peakHourData: Record<string, [string, string][]> = {
	WEEKDAY: [
		["08:00", "10:00"],
		["16:30", "19:00"],
	],
	SATURDAY: [
		["10:00", "14:00"],
		["18:00", "23:00"],
	],
	SUNDAY: [["18:00", "23:00"]],
};
  
export const fareData: Route[] = [
	{
		fromLine: "Green",
		toLine: "Green",
		peakFare: 2,
		nonPeakFare: 1,
		caps: { DAILY: 8, WEEKLY: 55 },
	},
	{
		fromLine: "Red",
		toLine: "Red",
		peakFare: 3,
		nonPeakFare: 2,
		caps: { DAILY: 12, WEEKLY: 70 },
	},
	{
		fromLine: "Green",
		toLine: "Red",
		peakFare: 4,
		nonPeakFare: 3,
		caps: { DAILY: 15, WEEKLY: 90 },
	},
	{
		fromLine: "Red",
		toLine: "Green",
		peakFare: 3,
		nonPeakFare: 2,
		caps: { DAILY: 15, WEEKLY: 90 },
	},
];