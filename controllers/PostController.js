import PostModel from '../models/Post.js';
import UserModel from '../models/User.js';

export const getAll = async (req, res) => {
	try {
		const posts = await PostModel.find()
			.populate({
				path: 'user',
				select: 'fullName avatarUrl',
				model: UserModel,
			})
			.sort({ createdAt: -1 })
			.exec();
		res.json(posts);
	} catch (err) {
		console.log(err);
		res.status(500).json({
			message: 'Failed to get articles',
		});
	}
};

export const getOne = async (req, res) => {
	try {
		const postId = req.params.id;

		const doc = await PostModel.findOneAndUpdate(
			{
				_id: postId,
			},
			{ $inc: { viewsCount: 1 } },
			{
				returnDocument: 'after',
			}
		)
			.populate({
				path: 'user',
				select: 'fullName avatarUrl _id',
				model: UserModel,
			})
			.populate({
				path: 'comments.author',
				select: 'fullName avatarUrl',
				model: UserModel,
			});

		if (!doc) {
			return res.status(404).json({
				message: 'Article not found',
			});
		}

		res.json(doc);
	} catch (err) {
		console.log(err);
		res.status(500).json({
			message: 'Failed to get articles',
		});
	}
};

export const createPost = async (req, res) => {
	try {
		const doc = new PostModel({
			title: req.body.title,
			text: req.body.text,
			imageUrl: req.body.imageUrl,
			tags: req.body.tags,
			user: req.userId,
		});

		const post = await doc.save();
		res.json(post);
	} catch (err) {
		console.log(err);
		res.status(500).json({
			message: 'Failed to create article',
		});
	}
};

export const remove = async (req, res) => {
	try {
		const postId = req.params.id;
		const doc = await PostModel.findOneAndDelete({ _id: postId });

		if (!doc) {
			return res.status(404).json({
				message: 'Article not found',
			});
		}

		res.json({
			message: 'Article succes deleted',
		});
	} catch (err) {
		console.log(err);
		res.status(500).json({
			message: 'Failed to delete article',
		});
	}
};

export const update = async (req, res) => {
	try {
		const postId = req.params.id;

		await PostModel.updateOne(
			{ _id: postId },
			{
				title: req.body.title,
				text: req.body.text,
				imageUrl: req.body.imageUrl,
				user: req.userId,
				tags: req.body.tags,
			}
		);

		res.json({
			message: 'Succes update article',
		});
	} catch (err) {
		console.log(err);
		console.log(err);
		res.status(500).json({
			message: 'Failed to update article',
		});
	}
};

export const getLastTags = async (req, res) => {
	try {
		const posts = await PostModel.find()
			.sort({ viewsCount: -1 })
			.limit(5)
			.exec();

		const tags = posts
			.map(el => el.tags)
			.flat()
			.splice(0, 5);

		res.json(tags);
	} catch (err) {
		console.log(err);
		res.status(500).json({
			message: 'Failed to get tags',
		});
	}
};

export const createComment = async (req, res) => {
	try {
		const postId = req.params.id;

		const user = await UserModel.findById(req.body.authorId);

		if (!user) {
			return res.status(404).json({ message: 'User not found' });
		}

		const comment = {
			author: req.body.authorId,
			content: req.body.content,
		};

		const updatedPost = await PostModel.findOneAndUpdate(
			{
				_id: postId,
			},
			{ $push: { comments: comment } },
			{
				returnDocument: 'after',
			}
		).populate({
			path: 'comments.author',
			select: 'fullName email avatarUrl -_id',
			model: UserModel,
		});

		res.json(updatedPost);
	} catch (err) {
		console.log(err);
		res.status(500).json({
			message: 'Failed to add comment',
		});
	}
};

export const getArticlesByTag = async (req, res) => {
	try {
		const tag = req.params.tag;

		const articles = await PostModel.find({ tags: tag })
			.populate({
				path: 'user',
				select: 'fullName avatarUrl _id',
				model: UserModel,
			})
			.populate({
				path: 'comments.author',
				select: 'fullName avatarUrl',
				model: UserModel,
			});

		res.json(articles);
	} catch (err) {
		console.log(err);
		res.status(500).json({
			message: 'Failed to get articles',
		});
	}
};
