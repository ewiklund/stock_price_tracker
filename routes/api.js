/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

const expect = require('chai').expect;
const MongoClient = require('mongodb');
const mongoose = require("mongoose");
const ObjectId = require("mongodb").ObjectId;
const dotenv = require("dotenv").config();
const request = require("request-promise");
mongoose.connect(process.env.DB, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true}); //MongoClient.connect(CONNECTION_STRING, function(err, db) {});

  mongoose.connection.once('open', (err) => {
    if(err) {
      console.log("Error connecting to database:" .err);
  } else {
    console.log("Successfully connected to database");
    }});

    const Schema = mongoose.Schema;
    const stockSchema = new Schema({
      stock: {type: String, required: true, unique: true},
      price: {type: String, required: true},
      likes: {type: Number, default: 0},
      likerIPs: [String]
    })

    const Stock = mongoose.model("Stock", stockSchema);

    module.exports = function (app) {

  app.route('/api/stock-prices')
    .get(function (req, res, next){
      let query = req.query;
      console.log(req.query);
        let stockUrl = typeof query.stock === "object" ? query.stock : [query.stock];
        for(let stock in stockUrl) {
          stockUrl[stock] = `https://repeated-alpaca.glitch.me/v1/stock/${stockUrl[stock]}/quote`
     }
        const promise = stockUrl.map(url => request(url).json())
        Promise.all(promise).then(data => {
          let stock = data;
          let updateStock = [];
          for (let i in stock) {
            let obj = {
              stock: stock[i].symbol,
              price: stock[i].latestPrice
            }
            updateStock.push(obj);
          }
          let iteration = 0;
          let ipAddress = req.headers['x-forwarded-for'].substring(0, req.headers['x-forwarded-for'].indexOf(","));
          updateStock.forEach((d, i) => {
            Stock.findOneAndUpdate({stock: d.stock}, d, {upsert: true, new: true}, (err, doc) => {
              err && console.log(err);
              if(query.like && !doc.likerIPs.includes(ipAddress)) {
                doc.likerIPs.push(ipAddress)
                doc.likes++
                doc.save((err, result) => {
                  err && res.json(err)
                  console.log("Data updated");
                })
              }
              displayData(doc)
            })
            iteration++
          })
          let container = [];
          function displayData(data) {
            container.push(data);
            if(iteration === container.length) {
              if(iteration < 2) {
                let response1 = {
                  stockData: {
                    stock: data.stock,
                    price: data.price,
                    likes: data.likes
                  }
                }

                for(let err in response1.stockData) {
                  if(response1.stockData[err] == null) {
                    return res.json({error: "Unknown symbol"})
                  }
                }
                res.json(response1);
              } else {
                let response2 = {
                  stockData: [
                    {
                      stock: container[0].stock,
                      price: container[0].price,
                      rel_likes: container[0].likes - container[1].likes
                    }, {
                      stock: container[1].stock,
                      price: container[1].price,
                      rel_likes: container[1].likes - container[0].likes
                    }
                  ]

                  }
                  for(let elem of response2.stockData) {
                    for(let err in elem) {
                      if(elem[err] == null) {
                        return res.json({error: "One or both symbol are unknown"});
                      }
                    }
                  }
                  res.json(response2);
                }
              }
            }
          }).catch(err => console.log(err));
    });

};
