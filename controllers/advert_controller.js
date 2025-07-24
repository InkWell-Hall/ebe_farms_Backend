
// import { Advert } from "../models/advert_model.js"
// import { Order } from "../models/order_model.js";
// import { advertSchema } from "../schemas/advert_schema.js"
// import { buildAdvertFilter } from "../utils/help.js"


// export const createAdvert = async (req, res) => {
//   try {
//     const { error, value } = advertSchema.validate(req.body);
//     if (error) {
//       return res.status(400).json({ message: error.details[0].message });
//     }

//     // ✅ Extract image URLs from Cloudinary upload (via Multer)
//     const imageUrls = req.files?.map(file => file.path) || [];

//     // ✅ Add imageUrls to validated data
//     value.images = imageUrls;

//     const advert = await (
//       await Advert.create({
//         ...value,
//         user: req.user.id, // Make sure you're including the user here
//       })
//     ).populate("user", "-password -otp");

//     res.status(201).json({ message: "advert has been created succesfully", advert });
//   } catch (error) {
//     console.error("Create Advert Error:", error);
//     res.status(500).json({ message: error.message });
//   }
// };




// export const getallAdverts = async (req, res) => {

//   try {
//     const adverts = await Advert.find().populate('user', '-password -otp') // exclude password, otp field
//     return res.status(200).json({ message: 'all adverts', adverts })
//   } catch (error) {
//     res.status(500).json({ message: error.message })
//   }
// }

// export const getalluserAdverts = async (req, res) => {

//   try {
//     const userId = req.user.id;
//     const adverts = await Advert.find({ user: userId }).populate('user', '-password -otp') // exclude password, otp field
//     return res.status(200).json({ message: 'all adverts', adverts })
//   } catch (error) {
//     res.status(500).json({ message: error.message })
//   }
// }

// export const getAuserAdverts = async (req, res) => {
//   try {
//     const filter = buildAdvertFilter(req.user.id, req.params.id, req.query.category, req.query.subCategory, req.query.name, req.query.price);
//     const adverts = await Advert.find(filter).populate('user', '-password -otp');

//     if (!adverts.length) {
//       return res.status(404).json({ message: 'No matching adverts found' });
//     }

//     return res.status(200).json({ message: 'Matching adverts found', adverts });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };



// // export const updateUserAdverts = async (req, res) => {

// //     try {
// //         const userId = req.user.id;
// //         const advertId = req.params.id;
// //         const advert = await Advert.findById(advertId)
// //         if (!advertId) {
// //             return res.status(400).json({ message: 'Advert ID is required or does not exist' })
// //         }

// //         if (advert.user.toString() !== userId) {
// //             return res.status(403).json({ message: 'you are not authorize to Edit this advert' })
// //         }
// //         const updatedAdvert = await Advert.findOneAndUpdate(
// //             { id: advertId, user: userId },
// //             req.body,
// //             { new: true } // return the updated document
// //         );
// //         return res.status(200).json({ message: 'Updated', updatedAdvert })
// //     } catch (error) {
// //         res.status(500).json({ message: error.message })
// //     }
// // }

// export const updateUserAdverts = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const advertId = req.params.id;

//     const advert = await Advert.findById(advertId);
//     if (!advert) {
//       return res.status(404).json({ message: 'Advert not found' });
//     }

//     if (advert.user.toString() !== userId) {
//       return res.status(403).json({ message: 'You are not authorized to edit this advert' });
//     }

//     const updatedAdvert = await Advert.findOneAndUpdate(
//       { _id: advertId, user: userId }, // ✅ use 'user', not 'userId'
//       req.body,
//       { new: true }
//     );

//     if (!updatedAdvert) {
//       return res.status(400).json({ message: 'Update failed' });
//     }

//     return res.status(200).json({ message: 'Updated', updatedAdvert });

//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };



// export const deluserAdverts = async (req, res) => {
//   try {
//     const advertId = req.params.id;
//     const userId = req.user.id;

