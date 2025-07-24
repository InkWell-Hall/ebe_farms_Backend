// import { Cart } from "../models/cart_model.js";
// import { Order } from "../models/order_model.js"
// import { orderSchema } from "../schemas/orders_Schema.js"


// export const newOrder = async (req, res) => {
//     try {
//         const userId = req.user.id;

//         // Validate the request body against the order schema
//         const { error, value } = orderSchema.validate(req.body);

//         if (error) {
//             return res.status(400).json({ message: error.details[0].message });
//         }

//         if (!value || !value.cart) {
//             return res.status(400).json({ message: 'Cart ID is required' });
//         }

//         // Check if the cart exists and belongs to the authenticated user
//         const cart = await Cart.findById(value.cart);
//         if (!cart) {
//             return res.status(404).json({ message: 'Cart not found' });
//         }
//         if (cart.user.toString() !== userId) {
//             return res.status(401).json({ message: 'Unauthorized to order from this cart' });
//         }

//         // Create the order
//         const order = await Order.create({
//             ...value,
//             user: userId,
//             date: Date.now(),
//             amount: cart.totalAmount // assign totalAmount to amount field
//         });
//         const populatedOrder = await Order.findById(order._id)
//             .populate('user', '-password -otp') // exclude password, otp field
//             .populate({
//                 path: 'cart',
//                 populate: {
//                     path: 'items.advert',
//                 }
//             });
//         return res.status(201).json({ message: 'Order Made Successful', order: populatedOrder });
//     } catch (error) {
//         return res.status(500).json({ message: error.message });
//     }
// };




// export const getOrders = async (req, res) => {
//     try {
//         const userId = req.user.id;
//         const orders = await Order.find({ user: userId })
//             .populate('user', '-password -otp') // exclude password, otp field
//             .populate({
//                 path: 'cart',
//                 populate: {
//                     path: 'items.advert',
//                 }
//             });
//         return res.status(200).json({ orders });
//     } catch (error) {
//         return res.status(500).json({ message: error.message });
//     }
// };

// export const getOneOrder = async (req, res) => {
//     try {
//         const userId = req.user.id;
//         const orderId = req.params.id;
//         if (!orderId) {
//             return res.status(400).json({ message: 'order ID is required' })
//         }
//         const order = await Order.findOne({ _id: orderId, user: userId })
//             .populate('user', '-password -otp')
//             .populate({
//                 path: 'cart',
//                 populate: {
//                     path: 'items.advert',
//                 },
//             });

//         if (!order) {
//             return res.status(404).json({ message: 'Order not found' });
//         }
//         return res.status(200).json({ order });
//     } catch (error) {
//         return res.status(500).json({ message: error.message });
//     }
// };




// //Global variables
// const currency = "usd"
// const deliveryCharge = 10
// //GATEWAY INITIALIZE
// const stripe = new Stripe(STRIPE_SECRET_KEY)


// //placing orders using COD method
// const placeOrder = async (req, res) => {
//   try {
//     const { userId, items, amount, address } = req.body;


//     const orderData = {
//       userId,
//       items,
//       amount,
//       address,
//       paymentMethod: "COD",
//       payment: false,
//       date: Date.now(),
//     };

//     const newOrder = new orderModel(orderData);
//     await newOrder.save();

//     await User.findByIdAndUpdate(userId, { cartData: {} });
//     res.json({ success: true, message: "Order Placed" });
//   } catch (error) {
//     console.log(error);
//     res.json({ success: false, message: error.message });
//   }
// };

// //placing orders using Stripe method
// const placeOrderStripe = async (req, res) => {
//   try {

//     const { userId, items, amount, address } = req.body;
//     const { origin } = req.headers;


//     const orderData = {
//       userId,
//       items,
//       amount,
//       address,
//       paymentMethod: "Stripe",
//       payment: false,
//       date: Date.now(),
//     };

//     const newOrder = new orderModel(orderData);
//     await newOrder.save();

//     const line_items = items.map((item) => ({
//       price_data: {
//         currency: currency,
//         product_data: {
//           name: item.name
//         },
//         unit_amount: item.price * 100
//       },
//       quantity: item.quantity
//     }))

//     line_items.push({
//       price_data: {
//         currency: currency,
//         product_data: {
//           name: "Delivery Charges"
//         },
//         unit_amount: deliveryCharge * 100
//       },
//       quantity: 1
//     });

