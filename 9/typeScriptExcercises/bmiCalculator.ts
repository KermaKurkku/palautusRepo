/* interface valueTypes {
	height: number;
	weight: number;
}

const parseArguments = (args: Array<string>): valueTypes => {
	if (args.length < 4) throw new Error('Not enough arguments');
	if (args.length > 4) throw new Error('Too many arguments');

	if (!isNaN(Number(args[0])) && !isNaN(Number(args[1]))) {
		return {
			height: Number(args[0]),
			weight: Number(args[1])
		};
	} else {
		throw new Error('Given values were not numbers');
	}
}; */

export const bmiCalculator = (h: number, w: number): string => {
	const bmi: number = w/((h/100)*(h/100));

	if (bmi < 15)
		return 'Very severely underweight';
	else if (bmi < 16)
		return 'Severely underweight';
	else if (bmi < 18.5)
		return 'Underweight';
	else if (bmi < 25)
		return 'Normal (healthy weight)';
	else if (bmi < 30)
		return 'Overweight';
	else if (bmi < 35)
		return 'Obese Class I (Moderately obese)';
	else if (bmi < 40)
		return 'Obese Class II (Severely obese)';
	else 
		return 'Obese Class III (Very severely obese)';

};

/* try {
	const {height, weight} = parseArguments(process.argv);
	console.log(bmiCalculator(height, weight));
} catch (e) {
console.log(	'Error: ' + String(e.message)); // eslint-disable-line
} */
