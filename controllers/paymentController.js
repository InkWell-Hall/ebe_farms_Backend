// controllers/paymentController.js
import { paystack } from "../middleware/paystack.js";
import { Cart } from "../models/cart_model.js";
import { FarmProject } from "../models/farmProjectModel.js";
import { Investment } from "../models/investmentModel.js";
import { Investor } from "../models/investorModel.js";
import { Order } from "../models/order_model.js";
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

// without inputing investmentid and amount
// export const initializePayment = async (req, res) => {
//   try {
//     const userID = req.user.id;

//     if (!userID) {
//       return res.status(401).json({
//         success: false,
//         message: "Unauthorized access"
//       });
//     }

//     const user = await User.findById(userID);
//     if (!user) {
//       return res.status(404).json({ message: "User profile not found" });
//     }

//     const investor = await Investor.findOne({ user: user._id });
//     if (!investor) {
//       return res.status(403).json({ message: "Investor not found" });
//     }

//     const { error, value } = paymentSchema.validate(req.body);
//     if (error) {
//       return res.status(400).json({ message: error.details[0].message });
//     }

//     const investment = await Investment.findById(value.investmentId).populate('farmProject');
//     if (!investment) {
//       return res.status(404).json({ message: "Investment not found" });
//     }

//     if (!investment.farmProject) {
//       return res.status(404).json({ message: "Farm Project not linked to investment" });
//     }

//     const amounttopay = investment.amountInvested;

//     const response = await paystack.post('/transaction/initialize', {
//       email: user.email,
//       amount: amounttopay * 100,
//       currency: "GHS"
//     });

//     return res.status(200).json({
//       success: true,
//       message: "Payment initialization successful",
//       authorization_url: response.data.data.authorization_url,
//       reference: response.data.data.reference
//     });

//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: "Payment initialization failed",
//       error: error.message
//     });
//   }
// };

// export const initializePayment = async (req, res) => {
//   try {
//     const userID = req.user.id;

//     if (!userID) {
//       return res.status(401).json({
//         success: false,
//         message: "Unauthorized access",
//       });
//     }

//     // Validate request body (should contain investmentId, at least)
//     const { error, value } = paymentSchema.validate(req.body);
//     if (error) {
//       return res.status(400).json({ message: error.details[0].message });
//     }

//     const { investmentId } = value;

//     const user = await User.findById(userID);
//     if (!user) {
//       return res.status(404).json({ message: "User profile not found" });
//     }

//     const investor = await Investor.findOne({ user: user._id });
//     if (!investor) {
//       return res.status(404).json({ message: "Investor not found" });
//     }

//     const investment = await Investment.findOne({
//       _id: investmentId,
//       investor: investor._id,
//     });

//     if (!investment) {
//       return res.status(404).json({ message: "Investment not found" });
//     }

//     const amounttopay = investment.amountInvested;

//     // Call Paystack
//     const response = await paystack.post("/transaction/initialize", {
//       email: user.email,
//       amount: amounttopay * 100, // Paystack expects amount in pesewas
//       currency: "GHS",
//     });

//     // Return response to frontend
//     res.status(201).json({
//       success: true,
//       message: "Payment initialization successful",
//       authorization_url: response.data.data.authorization_url,
//       reference: response.data.data.reference,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Payment initialization failed",
//       error: error.message,
//     });
//   }
// };

// export const verifyPayment = async (req, res) => {
//     const { reference, investmentId } = req.body;

//     try {
//         // checks if the reference provided matches what is in the paystack database.....so in transaction, verify the reference.
//         const response = await paystack.get(`/transaction/verify/${reference}`);

//         const data = response.data.data;

//         if (data.status === 'success') {
//             // Save to DB
//             const payment = await Payment.create({
//                 investmentId,
//                 amount: data.amount / 100,
//                 method: data.channel,
//                 status: data.status, // or manually set "success"
//                 transactionId: data.id,
//                 date: new Date()
//             });

//             // Update investment paymentStatus
//             await Investment.findByIdAndUpdate(investmentId, {
//                 paymentStatus: data.status // will be "success"
//             });

//             return res.status(200).json({
//                 success: true,
//                 message: 'Payment verified successfully',
//                 payment
//             });
//         } else {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Payment not successful'
//             });
//         }
//     } catch (err) {
//         res.status(500).json({
//             success: false,
//             message: "Payment verification failed",
//             error: err.message
//         });
//     }
// };


// export const getUserPayments = async (req, res) => {
//     try {
//         const userId = req.user.id;
//         if (!userId) {
//             return res.status(401).json({
//                 success: false,
//                 message: "Unauthorized access"
//             });
//         }

//         // find the investor whoes user field matches the authenticated user
//         const investor = await Investor.findOne({ user: userId });
//         if (!investor) {
//             return res.status(404).json({ message: "Investor profile not found" });
//         }

