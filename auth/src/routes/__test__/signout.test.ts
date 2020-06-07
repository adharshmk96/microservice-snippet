import request from 'supertest';
import { app } from '../../app';

it('Returns 200 after signout and requrests are denied', async () => {
	const authResponse = await request(app)
		.post('/api/users/signup')
		.send({
			email: 'test@mail.com',
			password: 'password',
		})
		.expect(201);
	const cookie = authResponse.get('Set-Cookie');

	const response = await request(app)
		.post('/api/users/signout')
		.set('Cookie', cookie)
		.send({})
		.expect(200);
	expect(response.body.currentUser).toBeNull;
});
