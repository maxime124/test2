var supertest = require('supertest');
var should = require('should');

var server = supertest.agent("http://localhost:3000");

describe("Account unit test",function(){
	it("api is up",function(done){
		server.get("/")
			.expect(200)
			.end(function(err,res){
				if (err) {
					return done(err);
				}

				res.status.should.equal(200);
				done();
			})
	});

	it("Delete all account",function(done){
		server.delete("/accounts")
			.expect("Content-type",/json/)
			.expect(200)
			.end(function(err,res){
				if (err) {
					return done(err);
				}

				res.body.should.equal(true);
				done();
			})
	});

	it("Get all account empty",function(done){
		server.get("/accounts")
			.expect("Content-type",/json/)
			.expect(200)
			.end(function(err,res){
				if (err) {
					return done(err);
				}
				res.body.length.should.equal(0);
				done();
			})
	});

	var liNewAccountId = false;
	it("Add an account",function(done){
		server.post("/accounts")
			.send({
				"name": "TEST compte 1",
				"description" : "C'est le premier test",
				"value" : {
					"value": "100"
				},
				"history" : [{
					"date" : "2016-05-01",
					"value" : "150"
				}]
			})
			.expect("Content-type",/json/)
			.expect(200)
			.end(function(err,res){
				if (err) {
					return done(err);
				}
				liNewAccountId = res.body;
				done();
			})
	});

	it("Get an account",function(done){
		server.get("/accounts/"+liNewAccountId)
			.expect(200)
			.expect("Content-type",/json/)
			.end(function(err,res){
				if (err) {
					return done(err);
				}

				res.body._id.should.equal(liNewAccountId);
				done();
			})
	});

	var liSecondAccountId = false;
	it("Add an second account",function(done){
		server.post("/accounts")
			.send({
				"name": "TEST compte 2",
				"description" : "C'est le premier test",
				"value" : {
					"value": "100"
				}
			})
			.expect("Content-type",/json/)
			.expect(200)
			.end(function(err,res){
				if (err) {
					return done(err);
				}
				liSecondAccountId = res.body;
				done();
			})
	});

	it("Get 2 accounts",function(done){
		server.get("/accounts")
			.expect("Content-type",/json/)
			.expect(200)
			.end(function(err,res){
				if (err) {
					return done(err);
				}
				res.body.length.should.equal(2);
				done();
			})
	});

	it("Delete 1 account",function(done){
		server.delete("/accounts/"+liSecondAccountId)
			.expect("Content-type",/json/)
			.expect(200)
			.end(function(err,res){
				if (err) {
					return done(err);
				}
				res.body._id.should.equal(liSecondAccountId);
				done();
			})
	});

	it("Delete an not existing account",function(done){
		server.delete("/accounts/"+liSecondAccountId)
			.expect("Content-type",/json/)
			.expect(200)
			.end(function(err,res){
				if (err) {
					return done(err);
				}
				res.body.should.equal(false);
				done();
			})
	});

	it("Get 1 accounts",function(done){
		server.get("/accounts")
			.expect("Content-type",/json/)
			.expect(200)
			.end(function(err,res){
				if (err) {
					return done(err);
				}
				res.body.length.should.equal(1);
				done();
			})
	});

	it("Get an not existing account",function(done){
		server.get("/accounts/"+liSecondAccountId)
			.expect(200)
			.expect("Content-type",/json/)
			.end(function(err,res){
				if (err) {
					return done(err);
				}
				res.body.should.equal(false);
				done();
			})
	});

	it("Update an account",function(done){
		server.put("/accounts/"+liNewAccountId)
			.send({
				"name": "Updated compte",
				"description" : "C'est le premier test",
				"value" : {
					"value": "100"
				}
			})
			.expect("Content-type",/json/)
			.expect(200)
			.end(function(err,res){
				if (err) {
					return done(err);
				}
				res.body.name.should.equal("Updated compte");
				done();
			})
	});

	describe("Account history",function(){
		it("Get an account history",function(done){
			server.get("/accounts/"+liNewAccountId+"/history")
				.expect(200)
				.expect("Content-type",/json/)
				.end(function(err,res){
					if (err) {
						return done(err);
					}
					res.body.length.should.equal(1);
					done();
				})
		});

		var liHistoryId = null;
		it("Add an account history entry",function(done){
			server.post("/accounts/"+liNewAccountId+"/history")
				.send({
					"date" : "2016-05-05",
					"value" : "200",
					"composition" : [{type:'action',percentage:'100'}]
				})
				.expect(200)
				.expect("Content-type",/json/)
				.end(function(err,res){
					if (err) {
						return done(err);
					}
					res.body.history.length.should.equal(2);
					liHistoryId = res.body.history[1]._id;
					done();
				})
		});

		it("Get an value history",function(done){
			server.get("/accounts/"+liNewAccountId+"/history/"+liHistoryId)
				.expect(200)
				.expect("Content-type",/json/)
				.end(function(err,res){
					if (err) {
						return done(err);
					}
					res.body._id.should.equal(liHistoryId);
					done();
				});
		});

		it("Update an value history",function(done){
			server.put("/accounts/"+liNewAccountId+"/history/"+liHistoryId)
				.send({
					"date" : "2016-05-05",
					"value" : "8888",
					"composition" : [{type:'action',percentage:'100'},{type:'obligation',percentage:'100'}]
				})
				.expect(200)
				.expect("Content-type",/json/)
				.end(function(err,res){
					if (err) {
						return done(err);
					}

					server.get("/accounts/"+liNewAccountId+"/history/"+liHistoryId)
						.expect(200)
						.expect("Content-type",/json/)
						.end(function(err,res){
							if (err) {
								return done(err);
							}
							res.body.value.should.equal(888800);
							res.body.date.should.equal("2016-05-05T00:00:00.000Z");
							done();
						});
				});
		});

		it("Update an inexistant value history",function(done){
			server.put("/accounts/"+liNewAccountId+"/history/5465136")
				.send({
					"date" : "2016-05-05",
					"value" : "8888"
				})
				.expect(500).end(function(err,res){
					done();
				});
		});

		it("Get an value composition", function (done) {
			server.get("/accounts/" + liNewAccountId+"/history/"+liHistoryId+"/composition/")
				.expect(200)
				.expect("Content-type", /json/)
				.end(function (err, res) {
					if (err) {
						return done(err);
					}
					res.body.length.should.equal(2);
					res.body[0].type.should.equal('action');
					res.body[0].percentage.should.equal(100);
					done();
				});
		});

		it("Delete all account history entry",function(done){
			server.delete("/accounts/"+liNewAccountId+"/history/")
				.send({
					"date" : "2016-05-05",
					"value" : "200"
				})
				.expect(200)
				.expect("Content-type",/json/)
				.end(function(err,res){
					if (err) {
						return done(err);
					}
					res.body.history.length.should.equal(0);
					done();
				})
		});
	});

	describe("Portfolio test",function(){
		it("Delete all account",function(done){
			server.delete("/accounts")
				.expect("Content-type",/json/)
				.expect(200)
				.end(function(err,res){
					if (err) {
						return done(err);
					}

					res.body.should.equal(true);
					done();
				})
		});

		it("Create first account",function(done){
			server.post("/accounts")
				.send({
					name: "ING AV MG",
					description : "",
					value : {
						value: "6000",
						date: "2016-07-27",
						composition: [{
							type : "obligation",
							percentage : "100"
						}]
					},
					"history" : [{
						"date" : "2016-06-27",
						"value" : "5000",
						composition: [{
							type : "obligation",
							percentage : "100"
						}]
					}]
				})
				.expect("Content-type",/json/)
				.expect(200)
				.end(function(err,res){
					if (err) {
						return done(err);
					}
					liAV1Id = res.body;
					done();
				});
		});

		it("Create second account",function(done){
			server.post("/accounts")
				.send({
					"name": "ING AV",
					"description" : "",
					"value" : {
						"value": "13000",
						composition: [{
							type : "action",
							percentage : "85"
						},{
							type : "obligation",
							percentage : "15"
						}]
					},
					"history" : [{
						"date" : "2016-06-27",
						"value" : "5000"
					}]
				})
				.expect("Content-type",/json/)
				.expect(200)
				.end(function(err,res){
					if (err) {
						return done(err);
					}
					done();
				});
		});

		it("Create third account",function(done){
			server.post("/accounts")
				.send({
					"name": "Boursorama PEA",
					"description" : "",
					"value" : {
						"value": "6800",
						composition: [{
							type : "action",
							percentage : "100"
						}]
					},
					"history" : [{
						"date" : "2016-06-27",
						"value" : "6700",
						composition: [{
							type : "action",
							percentage : "100"
						}]
					}]
				})
				.expect("Content-type",/json/)
				.expect(200)
				.end(function(err,res){
					if (err) {
						return done(err);
					}
					done();
				});
		});

		it("Verifying 3 accounts are created",function(done){
			server.get("/accounts")
				.expect("Content-type",/json/)
				.expect(200)
				.end(function(err,res){
					if (err) {
						return done(err);
					}
					res.body.length.should.equal(3);
					done();
				})
		});

		it("Get evolution value ",function(done){
			server.get("/accounts/"+liAV1Id+"/growth/2016-05-01")
				.expect("Content-type",/json/)
				.expect(200)
				.end(function(err,res){
					if (err) {
						return done(err);
					}
					res.body.length.should.equal(3);
					done();
				})
		});
	});
});
