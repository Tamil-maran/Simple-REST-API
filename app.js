const express = require('express');
const app = express();
const mongoose = require('mongoose');
const User = require('./models/user');
const cors = require('cors');

mongoose.connect('mongodb://interntest:easyas123@interncluster-shard-00-00-zmzoh.mongodb.net:27017,' + 
				'interncluster-shard-00-01-zmzoh.mongodb.net:27017,interncluster-shard-00-02-zmzoh.mongodb.net:27017/' + 
				'test?ssl=true&replicaSet=InternCluster-shard-0&authSource=admin&retryWrites=true', 
	{ useNewUrlParser: true }
);

mongoose.connection.once('open', () => {
	console.log('Connected to MongoDB Atlas.');
});

mongoose.connection.on('error', err => {
	console.log('Database ERROR: ' + err);
});

// Middleware for CORS
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
			console.log( "Insert ERROR : " + errmsg);
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

	// Handle errors from middlewares
	console.log(err);
	if(err.type == 'entity.parse.failed')
		res.status(400).json({
			posted: false,
			message: 'JSON Parse failed'
		})
});

app.listen(3000);