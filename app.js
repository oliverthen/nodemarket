const path = require('path');
const bodyParser = require('body-parser');
const express = require('express');

const errorController = require('./controllers/error');
const mongooseConnect = require('./util/database');
const User = require('./models/user');

const app = express();


app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

app.use(bodyParser.urlencoded());
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
	User.findById('67378d392c6b5991a468c105')
		.then(user => {
			req.user = user;
			next();
		})
		.catch(err => {
			console.log(err);
		});
	});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);
mongooseConnect()
	.then(result => {
		User.findOne().then(user => {
			if (!user) {
				const user  = new User({
				name: 'Oliver',
				email: 'oliver@test.com',
				cart: {
					items: []
				}
				});
				user.save()
			}
		})
		
		app.listen(3000)
	})
	.catch(err => {
		console.log(err);
	})

