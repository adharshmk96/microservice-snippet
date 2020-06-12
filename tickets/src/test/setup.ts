import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../app';
import jwt from 'jsonwebtoken';

declare global {
	namespace NodeJS {
		interface Global {
			signin(): string[];
		}
	}
}

let mongo: any;

beforeAll(async () => {
	process.env.JWT_KEY = 'asdf1234';

	mongo = new MongoMemoryServer();
	const mongoUri = await mongo.getUri();

	await mongoose.connect(mongoUri, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});
});

beforeEach(async () => {
	const collections = await mongoose.connection.db.collections();

	for (let collection of collections) {
		await collection.deleteMany({});
	}
});

afterAll(async () => {
	await mongo.stop();
	await mongoose.connection.close();
});

global.signin = () => {
	// Build a JWT Payload. { id, email, iat }
	const payload = {
		id: new mongoose.Types.ObjectId().toHexString(),
		email: 'someone@mail.com',
	};

	// Create JWT
	const token = jwt.sign(payload, process.env.JWT_KEY!);

	// Build a session object { jwt: MY_JWT }
	const session = { jwt: token };

	// Turn the session into JSON
	const sessoinJSON = JSON.stringify(session);

	// Take JSON Encode as base64
	const base64 = Buffer.from(sessoinJSON).toString('base64');

	// Return the Cookie as Encoded
	return [`express:sess=${base64}`];
};
