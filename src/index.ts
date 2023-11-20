import { parseInputFile, InputRecord } from './utils';
import FareService from './fareCalculator';
import { Trip, Line } from './types';

// Create new a FareService
const fareService = new FareService();

async function processInputData() {
	//Input file path
	const inputFilePath = './data/fares.csv';

	// Parse input data from the CSV file
	const inputData: InputRecord[] = await parseInputFile(inputFilePath);

	const userTripData: Trip[] = inputData.map(
	({ FromLine, ToLine, DateTime }): Trip => ({
		source: FromLine as Line,
		destination: ToLine as Line,
		endTime: new Date(DateTime),
	})
	);
	console.log(`Total Fare is $${fareService.calculateTotalFare(userTripData)}`)
}

// Call the async function
processInputData().catch((error) => console.error(error));
