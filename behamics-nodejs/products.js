// import express from 'express';
// import jwt from 'jsonwebtoken';
const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();
const router = express.Router();

const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const url = 'mongodb://localhost:27017';
const dbName = 'behamics';
let db;
let dbClient;
MongoClient.connect(url, function (err, client) {
	assert.equal(null, err);
	console.log('Connected successfully to server');
	db = client.db(dbName);
	dbClient = client;
	client.close();
});

const auth = (req, res, next) => {
	try {
		const { authorization } = req.headers;
		if (!authorization) {
			throw new Error('You must send an authorization header.');
		}

		const [authType, token] = authorization.trim().split(' ');
		if (authType !== 'Bearer') throw new Error('Expected a Bearer token');

		const decoded = jwt.verify(token, process.env.JWT_KEY);
		req.userData = decoded;
		next();
	} catch (error) {
		return res.status(401).json({
			message: err.message || 'Auth failed',
		});
	}
};

app.get('/product/', function (req, res) {
	res.send('TEST PRODUCTS');
});

app.get('/product/:from/:to', auth, function (req, res) {
	const from = req.params.from;
	const to = req.params.to;

	db.collection('product').find({
		'date': {
			$lte: new Date(to),
			$gte: new Date(from)
		}
	})
	.toArray()
	.then((result) => {
		res.json({
			"msg": "Succesfully retrieved the products", 
			"products": result, 
			"success": true
		})
	}).catch((err) => {
		res.json({
			"err": err,
			"success": false
		})
		dbClient.close()
	});

});

app.get('/products/categories', auth, function (req, res) {
	db.collection('product').aggregate(
		[
		  {
			$group:
			  {
				_id : "$category",
				totalStock: { $sum: "$stock" }
			  }
		  },
		   {
			 $sort: {"totalStock": -1}
		   }
		 ]
	   )
	.toArray()
	.then((result) => {
		res.json({
			"msg": "Succesfully retrieved the products", 
			"products": result, 
			"success": true
		})
	}).catch((err) => {
		res.json({
			"err": err,
			"success": false
		})
		dbClient.close()
	});

});




app.listen(8000, () => {
	console.log('Example app listening on port 8000!');
});
