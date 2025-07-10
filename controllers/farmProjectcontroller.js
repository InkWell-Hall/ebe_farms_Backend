import { FarmProject } from "../models/farmProjectModel.js";
import { Investment } from "../models/investmentModel.js";
import { Investor } from "../models/investorModel.js";
import { farmProjectSchema } from "../schemas/farmProjectSchema.js";


export const createFarmproject = async (req, res) => {
    try {
        const userID = req.user.id
        // Step 1: Extract image URLs
        const imageUrls = req.files?.map(file => file.path) || [];

        // Step 2: Add to the data before validating
        const dataToValidate = { ...req.body, images: imageUrls };

        // Step 3: Validate
        const { error, value } = farmProjectSchema.validate(dataToValidate);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        // ✅ Add imageUrls to validated data
        value.images = imageUrls;

        const farm = await FarmProject.create({
            ...value
            // user: req.user.id, // Make sure you're including the user here
        })//.populate("investor", "-password -otp");

        return res.status(201).json({ message: "Farm Project has been created succesfully", farm });
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

// export const userFarmproject = async (req, res) => {
//   try {
//     const farmProjectID = req.params.id;
//     if (!farmProjectID) {
//       return res.status(400).json({ message: `Farm Project ID not provided` });
//     }

//     // Check if farm project exists
//     const farm = await FarmProject.findById(farmProjectID);
//     if (!farm) {
//       return res.status(404).json({ message: "Farm project not found" });
//     }

//     // Find all investments related to this farm project
//     const investments = await Investment.find({ farmProject: farmProjectID })
//       .populate({
//         path: "investor",
//         populate: {
//           path: "user",
//           select: "-password -otp -otpExpiresAt"
//         }
//       })
//       .populate("farmProject");

//     if (investments.length === 0) {
//       return res.status(404).json({ message: "No users have invested in this farm project" });
//     }

//     // Calculate total amount invested
//     const totalInvested = investments.reduce((sum, inv) => sum + inv.amountInvested, 0);

//     return res.status(200).json({
//       message: "Users who invested in this farm project",
//       totalInvested,
//       investments
//     });

//   } catch (error) {
//     return res.status(500).json({ message: error.message });
//   }
// };

export const userFarmproject = async (req, res) => {
    try {
        const farmProjectID = req.params.id;
        if (!farmProjectID) {
            return res.status(400).json({ message: "Farm Project ID not provided" });
        }

        // Check if farm project exists
        const farm = await FarmProject.findById(farmProjectID);
        if (!farm) {
            return res.status(404).json({ message: "Farm project not found" });
        }

        // Get all investments for this farm
        const investments = await Investment.find({ farmProject: farmProjectID });

        if (investments.length === 0) {
            return res.status(404).json({ message: "No investments found for this farm project" });
        }

        // Extract unique investor IDs from investments
        const uniqueInvestorIds = [
            ...new Set(investments.map((investment) => investment.investor.toString()))
        ];

        // Fetch those investors and populate the user
        const investors = await Investor.find({ _id: { $in: uniqueInvestorIds } })
            .populate({
                path: "user",
                select: "-password -otp -otpExpiresAt"
            });

        // Optional: total amount invested
        const totalInvested = investments.reduce((sum, investment) => sum + investment.amountInvested, 0);

        return res.status(200).json({
            message: "investors for this farm project",
            totalInvested,
            totalInvestors: investors.length,// count the number investors who invested in that farm project
            investors
        });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const closeFarmProject = async (req, res) => {
  try {
    const farmProjectID = req.params.id;

    if (!farmProjectID) {
      return res.status(400).json({ message: "Farm Project ID not provided" });
    }

    const farm = await FarmProject.findById(farmProjectID);

    if (!farm) {
      return res.status(404).json({ message: "Farm project not found" });
    }

    if (Number(farm.receivedFunding) < Number(farm.totalRequiredFunding)) {
      return res.status(400).json({ message: "Farm project is still available for funding" });
    }

    // Close the project
    farm.isActive = false;
    await farm.save();

    return res.status(200).json({ message: "Farm project closed successfully", farm });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