//     if (!advertId) {
//       return res.status(400).json({ message: 'Advert ID is required' });
//     }

//     const advert = await Advert.findById(advertId);

//     if (!advert) {
//       return res.status(404).json({ message: 'Advert not found' });
//     }

//     if (advert.user.toString() !== userId) {
//       return res.status(403).json({ message: 'You are not authorized to delete this advert' });
//     }

//     await Advert.findByIdAndDelete(advertId);
//     return res.status(200).json({ message: 'Advert deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };


// export const getOrderedAdvert = async (req, res) => {
//   try {
//     // this get all ids from adverts created by the vendor
//     const VendorID = req.user.userId;
//     const adverts = await Advert.find({ user: VendorID }).select('_id');
//     const advertIDs = adverts.map(advert => advert.id);

//     // find all orders that contains the items.advert created by the vendor and populate the buyer and the items
//     const orders = await Order.find({ 'items.advert': { $in: advertIDs } })
//       .populate('user', '-password -otp') // Populate buyer
//       .populate('items.advert');          // Populate advert inside items

//     // const unique users or 
//     const uniqueUserIds = new Set(orders.map(order => order.user._id.toString()));

//     res.json({
//       totalOrders: orders.length,
//       uniqueCustomers: uniqueUserIds.size,
//       orders, // optional: send populated orders if needed
//     });

//   } catch (error) {
//     console.log(error.message)
//     return res.status(500).json({ message: 'Server Error' })
//   };
// };

// import { v2 as cloudinary } from "cloudinary"
import { Advert } from "../models/advert_model.js"
import { buildAdvertFilter } from "../utils/help.js"
import { advertSchema } from "../schemas/advert_schema.js";

export const addProduct = async (req, res) => {
    try {
        const userID = req.user.id
        // Step 1: Extract image URLs
        const imageUrls = req.files?.map(file => file.path) || [];

        // Step 2: Add to the data before validating
        const dataToValidate = { ...req.body, images: imageUrls };

        // Step 3: Validate
        const { error, value } = advertSchema.validate(dataToValidate);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        // ✅ Add imageUrls to validated data
        // value.images = imageUrls;

        const advert = await Advert.create({
            ...value,
            images: imageUrls,// ✅ Add imageUrls to validated data
            date: Date.now(),
            user: userID
            // user: req.user.id, // Make sure you're including the user here
        })//.populate("investor", "-password -otp");

        const populatedProduct = await Advert.findById(advert.id).populate('user', '-password -otp');

        return res.status(201).json({ message: "Product has been created succesfully", populatedProduct });
    } catch (error) {
      console.log('error message',error)
        return res.status(500).json({ message: error.message });
    }
};

// export const addProduct = async (req, res) => {
//   try {

//     const userID = req.user.id;
//     // Debug: Log the entire request body and files
//     console.log("Request body:", req.body);
//     console.log("Request files:", req.files);

//     // Extract data from request body
//     const { name, description, price, category, subCategory, size, bestSeller } = req.body;

//     // Validate required fields
//     if (!name || !description || !price || !category || !subCategory) {
//       return res.status(400).json({
//         success: false,
//         message: "Missing required fields"
//       });
//     }

//     // Handle file uploads with proper error checking
//     let images = [];
//     if (req.files) {
//       const image1 = req.files.image1 && req.files.image1[0];
//       const image2 = req.files.image2 && req.files.image2[0];
//       const image3 = req.files.image3 && req.files.image3[0];
//       const image4 = req.files.image4 && req.files.image4[0];

//       images = [image1, image2, image3, image4].filter((item) => item !== undefined);
//     }

//     // Upload images to Cloudinary
//     let imagesUrl = [];
//     if (images.length > 0) {
//       try {
//         imagesUrl = await Promise.all(
//           images.map(async (item) => {
//             console.log("Uploading image:", item.path);
//             let result = await cloudinary.uploader.upload(item.path, {
//               resource_type: "image"
//             });
//             return result.secure_url;
//           })
//         );
//         console.log("Uploaded image URLs:", imagesUrl);
//       } catch (uploadError) {
//         console.error("Cloudinary upload error:", uploadError);
//         return res.status(500).json({
//           success: false,
//           message: "Image upload failed: " + uploadError.message
//         });
//       }
//     }

