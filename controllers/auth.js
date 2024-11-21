const User = require('../models/user');

exports.getLogin = (req, res, next) => {
	// const isLoggedIn = req.get('Cookie').split('=')[1];
	
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
		isAuthenticated: false
  });
};

exports.postLogin = (req, res, next) => {
	User.findById('67378d392c6b5991a468c105')
		.then(user => {
			req.session.isLoggedIn = true;
			req.session.user = user;
			req.session.save((err) => {
				console.log(err);
				res.redirect('/');
			})
  		
		})
		.catch(err => {
			console.log(err);
		});

};

exports.postLogout = (req, res, next) => {
	req.session.destroy(err => {
		console.log(err);
		res.redirect('/');
	});

};