//     const session = await stripe.checkout.sessions.create({
//       success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
//       cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
//       line_items,
//       mode: "payment",
//     })

//     res.json({ success: true, session_url: session.url })
//   } catch (error) {
//     console.log(error);
//     res.json({ success: false, message: error.message });
//   }
// };

// //Verify stripe
// const verifyStripe = async (req, res) => {
//   const { orderId, success, userId } = req.body
//   try {
//     if (success === "true") {
//       await orderModel.findByIdAndUpdate(orderId, { payment: true });
//       await User.findByIdAndUpdate(userId, { cartData: {} })
//       res.json({ success: true });
//     } else {
//       await orderModel.findByIdAndDelete(orderId)
//       res.json({ success: false })
//     }
//   } catch (error) {
//     console.log(error);
//     res.json({ success: false, message: error.message });
//   }
// }

// //placing orders using RazorPay method
// const placeOrderRazorpay = async (req, res) => { };
import { sendDeliveryEmail } from "../utils/mail.js";
import { Advert } from "../models/advert_model.js";
import orderModel from "../models/new_order-model.js";
import { Order } from "../models/order_model.js";


// import Stripe from "stripe";
import { User } from "../models/user-model.js";
import { Cart } from "../models/cart_model.js";


export const createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { cartId, address, paymentMethod, firstname,lastname,city,country,street,zipcode,phone,state } = req.body;

    if (!userId || !cartId || !address || !paymentMethod ||!firstname ||!lastname ||!city ||!country ||!street ||!zipcode ||!phone ||!state) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const cart = await Cart.findById(cartId)
      .populate("items.advert") // make sure this matches your schema
      .exec();

    if (!cart || !cart.items || cart.items.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Cart is empty or not found",
      });
    }

    // Calculate totalAmount
    let totalAmount = 0;
    for (const item of cart.items) {
      if (!item.advert) {
        return res.status(400).json({
          success: false,
          message: "One or more products in your cart were not found",
        });
      }
      totalAmount += item.advert.price * item.quantity;
    }

    // Create Order
    const order = new Order({
      cart: cart._id,
      user: userId,
      address,
      firstname,
      lastname,
      city,
      country,
      zipcode,
      phone,
      state,
      paymentMethod,
      amount: totalAmount,
      payment: false,
      date: Date.now(),
    });

    await order.save();

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    console.error("Create Order Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create order",
      error: error.message,
    });
  }
};

//All orders data for admin panel
const allOrders = async (req, res) => {
  try {

    const orders = await orderModel.find({})
    res.json({ success: true, orders })

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const getVendorOrdersAcrossAdverts = async (req, res) => {
  try {
    const vendorId = req.params.id;

    // 1. Confirm the vendor exists
    const vendor = await User.findById(vendorId);
    if (!vendor) {
      return res.status(404).json({ success: false, message: "Vendor not found" });
    }

    // 2. Find all adverts created by this vendor
    const adverts = await Advert.find({ user: vendorId });

    // 3. Extract all advert IDs
    const advertIds = adverts.map(ad => ad._id);

    // 4. Find orders that reference any of these advert IDs
    const orders = await Order
      .find({ advertId: { $in: advertIds } })
      .populate("userId", "userName email")      // buyer details
      .populate("advertId", "name price image"); // advert details

    // 5. Send response
    res.status(200).json({
      success: true,
      vendor: {
        id: vendor._id,
        name: vendor.userName,
        email: vendor.email
      },
      totalAdverts: adverts.length,
      totalOrders: orders.length,
      orders
    });

  } catch (error) {
    console.error("Error in getVendorOrdersAcrossAdverts:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};


//update order status for admin panel
const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body

    // updates status
    const order = await orderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    ).populate('userId');

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }
    res.json({ success: true, message: "Status Updated" })

    if (status.toString() === "Out for Delivery") {
      const email = order.userId.email
      if (email) {
        await sendDeliveryEmail(email);
        console.log("📦 Delivery message sent to email:", email);
      } else {
        console.log("⚠️ No email found for user.");
      }
    }

  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export {
  updateStatus,
  getVendorOrdersAcrossAdverts,
  allOrders,
};

export const orderbyID = async(req,res)=>{
  try {
    const orderID = req.params.id
    const findOrder = await orderModel.findById(orderID);
    if(!findOrder){
      return res.status(400).json({message:'Order not found'})
    }
    return res.status(200).json({message:'Your Order',findOrder})
  } catch (error) {
    return res.status(500).json({message:error.message})
  }
}