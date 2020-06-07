import request from 'supertest';
import { app } from '../../app';

it('Returns a 201 on succesful signup', async () => {
	return request(app)
		.post('/api/users/signup')
		.send({
			email: 'email@mail.com',
			password: 'password',
		})
		.expect(201);
});

it('Returns a 400 with invalid email ', async () => {
	return request(app)
		.post('/api/users/signup')
		.send({
			email: 'emaiom',
			password: 'password',
		})
		.expect(400);
});

it('Returns a 400 with invalid password ', async () => {
	return request(app)
		.post('/api/users/signup')
		.send({
			email: 'email@mail.com',
			password: 'a',
		})
		.expect(400);
});

it('Returns a 400 with missing email and password ', async () => {
	await request(app)
		.post('/api/users/signup')
		.send({
			email: 'mail@email.com',
			password: '',
		})
		.expect(400);

	await request(app)
		.post('/api/users/signup')
		.send({
			email: '',
			password: 'asdf1234',
		})
		.expect(400);

	return request(app)
		.post('/api/users/signup')
		.send({
			email: '',
			password: '',
		})
		.expect(400);
});

it('Returns a 400 with duplicate email ', async () => {
	await request(app)
		.post('/api/users/signup')
		.send({
			email: 'test@test.com',
			password: 'password',
		})
		.expect(201);

	return request(app)
		.post('/api/users/signup')
		.send({
			email: 'test@test.com',
			password: 'password',
		})
		.expect(400);
});

it('Sets a cookie after successful Signup', async () => {
	const response = await request(app)
		.post('/api/users/signup')
		.send({
			email: 'email@mail.com',
			password: 'password',
		})
		.expect(201);

    expect(response.get('Set-Cookie')).toBeDefined();
});
