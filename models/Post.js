import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema(
	{
		author: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		content: {
			type: String,
			required: true,
		},
		createdAt: {
			type: Date,
			default: Date.now,
		},
	},
	{ timestamps: true }
);

const PostSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
		},
		text: {
			type: String,
			required: true,
		},
		tags: {
			type: Array,
			default: [],
		},
		viewsCount: {
			type: Number,
			default: 0,
		},
		comments: {
			type: [CommentSchema],
			default: [],
		},
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		imageUrl: String,
	},
	{ timestamps: true }
);

const PostModel = mongoose.model('Post', PostSchema);

export default PostModel;
