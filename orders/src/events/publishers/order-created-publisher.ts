import { Publisher, OrderCreatedEvent, Subjects } from '@adh-learns/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
	readonly subject = Subjects.OrderCreated;
}
