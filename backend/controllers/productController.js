import { v2 as cloudinary } from 'cloudinary';
import productModel from '../models/productModel.js';


// function for add products to database
const addProduct = async (req, res) => {

    try {
        const { name, description, price, category,subCategory,sizes,bestSeller } = req.body;
        const image1 = req.files.image1 && req.files.image1[0] ? req.files.image1[0] : null;
        const image2 = req.files.image2 && req.files.image2[0] ? req.files.image2[0] : null;
        const image3 = req.files.image3 && req.files.image3[0] ? req.files.image3[0] : null;
        const image4 = req.files.image4 && req.files.image4[0] ? req.files.image4[0] : null;
        const images = [image1, image2, image3, image4].filter(image => image !== null);

        let imageUrls = await Promise.all(
            images.map(async (item) => {
            let result = await cloudinary.uploader.upload(item.path,{resource_type: 'image'});
            return result.secure_url;
        }));
        console.log(imageUrls);
        console.log(name, description, price, category,subCategory,sizes,bestSeller);

        const productdata = new productModel({
            name,
            description,
            price:Number(price),
            category,
            subCategory,
            sizes:JSON.parse(sizes),
            bestSeller:bestSeller === 'true' ? true : false,
            image: imageUrls,
            date:Date.now()
        });
        console.log(productdata);
        const product= new productModel(productdata);
        await product.save();
        
        
        res.json({success:true, message:'Product added successfully'});
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message:error.message });
    }

}

// function for list all products from database
const listProducts = async (req, res) => {
    try {
        const products = await productModel.find({});
        res.json({ success: true, products });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message:error.message });
    }

}

// function for get single product details from database
const singleProduct = async (req, res) => {
    try {
        // pull id from body (POST), params (GET), or query string
        const productId = req.body.id || req.params.id || req.query.id;
        if (!productId) {
            return res.status(400).json({ success: false, message: 'Product ID is required' });
        }
        const product = await productModel.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        res.json({ success: true, product });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message:error.message });
    }

}

// function for remove product details in database
const removeProduct = async (req, res) => {
    try {
        const product = await productModel.findByIdAndDelete(req.body.id);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        res.json({ success: true, message: 'Product removed successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message:error.message });
    }
}

export { addProduct, listProducts, removeProduct, singleProduct };
