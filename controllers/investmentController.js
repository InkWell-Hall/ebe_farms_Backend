
import { FarmProject } from "../models/farmProjectModel.js";
import { Investment } from "../models/investmentModel.js";
import { Investor } from "../models/investorModel.js";
import { investmentSchema } from "../schemas/investmentSchema.js";


export const createInvestment = async (req, res) => {
    try {
        const userID = req.user.id;

        if (!userID) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        // Validate the request
        const { error, value } = investmentSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        // details needed in the body to create an investment
        const { farmProject, amountInvested } = value;

        // find the investor whoes user field matches the authenticated user
        const investor = await Investor.findOne({ user: userID });
        if (!investor) {
            return res.status(404).json({ message: "Investor profile not found" });
        }

        // Validate farm project exists
        const project = await FarmProject.findById(farmProject);
        if (!project) {
            return res.status(404).json({ message: "Farm project not found" });
        }

        // Check if the project is still active
        if (project.isActive === false) {
            return res.status(400).json({ message: "Farm project is closed, choose a different project" });
        }

        const ROI = project.estimatedROI / 100

        // ROI Calculations.....total amount invested plus expected return on investment
        const expectedROI = amountInvested * ROI; // taking ROI from the farmproject
        const totalReturn = amountInvested + expectedROI;

        // Before investment creation
        if (project.receivedFunding + amountInvested > project.totalRequiredFunding) {
            return res.status(400).json({ message: "Investment exceeds required funding for this farm project" });
        }

        project.receivedFunding += amountInvested;
        project.investors.push(investor.id);
         // Close project if fully funded
        if (project.receivedFunding === project.totalRequiredFunding) {
            project.isActive = false;
        }
        await project.save();

        // Create investment
        const newInvestment = await Investment.create({
            farmProject,
            amountInvested,
            expectedROI,
            totalReturn,
            investor: investor.id,
            dateOfInvestment: new Date(),
        });


        // if (Number(project.receivedFunding) === Number(project.totalRequiredFunding)) {
        //     return res.status(400).json({ message: "Received Maximum funding for this project" });
        // }

        // Close the project
        // project.isActive = false;
        // await project.save();

        // Populate and return the full investment
        const populatedInvestment = await Investment.findById(newInvestment.id)
            .populate("investor", "user")
            .populate("farmProject");

        return res.status(201).json({
            message: "Investment created successfully",
            investment: populatedInvestment,
        });

    } catch (error) {
        console.error("Create Investment Error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const allinvestment = async (req, res) => {
    try {
        // Fetch all investors from the database with user details
        const investment = await Investment.find().populate("investor", "user").populate("farmProject");
        if (investment.length === 0) {
            return res.status(404).json({ message: "No investments found" });
        }
        return res.status(200).json({
            message: 'All Investors available',
            investment
        });
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

export const userInvestment = async (req, res) => {
    try {
        const userID = req.user.id;
        if (!userID) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        // Find investor profile
        const investor = await Investor.findOne({ user: userID });
        if (!investor) {
            return res.status(404).json({ message: "Investor profile not found" });
        }

        // Find and populate all investments by that investor
        const investments = await Investment.find({ investor: investor.id })
            .populate("farmProject")
            .populate({
                path: "investor",
                populate: {
                    path: "user",
                    select: "-password -otp -otpExpiresAt"
                },
                select: "-investments"
            });

        if (investments.length === 0) {
            return res.status(404).json({ message: "No investments found for this user" });
        }

        // ✅ Calculate total amount invested
        const totalInvested = investments.reduce((sum, investment) => {
            return sum + investment.amountInvested;
        }, 0);

        return res.status(200).json({
            message: "All investments for this user",
            totalInvested,
            investments,
        });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


export const singleinvestment = async (req, res) => {
    try {
        const investmentID = req.params.id;
        if (!investmentID) {
            return res.status(400).json({ message: `Investment ID: ${investmentID}, not available` });
        }

        // find investor by ID and populate user and investments
        const investment = await Investment.findById(investmentID)
            .populate("farmProject")
            .populate({
                path: "investor",
                populate: {
                    path: "user",
                    select: "-password -otp -otpExpiresAt"
                },
                select: "-investments"
            });

        if (!investment) {
            return res.status(400).json({ message: 'Investment does not exist' })
        }
        return res.status(200).json({ message: 'Your Investment', investment });
    } catch (error) {
        return res.status(500).json({ message: error.message })
    };
};

export const deleteInvestment = async (req, res) => {
    try {
        const userID = req.user.id;
        if (!userID) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        // check the id 
        const investmentID = req.params.id;
        if (!investmentID) {
            return res.status(400).json({ message: `Investment ID: ${investmentID}, not available` });
        }

        // check the availablity of that investment
        const investment = await Investment.findById(investmentID);
        if (!investment) {
            return res.status(400).json({ message: 'Invalid Investor' })
        }

        // Find investor profile
        const investor = await Investor.findOne({ user: userID });
        if (!investor) {
            return res.status(404).json({ message: "Investor profile not found" });
        }

        // check if list belong to the user
        if (investment.investor.toString() !== investor.id.toString()) {
            return res.status(403).json({ message: 'You are not authorized to see a list for this user' })
        }

        // Delete a profile
        const delInvestment = await Investment.findByIdAndDelete(investmentID);

        // Remove the investment from the investor's investments array
        investor.investments = investor.investments.filter(
            (invId) => invId.toString() !== investmentID
        );
        await investor.save();

        // subtract amount from the farm project's receivedFunding
        const farmProject = await FarmProject.findById(investment.farmProject);
        if (farmProject) {
            farmProject.receivedFunding -= investment.amountInvested;
            if (farmProject.receivedFunding < 0) farmProject.receivedFunding = 0;
            await farmProject.save();
        }

        return res.status(200).json({ message: 'Investment deleted Successfully', deleteInvestment: delInvestment });
    } catch (error) {
        return res.status(500).json({ message: error.message })
    };
};