//         const payments = await Payment.find()
//             .populate({
//                 path: "investmentId",
//                 match: { investor: investor._id }, // Filter payments by the investor's ID....this optonal
//                 populate: {
//                     path: "investor", // From Investment model
//                     populate: {
//                         path: "user", // From Investor model
//                         select: "-password -otp -otpExpiresAt" // Exclude sensitive fields
//                     },
//                 },
//             });

//         // Filter out payments where investmentId didn't match (i.e. not the user's)
//         const userPayments = payments.filter(payment => payment.investmentId !== null);

//         res.status(200).json({
//             success: true,
//             count: userPayments.length,
//             data: userPayments
//         });
//     } catch (err) {
//         res.status(500).json({
//             success: false,
//             message: "Failed to fetch user payments",
//             error: err.message
//         });
//     }
// };

export const initializePayment = async (req, res) => {
  try {
    const userID = req.user.id;
    const { error, value } = paymentSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { investmentId, orderId } = value;
    const user = await User.findById(userID);
    if (!user) return res.status(404).json({ message: "User not found" });

    let amount = 0;
    let metadata = { userId: userID };

    if (investmentId) {
      const investor = await Investor.findOne({ user: user._id });
      if (!investor) return res.status(404).json({ message: "Investor not found" });

      const investment = await Investment.findOne({ _id: investmentId, investor: investor._id });
      if (!investment) return res.status(404).json({ message: "Investment not found" });

      amount = investment.amountInvested;
      metadata.investmentId = investment._id;

    } else if (orderId) {
      const order = await Order.findById(orderId);
      if (!order || order.user.toString() !== userID) {
        return res.status(400).json({ message: "Invalid order" });
      }

      amount = order.amount;
      metadata.orderId = order._id;

    } else {
      return res.status(400).json({ message: "Provide investmentId or orderId" });
    }

    // Call Paystack
    const response = await paystack.post("/transaction/initialize", {
      email: user.email,
      amount: amount * 100,
      currency: "GHS",
      metadata,
    });

    res.status(201).json({
      success: true,
      message: "Payment initialized successfully",
      authorization_url: response.data.data.authorization_url,
      reference: response.data.data.reference,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Payment initialization failed",
      error: err.message,
    });
  }
};



export const verifyPayment = async (req, res) => {
  const { reference, investmentId } = req.body;

  try {
    // 1. Verify the transaction with Paystack
    const response = await paystack.get(`/transaction/verify/${reference}`);
    const data = response.data.data;

    if (data.status === 'success') {
      // 2. Save payment to DB
      const payment = await Payment.create({
        investmentId,
        amount: data.amount / 100,
        method: data.channel,
        status: data.status,
        transactionId: data.id,
        date: new Date()
      });

      // 3. Update investment with status
      const investment = await Investment.findByIdAndUpdate(
        investmentId,
        { paymentStatus: data.status },
        { new: true } // so you can access updated doc
      ).populate('farmProject'); // populate to access farmProject details

      // 4. Update FarmProject remaining funding amount
      const farmProject = investment.farmProject;

      // Add the payment to receivedFunding
      // farmProject.receivedFunding += payment.amount;

      const remaining = farmProject.totalRequiredFunding - farmProject.receivedFunding;

      await FarmProject.findByIdAndUpdate(farmProject._id, {
        remainingFundingAmount: remaining
      });

      return res.status(200).json({
        success: true,
        message: 'Payment verified and processed successfully',
        payment
      });
    } else {
      return res.status(400).json({
        success: false,
        message: 'Payment not successful'
      });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Payment verification failed',
      error: err.message
    });
  }
};


export const verifyOrderPayment = async (req, res) => {
    const { reference, orderId } = req.body;

    try {
        // checks if the reference provided matches what is in the paystack database.....so in transaction, verify the reference.
        const response = await paystack.get(`/transaction/verify/${reference}`);

        const data = response.data.data;

        if (data.status === 'success') {
            // Save to DB
            const payment = await Payment.create({
                orderId,
                amount: data.amount / 100,
                method: data.channel,
                status: data.status, // or manually set "success"
                transactionId: data.id,
                date: new Date()
            });

            // Update investment paymentStatus
            await Order.findByIdAndUpdate(orderId, {
                status: data.status,
                payment: true // will be "success"
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

    const investor = await Investor.findOne({ user: userId });
    const payments = await Payment.find({
      $or: [
        { "investmentId": { $exists: true } },
        { "orderId": { $exists: true } }
      ]
    }).populate([
      {
        path: "investmentId",
        match: investor ? { investor: investor._id } : {},
        populate: {
          path: "investor",
          populate: { path: "user", select: "-password" }
        },
      },
      {
        path: "orderId",
        populate: {
          path: "cart",
          populate: { path: "items.advert" }
        },
      }
    ]);

    const userPayments = payments.filter(p => {
      return (p.investmentId || (p.orderId && String(p.orderId.user) === String(userId)));
    });

    res.status(200).json({
      success: true,
      count: userPayments.length,
      data: userPayments
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch user payments",
      error: err.message,
    });
  }
};
