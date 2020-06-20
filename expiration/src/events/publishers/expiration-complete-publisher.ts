import {
	Subjects,
	Publisher,
	ExpirationCompleteEvent,
} from '@adh-learns/common';

export class ExpirationCompletePublisher extends Publisher<
	ExpirationCompleteEvent
> {
	readonly subject = Subjects.ExpirationComplete;
}
