const express = require('express');
const app = express();
const mongoose = require('mongoose');
const User = require('./models/user');
const cors = require('cors');

mongoose.connect('mongodb://localhost:27017/optn',
	{ useNewUrlParser: true }
);

app.use(cors());
app.options('*', cors());

// Middleware to parse JSON
app.use(express.json());
app.use('/addUser', (req, res, next) => {
	const user = new User(req.body);
	user
		.save()
		.then(doc => {
			console.log( "Inserted doc : " + doc);
			res.status(200).json({
				posted: true,
				user: doc 
			})
		})
		.catch(err => {

			// When save fails due to mismatch in schema
			const errmsg = err.message;
			console.log( "Error msg : " + errmsg);
			res.status(400).json({
				posted: false,
				message: errmsg 
			})
		})    
});

app.use('/', (req, res, next) => {
	
	res.status(404).json({
		posted: false,
		message: 'Wrong Endpoint',
		correct_endpoint: "http://localhost:3000/addUser"
	})
});

app.use((err, req, res, next) => {

	console.log(err);
	if(err.type == 'entity.parse.failed')
		res.status(400).json({
			posted: false,
			message: 'JSON Parse failed'
		})
});

app.listen(3000);