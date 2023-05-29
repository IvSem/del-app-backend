import PostModel from '../models/Post.js';

export const getAll = async (req, res) => {
	try {
		const posts = await PostModel.find().populate('user').exec();

		const extractedData = posts.map(item => {
			const { passwordHash, ...rest } = item.user._doc;
			return { ...item._doc, user: rest };
		});
		res.json(extractedData);
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
		);

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

export const create = async (req, res) => {
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
			success: true,
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
			succes: true,
		});
	} catch (err) {
		console.log(err);
		console.log(err);
		res.status(500).json({
			message: 'Failed to update article',
		});
	}
};
