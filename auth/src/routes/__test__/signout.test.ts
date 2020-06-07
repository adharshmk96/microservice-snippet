import request from 'supertest';
import { app } from '../../app';

it('Returns 200 after signout and requrests are denied', async () => {
	const cookie = await global.signin();

	const response = await request(app)
		.post('/api/users/signout')
		.set('Cookie', cookie)
		.send({})
		.expect(200);
	expect(response.body.currentUser).toBeNull;
});