//     // Parse sizes safely
//     let parsedSizes = [];
//     try {
//       parsedSizes = size ? JSON.parse(size) : [];
//     } catch (parseError) {
//       console.error("Size parsing error:", parseError);
//       return res.status(400).json({
//         success: false,
//         message: "Invalid size format"
//       });
//     }

//     // Create product data
//     const productData = {
//       name,
//       description,
//       category,
//       price: Number(price),
//       subCategory,
//       bestseller: bestSeller === "true" || bestSeller === true,
//       sizes: parsedSizes,
//       image: imagesUrl,
//       date: Date.now(),
//       user: userID
//     };

//     console.log("Product data to save:", productData);

//     // Save product to database
//     const product = new Advert(productData);
//     await product.save(); // ✅ now it's saved to DB
//     // ✅ Proper way to populate after creation
//     const populatedProduct = await Advert.findById(product.id).populate('user', '-password -otp');
//     res.status(201).json({
//       success: true,
//       message: "Product Added Successfully",
//       product: populatedProduct
//     });

//     console.log('saveData', populatedProduct)

//   } catch (error) {
//     console.error("Controller error:", error);
//     res.status(500).json({
//       success: false,
//       message: error.message || "Internal server error"
//     });
//   }
// };

//function for listing product
export const listProducts = async (req, res) => {

  try {
    const products = await Advert.find({});
    res.json({ success: true, products })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

//function for removing a product
export const removeProduct = async (req, res) => {
  try {
    const advertID = req.params.id;
    // const userID = req.user.id;

    if (!advertID) {
      return res.status(400).json({ message: 'Advert ID cant be found' })
    }
    const advert = await Advert.findById(advertID);

    if (!advert) {
      return res.status(400).json({ message: 'Cant find this Advert' })
    }

    // if (advert.user.toString() !== userID.toString()) {
    //   return res.status(400).json({ message: 'Not allowed to delete this Advert' })
    // }
    // console.log('advert.user:', advert.user);
    // console.log('userID:', userID);


    await Advert.findByIdAndDelete(advertID)
    return res.status(200).json({ message: "Product Removed", advert })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error.message })
  }
}

// function for adding  single  product
export const singleProduct = async (req, res) => {
  try {
    const productID = req.params.id
    const product = await Advert.findById(productID)
    if(!product){
      return res.status(400).json({message:'Product not found'})
    }
    res.json({ success: true, product })

  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

export const updateUserproduct = async (req, res) => {
  try {
    // const userId = req.user.id;
    const productId = req.params.id;

    const product = await Advert.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Advert not found' });
    }

    // if (product.user.toString() !== userId) {
    //   return res.status(403).json({ message: 'You are not authorized to edit this advert' });
    // }

    const updatedProduct = await Advert.findByIdAndUpdate(
      { _id: productId },
      req.body,
      { new: true }
    ).populate('user', '-password -otp');

    if (!updatedProduct) {
      return res.status(400).json({ message: 'Update failed' });
    }

    return res.status(200).json({ message: 'Updated', updatedProduct });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getAuserProduct = async (req, res) => {
  try {
    const filter = buildAdvertFilter(req.user.id, req.params.id, req.query.category, req.query.subCategory, req.query.name, req.query.price);
    const adverts = await Advert.find(filter).populate('user', '-password -otp');

    if (!adverts.length) {
      return res.status(404).json({ message: 'No matching adverts found' });
    }

    return res.status(200).json({ message: 'Matching adverts found', adverts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getalluserProduct = async (req, res) => {

  try {
    const userId = req.user.id;
    const product = await Advert.find({ user: userId }).populate('user', '-password -otp') // exclude password, otp field
    return res.status(200).json({ message: 'all Product', product })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}