import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';

import { User } from '../models/user';

import { BadRequestError } from '../errors/bad-request-error';
import { validateRequest } from '../middlware/validate-request';

const router = express.Router();

router.post(
	'/api/users/signup',
	//Middlewares
	[
		body('email').isEmail().withMessage('Email must be Valid !'),
		body('password')
			.trim()
			.isLength({ min: 4, max: 20 })
			.withMessage('Password must be between 4 and 20 characters'),
	],
	validateRequest,
	// Request Res Handler
	async (req: Request, res: Response) => {
		// New User ({email,password})
		const { email, password } = req.body;

		const existingUser = await User.findOne({ email });
		if (existingUser) {
			console.log('Email Exists');
			throw new BadRequestError('This Email already exists');
		}

		const user = User.build({ email, password });
		await user.save();

		// Generate JSON Web Token,
		const userJwt = jwt.sign(
			{
				id: user.id,
				email: user.email,
			},
			process.env.JWT_KEY!
		);

		// Store it on session object

		req.session = {
			// isNew: true,
			// isChanged: false,
			// isPopulated:false,
			jwt: userJwt,
		};

		res.status(201).send(user);
	}
);

export { router as signupRouter };
