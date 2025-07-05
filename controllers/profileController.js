import { Profile } from "../models/profileModel.js";
import { profileSchema } from "../schemas/profileSchema.js";


export const createProfile = async (req, res) => {
    try {
        const userID = req.user.id
        // validate
        const { error, value } = profileSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        // checks if it the same user
        if(userID.toString() !== value.user.toString()){
            return res.status(401).json({message:'you are not authorize to create a profile'})
        }

        // ✅ Extract image URLs from Cloudinary upload (via Multer)
        const imageUrls = req.files?.map(file => file.path) || [];

        // ✅ Add imageUrls to validated data
        value.images = imageUrls;

        const profile = await (
            await Profile.create({
                ...value,
                user: req.user.id, // Make sure you're including the user here
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

