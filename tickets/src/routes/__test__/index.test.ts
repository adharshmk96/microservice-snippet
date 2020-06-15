import request from 'supertest';
import { app } from '../../app';



const createTicket = async () => {
	const title = 'some';
	const price = 20;

	await request(app)
		.post('/api/tickets')
		.set('Cookie', global.signin())
		.send({
			title,
			price,
		})
		.expect(201);
};

it('Returns a list of tickets', async () => {
	await createTicket();
	await createTicket();
	await createTicket();

	const response = await request(app).get('/api/tickets').send().expect(200);

	expect(response.body.length).toEqual(3);
});
