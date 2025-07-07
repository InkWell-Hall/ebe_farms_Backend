
import { model, Schema } from "mongoose";
import normalize from "normalize-mongoose";


export const profileModel = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    images: {
        type: [String],
        default:[],
        required: true
    }
});

profileModel.plugin(normalize);
export const Profile = model('Profile', profileModel);