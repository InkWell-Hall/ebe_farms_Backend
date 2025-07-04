import { model, Schema } from "mongoose";
import normalize from 'normalize-mongoose'

export const farmProjectModel = new Schema({
    projectName: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    estimatedROI: {
        type: Number,
        required: true,
    }, // % return on investment
    durationInMonths: {
        type: Number,
        required: true,
    },
    totalRequiredFunding: {
        type: Number,
        required: true,
    },
    receivedFunding: {
        type: Number,
        default: 0,
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate:{
        type: Date,
        required: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    investors: [
        {
            type: Schema.Types.ObjectId,
            ref: "Investment",
        },
    ],
});

farmProjectModel.plugin(normalize);
export const FarmProject = model('FarmProject',farmProjectModel)