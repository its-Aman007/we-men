import { response } from "express";
import orderModel from "../models/orderModel.js";
import Order from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from 'stripe'

// Global Variables
const currency='USD'
const Delivery_fee=10

// Payment Gateway
const stripe=new Stripe(process.env.STRIPE_SECRET_KEY)

// order by Cod

const placeOrder=async (req, res) => {
    try {
        const userId = req.userId;
        const { orderItems, cartData, amount, address } = req.body;

        const orderData = new Order({
            userId,
            items: orderItems,
            amount,
            address,
            paymentMethod: "COD",
            payment: false,
            date: Date.now()
        });

        const newOrder=new Order(orderData);
        await newOrder.save();
        await userModel.findByIdAndUpdate(userId,{cartData:{}});

        res.json({ success: true, message: "Order placed successfully" });
        
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }

}

// order by online payment

const placeorderStripe=async (req, res) => {
    try {
        const userId=req.userId
        const {orderItems,amount,address}=req.body
        const {origin}=req.headers

        const orderData = new Order({
            userId,
            items:orderItems,
            amount,
            address,
            paymentMethod: "Stripe",
            payment: false,
            date: Date.now()
        });
        const newOrder= new orderModel(orderData)
        await newOrder.save()

        const line_items = orderItems.map((item) => ({
    price_data: {
        currency: currency,
        product_data: {
            name: item.name|| "Product"
        },
        unit_amount: (item.price|| item.new_price||0 )* 100
    },
    quantity: item.quantity||1
}));
        line_items.push({
            price_data:{
                currency:currency,
                product_data:{
                    name:'Delivery fee'
                },
                unit_amount: Delivery_fee *100
            },
            quantity:1
        })
        const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'], // 👈 only allow card
    success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
    cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
    line_items,
    mode: 'payment',
});
        res.json({success:true,session_url:session.url})

    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }

}
// Verify Stripe
const verifyStripe = async (req, res) => {
  try {
    const { success, orderId } = req.body

    if (success === "true") {

      await orderModel.findByIdAndUpdate(orderId, {
        payment: true
      })

      res.json({ success: true })

    } else {

      await orderModel.findByIdAndDelete(orderId)

      res.json({ success: false })

    }

  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

const placeorderRazorpay=async (req, res) => {

}

export const allOrders=async (req, res) => {
    try {
        const orders = await orderModel.find({});
        res.json({ success: true, orders });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
        
    }

}


// user data

const userOrders=async (req, res) => {
    try {
        const userId = req.userId;

        const orders = await Order.find({ userId });

        res.json({ success: true, orders });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
        
    }

}

// update order status by admin

const updateStatus=async (req, res) => {
    try {
        const {orderId,status}=req.body
        await orderModel.findByIdAndUpdate(orderId,{status})
        res.json({success:false,message:'Status Updated'})
        
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
        
    }

}

export {placeOrder,placeorderStripe,placeorderRazorpay,userOrders,updateStatus,verifyStripe}