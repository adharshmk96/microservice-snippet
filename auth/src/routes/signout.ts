import express from 'express';
import { currentUser } from '@adh-learns/common';
import { requrieAuth } from '@adh-learns/common';

const router = express.Router();

router.post('/api/users/signout', currentUser, requrieAuth, (req, res) => {
	req.session = null;

	res.send({});
});

export { router as signoutRouter };
