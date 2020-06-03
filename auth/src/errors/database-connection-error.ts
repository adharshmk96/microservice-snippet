import { CustomError } from './custom-error';

export class DatabaseConnectionError extends CustomError {
	reason = 'Error connecting to database';
	statusCode = 400;

	constructor() {
		super('Error Connecting to Database');

		Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
	}

	serializeErrors() {
		return [{ message: this.reason }];
	}
}
