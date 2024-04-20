import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import {
	loginValidation,
	registerValidation,
	postCreateValidation,
	commentCreateValidation,
} from './validations/validations.js';
import { PostController, UserController } from './controllers/index.js';
import { checkAuth, handleValidationsErrors } from './utils/index.js';

const app = express();
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ limit: '5mb', extended: true }));
app.use(cors());
dotenv.config();

mongoose
	.connect(process.env.DB_URL, {
		useNewUrlParser: true,
	})
	.then(() => {
		console.log('DB connect');
	})
	.catch(err => {
		console.log('DB error', err);
	});

app.post(
	'/auth/register',
	registerValidation,
	handleValidationsErrors,
	UserController.register
);
app.post(
	'/auth/login',
	loginValidation,
	handleValidationsErrors,
	UserController.login
);
app.get('/auth/me', checkAuth, UserController.getMe);

app.get('/posts', PostController.getAll);
app.get('/posts/tags', PostController.getLastTags);
app.get('/posts/:id', PostController.getOne);
app.get('/tags/:tag', PostController.getArticlesByTag);
app.post(
	'/posts',
	checkAuth,
	postCreateValidation,
	handleValidationsErrors,
	PostController.createPost
);

app.post(
	'/posts/:id/comments',
	checkAuth,
	commentCreateValidation,
	handleValidationsErrors,
	PostController.createComment
);

app.delete('/posts/:id', checkAuth, PostController.remove);
app.patch(
	'/posts/:id/edit',
	checkAuth,
	postCreateValidation,
	handleValidationsErrors,
	PostController.update
);

app.listen(process.env.PORT || 5001, err => {
	if (err) {
		console.log(err);
	}
	console.log(`The server started ok, on port`);
});
