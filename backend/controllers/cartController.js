import userModel from "../models/userModel.js";

export const addToCart = async (req, res) => {

  try {
    const userId = req.userId;
    const {  itemId, size } = req.body;

    const userData = await userModel.findById(userId);

    let cartData = userData.cartData || {};

    if (cartData[itemId]) {

      if (cartData[itemId][size]) {
        cartData[itemId][size] += 1;
      } else {
        cartData[itemId][size] = 1;
      }

    } else {

      cartData[itemId] = {};
      cartData[itemId][size] = 1;

    }

    await userModel.findByIdAndUpdate(userId, { cartData });

    res.json({ success: true, message: "Item added to cart" });

  } catch (error) {

    console.log(error);
    res.json({ success: false, message: error.message });

  }

};

// Update Cart Item
    export const updateCart = async (req, res) => {
    try {
        const userId = req.userId;
        const {itemId, size, quantity } = req.body;

        const userData= await userModel.findById(userId);
        let cartData=await userData.cartData;
        
        cartData[itemId][size]=quantity;
        
        await userModel.findByIdAndUpdate(userId,{cartData });
        res.status(200).json({ success: true, message: 'Cart item updated successfully' });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Error updating cart item' });
        
    }
    

    res.status(200).json({ message: 'Cart  item updated successfully' });
};

// Get User Cart
export const getUserCart = async (req, res) => {
    try {
        const userId  = req.userId;
        const userData = await userModel.findById(userId);
        
        
        res.status(200).json({ success:true,cartData: userData.cartData   || {} });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Error retrieving user cart' });
    }
};


export default {
    addToCart,
    updateCart,
    getUserCart
};
