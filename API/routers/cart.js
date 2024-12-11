const express = require('express')
const mongoose = require('mongoose')
const { Cart } = require('../Model/cart')
const router = express.Router()

// xem thong tin tu gio hang
router.get('/:userId', async (req, res) => {
    const { userId } = req.params
    try {
        const cart = await Cart.findById(userId).populate({
            path: 'products.productId',
            model: 'Product'
        })

        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }

        const productCount = cart.products.length;
        return res.status(200).json(cart)
    } catch (error) {
        return res.status(500).json({ error: 'Error fetching cart' })
    }
})

// them san pham vao cart
router.post('/addproduct_cart', async (req, res) => {
    const { userId, productId, quantity } = req.body
    try {
        let cart = await Cart.findById(userId)
        if (!cart) {
            cart = new Cart({ _id: userId, products: [] })
        }

        // Tìm sản phẩm trong giỏ hàng
        const existingProductIndex = cart.products.findIndex(
            (item) => item.productId.toHexString() === productId,
        )

        if (existingProductIndex !== -1) {
            cart.products[existingProductIndex].quantity += quantity
        } else {
            cart.products.push({
                productId,
                quantity
            })
        }
        const productCount = cart.products.length;
        await cart.save()
        return res.status(200).json(cart)
    } catch (error) {
        console.log(error)
        return res.status(500).json(error)
    }
})

// update so luong
router.post('/update', async (req, res) => {
    const { userId, products } = req.body;
    console.log("Request data:", { userId, products }); 

    try {
        let cart = await Cart.findOne({ _id: userId });
        if (!cart) {
            cart = new Cart({ _id: userId, products });
        } else {
            products.forEach((newProduct) => {
                const productIndex = cart.products.findIndex(p => p.productId.toString() === newProduct.productId);
                if (productIndex === -1) {
                    cart.products.push(newProduct);
                } else {
                    cart.products[productIndex].quantity = newProduct.quantity;
                }
            });
        }

        await cart.save();
        res.status(200).json(cart);
    } catch (error) {
        console.error("Error updating cart:", error); // Log lỗi server
        res.status(500).json({ message: 'Error updating cart', error });
    }
});


router.post('/delete_product_cart', async (req, res) => {
    try {
        const { userId, productId } = req.body
        let updatedCart = await Cart.findByIdAndUpdate(
            userId,
            { $pull: { products: { productId: productId } } }, // Sử dụng $pull để xóa
            { new: true } // Trả về dữ liệu giỏ hàng sau khi cập nhật
        );

        if (!updatedCart) {
            return res.status(404).json({ message: 'Cart not found.' });
        }
        res.status(200).json({ message: 'Sản phẩm đã được xóa khỏi giỏ hàng' })
    } catch (error) {
        console.error(error);
    }
})


module.exports = router