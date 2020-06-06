import express from 'express';
import { currentUser } from '../middlware/current-user';
import { requrieAuth } from '../middlware/require-auth';

const router = express.Router();

router.post('/api/users/signout', currentUser, requrieAuth, (req, res) => {
	req.session = null;

	res.send({});
});

export { router as signoutRouter };
