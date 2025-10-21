import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const communitySchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    coverArt: {
        public_id: {
            type: String,
            required: True,
        },
        url: {
            type: String,
            required: true,
        },
    },
    members: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    posts: {
        type: Schema.Types.ObjectId,
        ref: "Post",
    },
    rules: {
        type: String,
    },
}, {timestamps: true});

export const Community = mongoose.model("Community", communitySchema);