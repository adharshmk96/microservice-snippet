import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { OrderStatus } from '@adh-learns/common';
import { Order } from '../../models/order';
import { natsWrapper } from '../../nats-wrapper';

it('fetches the order', async () => {
	// Create a ticket
	const ticket = Ticket.build({
		title: 'concert',
		price: 20,
	});
	await ticket.save();

	const user = global.signin();
	// make a request to build and order with this ticket
	const { body: order } = await request(app)
		.post('/api/orders')
		.set('Cookie', user)
		.send({ ticketId: ticket.id })
		.expect(201);

	// make request to fetch the order
	const { body: fetched } = await request(app)
		.delete(`/api/orders/${order.id}`)
		.set('Cookie', user)
		.send()
		.expect(204);

	const updatedOrder = await Order.findById(order.id);
	expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it('returns error if another user fetches data', async () => {
	// Create a ticket
	const ticket = Ticket.build({
		title: 'concert',
		price: 20,
	});
	await ticket.save();

	const user = global.signin();
	const usertwo = global.signin();
	// make a request to build and order with this ticket
	const { body: order } = await request(app)
		.post('/api/orders')
		.set('Cookie', user)
		.send({ ticketId: ticket.id })
		.expect(201);

	// make request to fetch the order
	await request(app)
		.delete(`/api/orders/${order.id}`)
		.set('Cookie', usertwo)
		.send()
		.expect(401);
});

it('Emits an order cancelled order', async () => {
	// Create a ticket
	const ticket = Ticket.build({
		title: 'concert',
		price: 20,
	});
	await ticket.save();

	const user = global.signin();
	// make a request to build and order with this ticket
	const { body: order } = await request(app)
		.post('/api/orders')
		.set('Cookie', user)
		.send({ ticketId: ticket.id })
		.expect(201);

	// make request to fetch the order
	const { body: fetched } = await request(app)
		.delete(`/api/orders/${order.id}`)
		.set('Cookie', user)
		.send()
		.expect(204);

	const updatedOrder = await Order.findById(order.id);
	expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);

	expect(natsWrapper.client.publish).toHaveBeenCalled();
});
