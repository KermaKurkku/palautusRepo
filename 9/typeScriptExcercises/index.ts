import express from 'express';
const app = express();
import { bmiCalculator } from './bmiCalculator';
import { exerciseCalculator } from './exerciseCalculator';

app.use(express.json());

app.get('/hello', (_req, res) => {
	res.send('Hello Full Stack!');
});

app.get('/bmi', (req, res) => {
	console.log(req.query);
	const args: Array<number> = [Number(req.query.height), Number(req.query.weight)];
	if (args.length < 2 || isNaN(args[0]) || isNaN(args[1]))
		res.json({error: 'malformatted parameters'});
	const bmi = bmiCalculator(args[0], args[1]);
	res.json({
		weight: args[0],
		height: args[1],
		bmi
	});
});

app.post('/exercises', (req, res) => {
	const dailyExercises: Array<number> = req.body.daily_exercises as Array<number>; // eslint-disable-line
	const target: number = req.body.target as number; // eslint-disable-line

	
	if (!target || !dailyExercises)
		res.json({error: 'parameters missing'});
	
	if (dailyExercises.filter(e => isNaN(e)).length > 0 || isNaN(target))
		res.json({error: 'malformatted parameters'});

	const response = exerciseCalculator(dailyExercises, target);

	res.json(response);
});

const PORT = 3002;

app.listen(PORT, () => {
	console.log(`Server running at ${PORT}`);
});