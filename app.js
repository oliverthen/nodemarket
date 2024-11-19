const path = require('path');
const bodyParser = require('body-parser');
const express = require('express');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const errorController = require('./controllers/error');
const mongooseConnect = require('./util/database').mongooseConnect;
const uri = require('./util/database').uri;
const User = require('./models/user');

const app = express();
const store = new MongoDBStore({
	uri,
	collection: 'sessions' 
});


app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

app.use(bodyParser.urlencoded());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({secret: 'my secret', resave: false, saveUninitialized: false, store}));



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

