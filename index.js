import express from 'express';
import fs from 'fs';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import multer from 'multer';
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
app.use(cors());
dotenv.config();

mongoose
	.connect(process.env.DB_URL)
	.then(() => {
		console.log('DB connect');
	})
	.catch(err => {
		console.log('DB error', err);
	});

const storage = multer.diskStorage({
	destination: (_, __, cb) => {
		if (!fs.existsSync('uploads')) {
			fs.mkdirSync('uploads');
		}
		cb(null, 'uploads');
	},
	filename: (_, file, cb) => {
		cb(null, file.originalname);
	},
	limits: {
		fileSize: 1048576,
	},
});

const upload = multer({ storage });

app.use('/uploads', express.static('uploads'));

app.use(express.json());
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

const corsOptions = {
	origin: 'https://del-app-backend.vercel.app',
	optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.post(
	'/upload',
	cors(corsOptions),
	checkAuth,
	upload.single('image'),
	(req, res) => {
		res.json({
			url: `/uploads/${req.file.originalname}`,
		});
	}
);

app.listen(process.env.PORT || 5001, err => {
	if (err) {
		console.log(err);
	}
	console.log(`The server started ok, on port`);
});
