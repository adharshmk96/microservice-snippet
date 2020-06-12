import { app } from './app';
import mongoose from 'mongoose';

const start = async () => {
	if (!process.env.JWT_KEY) {
		throw new Error('JWT_KEY is not Defined');
	}
	if (!process.env.MONGO_URI) {
		throw new Error('MONGO_URI is not Defined');
	}
	try {
		await mongoose.connect(process.env.MONGO_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true,
		});
		console.log('Connected to MongoDB');
	} catch (err) {
		console.log("This is happenning")
		console.error(err);
	}

	app.listen(3000, () => {
		console.log('Listening on port 3000 !!');
	});
};

start();