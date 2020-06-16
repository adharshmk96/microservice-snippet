import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { errorHandler, currentUser } from '@adh-learns/common';
import { NotFoundError } from '@adh-learns/common';

// Routes
import { indexOrderRouter } from './routes';
import { createOrderRouter } from './routes/new';
import { showOrderRouter } from './routes/show';
import { deleteOrderRoute } from './routes/delete';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
	cookieSession({
		signed: false,
		// secure: process.env.NODE_ENV != 'test',
	})
);

app.use(currentUser);

app.use(indexOrderRouter);
app.use(createOrderRouter);
app.use(showOrderRouter);
app.use(deleteOrderRoute);

app.get('*', async (req, res) => {
	throw new NotFoundError();
});

app.use(errorHandler);

export { app };
