import request from 'supertest';
import { app } from '../../app';

it('Returns Status 400 for unavailable email', async () => {
	await request(app)
		.post('/api/users/signin')
		.send({
			email: 'test@mail.com',
			password: 'password',
		})
		.expect(400);
});

it('Fails when an incorrect password is supplied', async () => {
	await request(app)
		.post('/api/users/signup')
		.send({
			email: 'test@email.com',
			password: 'password',
		})
		.expect(201);

	await request(app)
		.post('/api/users/signin')
		.send({
			email: 'test@mail.com',
			password: 'passsss',
		})
		.expect(400);
});

it('Success when an incorrect password is supplied', async () => {
	await request(app)
		.post('/api/users/signup')
		.send({
			email: 'test@mail.com',
			password: 'password',
		})
		.expect(201);

	const response = await request(app)
		.post('/api/users/signin')
		.send({
			email: 'test@mail.com',
			password: 'password',
		})
		.expect(200);

	expect(response.get('Set-Cookie')).toBeDefined();
});
