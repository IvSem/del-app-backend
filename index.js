import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import multer from 'multer';
import cors from 'cors';
import {
	loginValidation,
	registerValidation,
	postCreateValidation,
} from './validations/validations.js';
import { PostController, UserController } from './controllers/index.js';
import { checkAuth, handleValidationsErrors } from './utils/index.js';

dotenv.config();
mongoose
	.connect(process.env.DB_URL)
	.then(() => {
		console.log('DB connect');
	})
	.catch(err => {
		console.log('DB error', err);
	});
//const PORT = process.env.PORT || 3001;
const app = express();

const storage = multer.diskStorage({
	destination: (_, __, cb) => {
		cb(null, 'uploads');
	},
	filename: (_, file, cb) => {
		cb(null, file.originalname);
	},
});
const upload = multer({ storage });
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));
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
app.get('/posts/:id', PostController.getOne);
app.post(
	'/posts',
	checkAuth,
	postCreateValidation,
	handleValidationsErrors,
	PostController.create
);
app.delete('/posts/:id', checkAuth, PostController.remove);
app.patch(
	'/posts/:id',
	checkAuth,
	postCreateValidation,
	handleValidationsErrors,
	PostController.update
);
app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
	res.json({
		url: `/uploads/${req.file.originalname}`,
	});
});

app.listen(5001, err => {
	if (err) {
		console.log(err);
	}
	//console.log(`The server started ok, on port ${PORT}`);
	console.log(`The server started ok, on port`);
});
