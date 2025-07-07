import { Profile } from "../models/profileModel.js";
import { profileSchema } from "../schemas/profileSchema.js";


export const createProfile = async (req, res) => {
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


        const profile = await (
            await Profile.create({
                ...value,
                user: userID, // Make sure you're including the user here
                images: imageUrls
            })
        ).populate("user", "-password -otp");

        return res.status(201).json({ message: "Profile has been created succesfully", profile });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


export const updateProfile = async (req, res) => {
    try {
        const userID = req.user.id;
        // check the id 
        const profileID = req.params.id;
        if (!profileID) {
            return res.status(400).json({ message: `List ID: ${profileID}, not available` });
        }
        // check the availablity of that list
        const profile = await Profile.findById(profileID);
        if (!profile) {
            return res.status(400).json({ message: 'Invalid Profile' })
        }
        // check if list belong to the user
        if (profile.user.toString() !== userID.toString()) {
            return res.status(403).json({ message: 'You are not authorized to see a list for this user' })
        }
        // upadate a list
        const newProfile = await Profile.findByIdAndUpdate(
            profileID,
            req.body,
            { new: true }
        );
        return res.status(200).json({ message: 'Profile is updated Successfully', udateProfile: newProfile });
    } catch (error) {
        return res.status(500).json({ message: error.message })
    };
};

export const deleteProfile = async (req, res) => {
    try {
        const userID = req.user.id;
        // check the id 
        const profileID = req.params.id;
        if (!profileID) {
            return res.status(400).json({ message: `List ID: ${profileID}, not available` });
        }
        // check the availablity of that profile
        const profile = await Profile.findById(profileID);
        if (!profile) {
            return res.status(400).json({ message: 'Invalid Profile' })
        }
        // check if list belong to the user
        if (profile.user.toString() !== userID.toString()) {
            return res.status(403).json({ message: 'You are not authorized to see a list for this user' })
        }
        // Delete a profile
        const delProfile = await Profile.findByIdAndDelete(profileID);
        return res.status(200).json({ message: 'Profile is deleted Successfully', deleteProfile: delProfile });
    } catch (error) {
        return res.status(500).json({ message: error.message })
    };
};

export const allProfile = async (req, res) => {
    try {
        const allProfile = await Profile.find();
        return res.status(200).json({ message: 'All profiles available', allProfile });
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}