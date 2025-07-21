

// import { model, Schema } from "mongoose";
// import normalize from 'normalize-mongoose';

// export const advertModel = new Schema({
//     name: {
//         type: String,
//         required: true
//     },
//     description: {
//         type: String,
//         required: true
//     },
//     price: {
//         type: Number,
//         required: true
//     },
//     size: {
//         type: [String],
//         enum:['S', 'M', 'L', 'XL','XXL'],
//         required: true
//     },
//     category: {
//         type: String,
//         enum:['matchingSet', 'top', 'kids', 'beauty'],
//         required: true
//     },
//     subCategory: {
//         type: String,
//         enum: ['topwear', 'bottomwear', "dresses", "jewellery","cosmetics"],
//         required: true
//     },
//     bestSeller:{
//         type: Boolean,
//     },
//     date:{
//         type: Number,
//     },
//     images:{
//         type: [String],
//         default:[],
//         required: true
//     },
//     user:{
//         type: Schema.Types.ObjectId,
//         ref:'User',
//         required: true
//     }

// },{timestamps: true});

// advertModel.plugin(normalize)
// export const Advert = model('Advert',advertModel);

import { model, Schema } from "mongoose";
import normalize from 'normalize-mongoose';

export const productSchema = new Schema({
    name: {type: String, required: true}, 
    description: {type: String, required:true},
    price: {type: Number, required:true},
    images: {type: Array, required:true},
    category: {type: String, required:true},
    unit: {type: String, required:true},
    farmer: {type: String, required:true},
    location: {type: String, required:true},
    rating: {type: String, required:true},
    reviews: {type: String, required:true},
    freshness: {type: String, required:true},
    quantity: {type: String, required:true},
    bestseller: {type: Boolean},
    date: {type:Date, required:true},
    user:{
        type: Schema.Types.ObjectId,
        ref:'User',
        required: true
    }
},{timestamps: true})

productSchema.plugin(normalize);

export const Advert = model("Advert", productSchema);
