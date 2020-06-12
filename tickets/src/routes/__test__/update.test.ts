import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { Ticket } from '../../models/ticket';

it('returns 404 if provided id does not exist', async () => {
	const id = new mongoose.Types.ObjectId().toHexString();
	await request(app)
		.put(`/api/tickets/${id}`)
		.set('Cookie', global.signin())
		.send({
			title: 'some',
			price: 20,
		})
		.expect(404);
});

it('returns 401 if user is not authenticated', async () => {
	const id = new mongoose.Types.ObjectId().toHexString();
	await request(app)
		.put(`/api/tickets/${id}`)
		.send({
			title: 'some',
			price: 20,
		})
		.expect(401);
});
it('returns 401 if user doesnot own the ticket', async () => {
	const response = await request(app)
		.post(`/api/tickets`)
		.set('Cookie', global.signin())
		.send({
			title: 'some',
			price: 20,
		})
		.expect(201);

	await request(app)
		.put(`/api/tickets/${response.body.id}`)
		.set('Cookie', global.signin())
		.send({
			title: 'whatever',
			price: 20,
		})
		.expect(401);
});
it('returns 400 if user provides invalid title or price', async () => {
	const cookie = global.signin();
	const response = await request(app)
		.post(`/api/tickets`)
		.set('Cookie', cookie)
		.send({
			title: 'whatever',
			price: 20,
		})
		.expect(201);

	await request(app)
		.put(`/api/tickets/${response.body.id}`)
		.set('Cookie', cookie)
		.send({
			title: '',
			price: 20,
		})
		.expect(400);

	await request(app)
		.put(`/api/tickets/${response.body.id}`)
		.set('Cookie', cookie)
		.send({
			title: 'huh',
			price: -20,
		})
		.expect(400);
});
it('returns 200 if user provides proper validation', async () => {
	const cookie = global.signin();
	const response = await request(app)
		.post(`/api/tickets`)
		.set('Cookie', cookie)
		.send({
			title: 'whatever',
			price: 20,
		})
		.expect(201);

	const updateResponse = await request(app)
		.put(`/api/tickets/${response.body.id}`)
		.set('Cookie', cookie)
		.send({
			title: 'newtitle',
			price: 100,
		})
        .expect(200);
        
    const ticketResponse = await request(app)
     .get(`/api/tickets/${response.body.id}`)
     .send()
     expect(ticketResponse.body.title).toEqual('newtitle')
     expect(ticketResponse.body.price).toEqual(100)
});
