import { FarmProject } from "../models/farmProjectModel.js";
import { farmProjectJoiSchema } from "../schemas/farmProjectSchema.js";


export const createFarmproject = async (req, res) => {
    try {
        const userID = req.user.id
        // Step 1: Extract image URLs
        const imageUrls = req.files?.map(file => file.path) || [];

        // Step 2: Add to the data before validating
        const dataToValidate = { ...req.body, images: imageUrls };

        // Step 3: Validate
        const { error, value } = profileSchema.validate(dataToValidate);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        // ✅ Add imageUrls to validated data
        value.images = imageUrls;

        const farm = await FarmProject.create({
            ...value
            // user: req.user.id, // Make sure you're including the user here
        })//.populate("investor", "-password -otp");

        return res.status(201).json({ message: "Farm Project has been created succesfully", profile });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const singleFarmProject = async (req, res) => {
    try {
        const farmProjectID = req.params.id;
        if (!farmProjectID) {
            return res.status(400).json({ message: `Farm Project ID: ${farmProjectID}, not available` });
        }
        const farm = await FarmProject.findById(farmProjectID);
        if (!farm) {
            return res.status(400).json({ message: 'Farm Project does not exist' })
        }
        return res.status(200).json({ message: 'Your Farm Project', farm });
    } catch (error) {
        return res.status(500).json({ message: error.message })
    };
};

export const allFarmProject = async (req, res) => {
    try {
        // we set limit to toa page(pagination)
        const page = req.query.page || 1;
        const limit = req.query.limit || 10;
        const skip = (page - 1) * limit;

        // search find all farm project with a limit of 10 per a page
        const farm = await FarmProject.find().skip(skip).limit(limit);

        // total count of all the farm project
        const totalCount = await TodoList.countDocuments({});
        // this gives a number of list (10) to a page
        const totalPages = Math.ceil(totalCount / limit);

        // return a message if there is no list
        if (farm.length == 0) {
            return res.status(400).json({ message: 'There are no farm project' })
        };

        return res.status(200).json({
            message: 'Your Farm Project',
            farm,
            pagination: {
                currentPage: page,
                totalPages,
                totalCount,
            },
        });
    } catch (error) {
        return res.status(500).json({ message: error.message })
    };
};



export const updateFarmproject = async (req, res) => {
    try {
        // const userID = req.user.id;
        // check the id 
        const farmProjectID = req.params.id;
        if (!farmProjectID) {
            return res.status(400).json({ message: `Farm Project ID: ${farmProjectID}, not available` });
        }
        // check the availablity of that list
        const farm = await FarmProject.findById(farmProjectID);
        if (!farm) {
            return res.status(400).json({ message: 'Farm Project does not exist' })
        }
        // check if list belong to the user
        // if (profile.user.toString() !== userID.toString()) {
        //     return res.status(403).json({ message: 'You are not authorized to see a list for this user' })
        // }

        // upadate a list
        const newfarmProject = await FarmProject.findByIdAndUpdate(
            farmProjectID,
            req.body,
            { new: true }
        );
        return res.status(200).json({ message: 'Farm Project updated Successfully', updateFarmproject: newfarmProject });
    } catch (error) {
        return res.status(500).json({ message: error.message })
    };
};

export const deleteFarmproject = async (req, res) => {
    try {
        // const userID = req.user.id;
        // check the id 
        const farmProjectID = req.params.id;
        if (!farmProjectID) {
            return res.status(400).json({ message: `Farm Project ID: ${farmProjectID}, not available` });
        }
        // check the availablity of that list
        const farm = await FarmProject.findById(farmProjectID);
        if (!farm) {
            return res.status(400).json({ message: 'Farm Project does not exist' })
        }
        // check if list belong to the user
        // if (profile.user.toString() !== userID.toString()) {
        //     return res.status(403).json({ message: 'You are not authorized to see a list for this user' })
        // }

        // delete a farmProject
        const newfarmProject = await FarmProject.findByIdAndDelete(farmProjectID);
        return res.status(200).json({ message: 'Farm Project deleted Successfully', farm });
    } catch (error) {
        return res.status(500).json({ message: error.message })
    };
};