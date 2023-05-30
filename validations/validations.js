import { body } from 'express-validator';

export const registerValidation = [
	body('email', 'Incorrect email format').isEmail(),
	body('password', 'Password must be at least 5 characters long').isLength({
		min: 5,
	}),
	body('fullName', 'Enter a name').isLength({ min: 3 }),
	body('avatarUrl', 'Incorrect avatar link').optional().isURL(),
];
export const loginValidation = [
	body('email', 'Incorrect email format').isEmail(),
	body('password', 'Password must be at least 5 characters long').isLength({
		min: 5,
	}),
];

export const postCreateValidation = [
	body('title', 'Write the title of the article')
		.isLength({ min: 3 })
		.isString(),
	body('text', 'Write the text of the article')
		.isLength({
			min: 10,
		})
		.isString(),
	body('tags', 'Wrong format, enter an array of tags').optional().isArray(),
	body('imageUrl', 'Incorrect image link').optional().isString(),
];

export const commentCreateValidation = [
	body('content', 'Content comment must be most 3 characters')
		.isLength({ min: 3 })
		.isString(),
];
