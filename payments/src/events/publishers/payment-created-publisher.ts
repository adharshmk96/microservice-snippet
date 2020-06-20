import { Publisher, PaymentCreatedEvent, Subjects } from '@adh-learns/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
	readonly subject = Subjects.PaymentCreated;
}
