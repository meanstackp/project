var express = require('express');
var router = express.Router();
var monk=require('monk');
var db=monk('localhost:27017/aditya');
var collection=db.get('signup');
console.log('connected');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index');
});
router.get('/home',function(req,res){
	res.render('home');
});
router.post('/signup',function(req,res){
	var data={
		name:req.body.name,
		email:req.body.email,
		password:req.body.pass,
		phn:req.body.phno,
		gender:req.body.gender,
		col:req.body.college,
		qual:req.body.qual,
		spec:req.body.spec,
		ad:req.body.ad,
		yoc:req.body.yoc,
	}
	collection.insert(data,function(err,data){
		if(err)
		{
			console.log("error");
		}
		else{
			console.log(data);
			}
	});
	res.redirect("/");
});
router.post('/login',function(req,res){
	var fem=req.body.ema;
	console.log(fem);
	var fpw=req.body.pw;
	console.log(fpw);
	collection.findOne({"email":fem,"password":fpw},function(err,docs){
		if(!docs){
			console.log("invalid");
			res.render('index',{err:"invalid username or password"});
		}
		else if(docs){
			console.log("success");
			res.redirect('/home');
		}
		else{
			console.log(err);
		}
	});
});


module.exports = router;
