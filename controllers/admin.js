const Product = require('../models/product');

const { validationResult } = require('express-validator');

exports.getAddProduct = (req, res, next) => {
	res.render('admin/edit-product', {pageTitle: 'Add Product', path: '/admin/add-product', editing: false, hasError: false, errorMessage: null, validationErrors: []});
};

exports.postAddProduct = (req, res, next) => {
	const title = req.body.title;
	const imageUrl = req.body.imageUrl;
	const description = req.body.description;
	const price = req.body.price;
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(422).render('admin/edit-product', {
			pageTitle: 'Add Product', 
			path: '/admin/edit-product',
			editing: false,
			hasError: true,
			product: {
				title,
				imageUrl,
				price,
				description
			},
			errorMessage: errors.array()[0].msg,
			validationErrors: errors.array()
		});
	}

	const product = new Product({
		title, 
		price, 
		description, 
		imageUrl,
		userId: req.user
	});
	product
		.save()
		.then(result => {
			console.log('Create Product');
			res.redirect('/admin/products')
		})
		.catch(err => {
			console.log(err);
		});
	
};

exports.getEditProduct = (req, res, next) => {
	const editMode = req.query.edit;
	if (!editMode) {
		return res.redirect('/');
	}
	const prodId = req.params.productId;
	Product.findById(prodId)
		.then(product => {
			if (!product) {
				return res.redirect('/');
			}
			res.render('admin/edit-product', {
				pageTitle: 'Edit Product', 
				path: '/admin/edit-product',
				editing: editMode,
				product,
				hasError: false,
				errorMessage: null,
				validationErrors: []
			});
		})
		.catch();
	
};

exports.postEditProduct = (req, res, next) => {
	const prodId = req.body.productId;
	const updatedTitle = req.body.title;
	const updatedPrice = req.body.price;
	const updatedImageUrl = req.body.imageUrl;
	const updatedDescription = req.body.description;

	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(422).render('admin/edit-product', {
			pageTitle: 'Edit Product', 
			path: '/admin/edit-product',
			editing: true,
			hasError: true,
			product: {
				title: updatedTitle,
				imageUrl: updatedImageUrl,
				price: updatedPrice,
				description: updatedDescription,
			},
			errorMessage: errors.array()[0].msg,
			validationErrors: errors.array()
		});
	}

	Product.findById(prodId)
		.then(product => {
			product.title = updatedTitle;
			product.price = updatedPrice;
			product.description = updatedDescription;
			product.imageUrl = updatedImageUrl;
			return product.save();
		})
		.then(result => {
			console.log("UPDATED PRODUCT");
			res.redirect('/admin/products');
		})
		.catch(err => {
			console.log(err);
		});
	
};

exports.getProducts = (req, res, next) => {
	Product.find()
		.then(products => {
			res.render('admin/products', {
				prods: products, 
				pageTitle: 'Admin Products', 
				path: '/admin/products'
			});
		})
		.catch(err => {
			console.log(err);
		});
}

exports.postDeleteProduct = (req, res, next) => {
	const prodId = req.body.productId;
	Product.findByIdAndDelete(prodId)
		.then(() => {
			console.log('DESTROYED PRODUCT');
			res.redirect('/admin/products');
		})
		.catch(err => {
			console.log(err);
		});
	
};
