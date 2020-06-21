import { app } from './app';
import mongoose from 'mongoose';

const start = async () => {
	console.log('Starting up');
	if (!process.env.JWT_KEY) {
		throw new Error('JWT_KEY is not Defined');
	}
	try {
		await mongoose.connect('mongodb://auth-mongo-srv:27017/auth', {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true,
		});
		console.log('Connected to MongoDB');
	} catch (err) {
		console.log('This is happenning');
		console.error(err);
	}

	app.listen(3000, () => {
		console.log('Listening on port 3000 !!');
	});
};

start();
