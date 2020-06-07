import request from 'supertest';
import { app } from '../../app';

it('Responds with details about current user', async () => {
	const authResponse = await request(app)
		.post('/api/users/signup')
		.send({
			email: 'test@mail.com',
			password: 'password',
		})
		.expect(201);
	const cookie = authResponse.get('Set-Cookie');

	const response = await request(app)
		.get('/api/users/currentuser')
		.set('Cookie', cookie)
		.send()
		.expect(200);
	expect(response.body.currentUser).toBeDefined();
});

it('Responds with null if not signedin', async () => {
	const response = await request(app)
		.get('/api/users/currentuser')
		.send()
		.expect(200);
	expect(response.body.currentUser).toBeNull();
});
