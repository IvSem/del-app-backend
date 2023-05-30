import bcrypt, { genSalt } from 'bcrypt';
import jwt from 'jsonwebtoken';
import UserModel from '../models/User.js';

export const register = async (req, res) => {
	try {
		const password = req.body.password;

		const existingUser = await UserModel.findOne({ email: req.body.email });
		if (existingUser) {
			return res
				.status(400)
				.json({ message: 'This user is already registered' });
		}

		const salt = await genSalt(10);
		const hash = await bcrypt.hash(password, salt);

		const doc = new UserModel({
			fullName: req.body.fullName,
			email: req.body.email,
			passwordHash: hash,
			avatarUrl: req.body.avatarUrl,
		});

		const user = await doc.save();

		const token = jwt.sign(
			{
				_id: user._id,
			},
			process.env.SECRET,
			{ expiresIn: '1h' }
		);

		const { passwordHash, ...userData } = user._doc;

		res.json({ ...userData, token });
	} catch (err) {
		console.log(err);
		res.status(500).json({
			message: 'Registration error',
		});
	}
};

export const login = async (req, res) => {
	try {
		const user = await UserModel.findOne({ email: req.body.email });

		if (!user) {
			return res.status(404).json({
				message: 'Incorrect email or password',
			});
		}

		const isValidPassword = await bcrypt.compare(
			req.body.password,
			user._doc.passwordHash
		);

		if (!isValidPassword) {
			return res.status(404).json({
				message: 'Incorrect email or password',
			});
		}

		const token = jwt.sign(
			{
				_id: user._id,
			},
			process.env.SECRET,
			{ expiresIn: '1h' }
		);

		const { passwordHash, ...userData } = user._doc;

		res.json({ ...userData, token });
	} catch (err) {
		console.log(err);
		res.status(401).json({
			message: 'Authorization error',
		});
	}
};

export const getMe = async (req, res) => {
	try {
		const user = await UserModel.findById(req.userId);
		if (!user) {
			return res.status(404).json({ message: 'User not found' });
		}
		const { passwordHash, ...userData } = user._doc;
		res.json(userData);
	} catch (err) {
		console.log(err);
		res.status(401).json({
			message: 'Acces error',
		});
	}
};
