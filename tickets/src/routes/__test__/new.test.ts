import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';

it('Has Route handler listeing to /api/tickets for post requests', async () => {
	const response = await request(app).post('/api/tickets').send({});

	expect(response.status).not.toEqual(404);
});

it('Can be only accessed if user is signed in', async () => {
	const response = await request(app)
		.post('/api/tickets')
		.send({})
		.expect(401);
});

it('Returns status other than 404 when use is signed in', async () => {
	const response = await request(app)
		.post('/api/tickets')
		.set('Cookie', global.signin())
		.send({});
	expect(response.status).not.toEqual(401);
});

it('Returns an error if invalid title is provided', async () => {
	await request(app)
		.post('/api/tickets')
		.set('Cookie', global.signin())
		.send({
			title: '',
			price: 10,
		})
		.expect(400);

	await request(app)
		.post('/api/tickets')
		.set('Cookie', global.signin())
		.send({
			price: 10,
		})
		.expect(400);
});

it('Returns an error if invalid price is provided', async () => {
	await request(app)
		.post('/api/tickets')
		.set('Cookie', global.signin())
		.send({
			title: 'good title',
			price: -10,
		})
		.expect(400);

	await request(app)
		.post('/api/tickets')
		.set('Cookie', global.signin())
		.send({
			title: 'good title',
			price: 'wow',
		})
		.expect(400);

	await request(app)
		.post('/api/tickets')
		.set('Cookie', global.signin())
		.send({
			title: 'verywell',
		})
		.expect(400);
});

it('Creates a Ticket with valid Inputs', async () => {
	// Add in a check to makesure a ticket was saved
	// find number of records
	let tickets = await Ticket.find({});
	expect(tickets.length).toEqual(0);

	await request(app)
		.post('/api/tickets')
		.set('Cookie', global.signin())
		.send({
			title: 'some',
			price: 20,
		})
		.expect(201);

	// Test total number is +1
	tickets = await Ticket.find({});
	expect(tickets.length).toEqual(1);
	expect(tickets[0].price).toEqual(20);
});
