import { Investor } from "../models/investorModel.js";
import { User } from "../models/user-model.js";
import { investorSchema } from "../schemas/investorSchema.js";

export const createInvestor = async (req, res) => {
    try {
        const userID = req.user.id;
        const userVerify = req.user.isVerified;
        // Validate the request body against the schema
        const { error, value } = investorSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        if (!userID) {
            return res.status(400).json({ message: "Unauthorize" });
        }

        const user = await User.findById(userID)
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        // check if the user is verified
        if (!user.isVerified) {
            return res.status(403).json({ message: "You need to verify your account before creating an investor profile" });
        }

        // Check if the user already has an investor profile
        const existing = await Investor.findOne({ user: userID });
        if (existing) {
            return res.status(409).json({ message: "Investor profile already exists" });
        }

        // Create a new investor document and associate it with the user and it investments
        const newInvestor = await Investor.create({
            ...value,
            user: userID
        });

        // to populate we need to find the investor by ID and populate the user and investments fields sice we cant do it with the create method.
        const populatedInvestor = await Investor.findById(newInvestor.id)
            .populate({ path: "user", select: "-password -otp -otpExpiresAt" })
            .populate("investments");

        return res.status(201).json({
            message: "Investor created successfully",
            investor: populatedInvestor
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const allinvestors = async (req, res) => {
    try {
        // Fetch all investors from the database with user details
        const investors = await Investor.find().populate("user", "-password -otp -otpExpiresAt");
        
        return res.status(200).json({
            message: 'All Investors available',
            investors: investors
        });
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

export const singleinvestor = async (req, res) => {
    try {
        const investorID = req.params.id;
        if (!investorID) {
            return res.status(400).json({ message: `Farm Project ID: ${investorID}, not available` });
        }

        // find investor by ID and populate user and investments
        const investor = await Investor.findById(investorID)
            .populate("user", "-password")
            .populate("investments");

        if (!investor) {
            return res.status(400).json({ message: 'Investor does not exist' })
        }
        return res.status(200).json({ message: 'Your Investor', investor });
    } catch (error) {
        return res.status(500).json({ message: error.message })
    };
};

export const deleteInvestor = async (req, res) => {
    try {
        const userID = req.user.id;
        // check the id 
        const investorID = req.params.id;
        if (!investorID) {
            return res.status(400).json({ message: `List ID: ${investorID}, not available` });
        }
        // check the availablity of that profile
        const investor = await Investor.findById(investorID);
        if (!investor) {
            return res.status(400).json({ message: 'Invalid Investor' })
        }
        // check if list belong to the user
        if (investor.user.toString() !== userID.toString()) {
            return res.status(403).json({ message: 'You are not authorized to see a list for this user' })
        }
        // Delete a profile
        const delInvestor = await Profile.findByIdAndDelete(investorID);

        return res.status(200).json({ message: 'Investor deleted Successfully', deleteInvestor: delInvestor });
    } catch (error) {
        return res.status(500).json({ message: error.message })
    };
};
