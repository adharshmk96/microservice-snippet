import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { validateRequest } from '../middlware/validate-request';

const router = express.Router();

router.post(
	'/api/users/signin',
	[
		body('email').isEmail().withMessage('Email Must be Valid'),
		body('password').trim().notEmpty().withMessage('Password is Required'),
	],
	validateRequest,
	(req: Request, res: Response) => {

	}
);

export { router as signinRouter };
