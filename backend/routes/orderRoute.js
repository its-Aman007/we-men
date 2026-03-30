import express from 'express';
import { placeOrder,placeorderStripe,placeorderRazorpay,userOrders,updateStatus,allOrders,verifyStripe} from '../controllers/orderController.js';
import adminAuth from '../middleware/adminAuth.js';
import authUser from '../middleware/auth.js';



const orderRouter = express.Router();
// orderRouter.post("/", (req,res)=>{
//   res.json({ success: true, message: "Order created successfully" });
// });
//Admin routes
orderRouter.get('/list',adminAuth,allOrders);
orderRouter.post('status',adminAuth,updateStatus);

orderRouter.post('/',authUser,placeOrder);

// Payment routes
orderRouter.post('/place',adminAuth,placeOrder);
orderRouter.post('/status',adminAuth,updateStatus);
orderRouter.post('/stripe',authUser,placeorderStripe);
orderRouter.post('/razorpay',authUser,placeorderRazorpay);
// User routes
orderRouter.get('/user',authUser,userOrders);
// verify payment
orderRouter.post('/verifyStripe', authUser,verifyStripe);



export default orderRouter;