import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';

import { User } from '../models/user';
import { validateRequest } from '@adh-learns/common';
import { BadRequestError } from '@adh-learns/common';
import { Password } from '../services/password';
const router = express.Router();

router.post(
	'/api/users/signin',
	[
		body('email').isEmail().withMessage('Email Must be Valid'),
		body('password').trim().notEmpty().withMessage('Password is Required'),
	],
	validateRequest,
	async (req: Request, res: Response) => {
		const { email, password } = req.body;

		const existingUser = await User.findOne({ email });
		if (!existingUser) {
			throw new BadRequestError('Invalid Credentials');
		}

		// use compare method pass stored password
		const passwordsMatch = await Password.compare(
			existingUser.password,
			password
		);

		if (!passwordsMatch) {
			throw new BadRequestError('Invaild Credentials');
		}

		// Generate JSON Web Token,
		const userJwt = jwt.sign(
			{
				id: existingUser.id,
				email: existingUser.email
			},
			process.env.JWT_KEY!
		);

		// Store it on session object
		// @ts-ignore
		req.session = {
			// isNew: true,
			// isChanged: false,
			// isPopulated:false,
			jwt: userJwt,
		};

		// Send Response
		res.status(200).send(existingUser);
	}
);

export { router as signinRouter };
