import nats, { Stan } from 'node-nats-streaming';
import { get } from 'mongoose';

class NatsWrapper {
	private _client?: Stan;

	get client(): Stan | never {
		if (!this._client) {
			throw new Error("Can't access NATS Client before connecting");
		}

		return this._client;
	}

	connect(clusterId: string, clientId: string, url: string) {
		this._client = nats.connect(clusterId, clientId, { url });

		return new Promise((resolve, reject) => {
			this._client!.on('connect', () => {
				console.log('Connected to NATS');
				resolve();
			});
			this._client!.on('error', (err) => {
				reject(err);
			});
		});
	}
}

export const natsWrapper = new NatsWrapper();
