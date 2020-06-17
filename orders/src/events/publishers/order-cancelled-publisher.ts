import { Publisher, OrderCancelledEvent, Subjects } from '@adh-learns/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
	readonly subject = Subjects.OrderCancelled;
}
