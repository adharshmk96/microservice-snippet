import { Stan } from 'node-nats-streaming';
import { Subjects } from './subjects';

interface Event {
	subject: Subjects;
	data: any;
}

export abstract class Publisher<T extends Event> {
	// Topic
	abstract subject: T['subject'];

	private client: Stan;

	constructor(client: Stan) {
		this.client = client;
	}

	// Function Declaration for publish
	publish(data: T['data']): Promise<void> {
		return new Promise((resolve, reject) => {
			this.client.publish(this.subject, JSON.stringify(data), (err) => {
				if (err) {
					return reject(err);
				}
				console.log('Event Published', this.subject);
				resolve();
			});
		});
	}
}
