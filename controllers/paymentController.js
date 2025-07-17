// controllers/paymentController.js
import { paystack } from "../middleware/paystack.js";
import { FarmProject } from "../models/farmProjectModel.js";
import { Investment } from "../models/investmentModel.js";
import { Investor } from "../models/investorModel.js";
import { Payment } from "../models/paymentModel.js";
import { User } from "../models/user-model.js";
import { paymentSchema } from "../schemas/paymentSchema.js";

// export const initializePayment = async (req, res) => {
//     try {
//         const userID = req.user.id;
//         if (!userID) {
//             return res.status(401).json({
//                 success: false,
//                 message: "Unauthorized access"
//             });
//         }
//         const user = await User.findById(userID);
//         if (!user) {
//             return res.status(404).json({ message: "user profile not found" });
//         }
//         const investor = await Investor.findOne({user:user._id})
//         if(!investor){
//             return res.status(400).json({message:'Investor not found'})
//         }
//         const farmproject = await FarmProject.findOne({investors:investor._id})
//         if(!farmproject){
//             return res.status(400).json({message:'Farmproject Not available'})
//         }
//         const investment = await Investment.findOne({farmProject:farmproject._id})
//         if(!investment){
//             return res.status(400).json({message:'Investment not Found'})
//         }
        
//         const amounttopay = investment.amountInvested;

//         const { error, value } = paymentSchema.validate(req.body);
//         if (error) {
//             return res.status(400).json({ message: error.details[0].message })
//         }

//         const response = await paystack.post('/transaction/initialize', {
//             email: user.email,// user's email
//             amount: amounttopay * 100, // amount in pesewas (e.g. 10 GHS = 1000)
//             currency: "GHS"
//         });

//         res.status(200).json({
//             success: true,
//             message: "Payment initialization successful",
//             authorization_url: response.data.data.authorization_url,
//             reference: response.data.data.reference
//         });
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: "Payment initialization failed",
//             error: error.message
//         });
//     }
// };

export const initializePayment = async (req, res) => {
  try {
    const userID = req.user.id;

    if (!userID) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access"
      });
    }

    const user = await User.findById(userID);
    if (!user) {
      return res.status(404).json({ message: "User profile not found" });
    }

    const investor = await Investor.findOne({ user: user._id });
    if (!investor) {
      return res.status(403).json({ message: "Investor not found" });
    }

    const { error, value } = paymentSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const investment = await Investment.findById(value.investmentId).populate('farmProject');
    if (!investment) {
      return res.status(404).json({ message: "Investment not found" });
    }

    if (!investment.farmProject) {
      return res.status(404).json({ message: "Farm Project not linked to investment" });
    }

    const amounttopay = investment.amountInvested;

    const response = await paystack.post('/transaction/initialize', {
      email: user.email,
      amount: amounttopay * 100,
      currency: "GHS"
    });

    return res.status(200).json({
      success: true,
      message: "Payment initialization successful",
      authorization_url: response.data.data.authorization_url,
      reference: response.data.data.reference
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Payment initialization failed",
      error: error.message
    });
  }
};



export const verifyPayment = async (req, res) => {
    const { reference, investmentId } = req.body;

    try {
        // checks if the reference provided matches what is in the paystack database.....so in transaction, verify the reference.
        const response = await paystack.get(`/transaction/verify/${reference}`);

        const data = response.data.data;

        if (data.status === 'success') {
            // Save to DB
            const payment = await Payment.create({
                investmentId,
                amount: data.amount / 100,
                method: data.channel,
                status: data.status, // or manually set "success"
                transactionId: data.id,
                date: new Date()
            });

            // Update investment paymentStatus
            await Investment.findByIdAndUpdate(investmentId, {
                paymentStatus: data.status // will be "success"
            });

            return res.status(200).json({
                success: true,
                message: 'Payment verified successfully',
                payment
            });
        } else {
            return res.status(400).json({
                success: false,
                message: 'Payment not successful'
            });
        }
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Payment verification failed",
            error: err.message
        });
    }
};


export const getUserPayments = async (req, res) => {
    try {
        const userId = req.user.id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized access"
            });
        }

        // find the investor whoes user field matches the authenticated user
        const investor = await Investor.findOne({ user: userId });
        if (!investor) {
            return res.status(404).json({ message: "Investor profile not found" });
        }

        const payments = await Payment.find()
            .populate({
                path: "investmentId",
                match: { investor: investor._id }, // Filter payments by the investor's ID....this optonal
                populate: {
                    path: "investor", // From Investment model
                    populate: {
                        path: "user", // From Investor model
                        select: "-password -otp -otpExpiresAt" // Exclude sensitive fields
                    },
                },
            });

        // Filter out payments where investmentId didn't match (i.e. not the user's)
        const userPayments = payments.filter(payment => payment.investmentId !== null);

        res.status(200).json({
            success: true,
            count: userPayments.length,
            data: userPayments
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch user payments",
            error: err.message
        });
    }
};