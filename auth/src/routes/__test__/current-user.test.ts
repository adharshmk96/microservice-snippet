import request from 'supertest';
import { app } from '../../app';

it('Responds with details about current user', async () => {
	const cookie = await global.signin();

	const response = await request(app)
		.get('/api/users/currentuser')
		.set('Cookie', cookie)
		.send()
		.expect(200);
	expect(response.body.currentUser.email).toEqual('test@mail.com');
});

it('Responds with null if not signedin', async () => {
	const response = await request(app)
		.get('/api/users/currentuser')
		.send()
		.expect(200);
	expect(response.body.currentUser).toEqual(null);
});
