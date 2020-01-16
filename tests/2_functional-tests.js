/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

    suite('GET /api/stock-prices => stockData object', function() {

      afterEach(function(done) {
this.timeout(30000)
setTimeout( function() {
console.log('Some delay to test')
done();
}, 7000);
});

      test('1 stock', function(done) {
       chai.request(server)
        .get('/api/stock-prices')
        .query({stock: 'goog'})
        .end(function(err, res){
            assert.equal(res.status, 200);
            assert.isObject(res.body, 'it\'s an object);
            assert.isObject(res.body.stockData, 'its and object');
            assert.equal(res.body.stockData.stock, "GOOG");
            assert.property(res.body.stockData, "stock");
            assert.property(res.body.stockData, "price");
            assert.property(res.body.stockData, "likes");
          done();
        });
      });

      test('1 stock with like', function(done) {
        chai.request(server)
         .get('/api/stock-prices')
         .query({stock: 'goog', like: true})
           .end(function(err, res){
             assert.equal(res.status, 200);
             assert.isObject(res.body.stockData, "it's an object");
             assert.equal(res.body.stockData.stock, "GOOG");
             assert.property(res.body.stockData, "stock");
             assert.property(res.body.stockData, "price");
             assert.property(res.body.stockData, "likes");
             assert.equal(res.body.stockData.likes, 3);
             done();
          });
      });

      test('1 stock with like again (ensure likes arent double counted)', function(done) {
        chai.request(server)
         .get('/api/stock-prices')
         .query({stock: 'goog', like: true})
           .end(function(err, res){
             assert.equal(res.status, 200);
             assert.isObject(res.body.stockData, "it's an object");
             assert.equal(res.body.stockData.stock, "GOOG");
             assert.property(res.body.stockData, "stock");
             assert.property(res.body.stockData, "price");
             assert.property(res.body.stockData, "likes");
             assert.equal(res.body.stockData.likes, 3);
             done();
          });
      });

      test('2 stocks', function(done) {
        chai.request(server)
         .get('/api/stock-prices')
         .query({stock: ['goog', 'msft']})
         .end(function(err, res){
           assert.equal(res.status, 200);
           assert.isArray(res.body.stockData, "it's an array");
           assert.property(res.body.stockData[0], "stock");
           assert.property(res.body.stockData[0], "price");
           assert.property(res.body.stockData[0], "rel_likes");
           assert.property(res.body.stockData[1], "stock");
           assert.property(res.body.stockData[1], "price");
           assert.property(res.body.stockData[1], "rel_likes");
           assert.equal(res.body.stockData[0].stock, "GOOG");
           assert.equal(res.body.stockData[1].stock, "MSFT");
           done();
         });
      });

      test('2 stocks with like', function(done) {
        chai.request(server)
         .get('/api/stock-prices')
         .query({stock: ['goog', 'msft'], like: true})
         .end(function(err, res){
           assert.equal(res.status, 200);
           assert.isArray(res.body.stockData, "it's an array");
           assert.property(res.body.stockData[0], "stock");
           assert.property(res.body.stockData[0], "price");
           assert.property(res.body.stockData[0], "rel_likes");
           assert.property(res.body.stockData[1], "stock");
           assert.property(res.body.stockData[1], "price");
           assert.property(res.body.stockData[1], "rel_likes");
           assert.equal(res.body.stockData[0].stock, "GOOG");
           assert.equal(res.body.stockData[1].stock, "MSFT");
           assert.equal(res.body.stockData[0].rel_likes + res.body.stockData[1].rel_likes, 0);
           done();
      });

    });
});
});
