interface traningResults {
	periodLength: number;
	trainingDays: number;
	success: boolean;
	rating: number;
	ratingDescription: string;
	target: number;
	average: number;
}

/* const getValues = (args: Array<string>) => {
	const returnValues: Array<number> = [];
	for (let i = 3; i < args.length; i++) {
		if (!isNaN(Number(args[i]))) {
			returnValues.push(Number(args[i]));
		} else {
			throw new Error(`Provided value ${args[i]} is not a number!`);
		}
	}
	if (!isNaN(Number(args[2]))) {
		return {
			values: returnValues,
			target: Number(args[2])
		};
	} else {
		throw new Error(`Provided target ${args[2]} is not a number!`);
	}
}; */

export const exerciseCalculator = (values: Array<number>, target: number): traningResults => {
	const averageReducer = (accumulator: number, value: number, index: number, valueArray: Array<number>) => {
		const val = accumulator + value;
		if (index === valueArray.length - 1)
			return val/valueArray.length;

		return val;
	};
	
	const periodLength: number = values.length;
	const trainingDays: number = values.filter(d => d > 0).length;
	const average: number = values.reduce(averageReducer, 0);
	const rating: number = average >= target ? 3 : average > 3/2 ? 2 : 1;
	const ratingDescription: string = rating === 3 ? 'very good' :
		rating === 2 ? 'not too bad but could be better' : 'not very good';
	const success: boolean = average >= target;
	
	return {
		periodLength,
		trainingDays,
		success,
		rating,
		ratingDescription,
		target,
		average
	};

};

/* try {
	const { values, target } = getValues(process.argv);
	console.log(exerciseCalculator(values, target));
} catch (e) {
	console.log('Error: ' + String(e.message)); // eslint-disable-line
}
 */
