var express = require('express');
var router = express.Router();
var monk=require('monk');
var moment=require('moment');
var nodemailer=require('nodemailer');
var randomstring=require('randomstring');
var multer=require('multer');
//var upload = multer({ dest: 'uploads/' });
var db=monk('localhost:27017/aditya');
var collection=db.get('signup');
var collection1=db.get('form');
//console.log('connected');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
});
 
var upload = multer({ storage: storage })

/* GET home page. */
router.get('/', function(req, res) { 
	if(req.session&&req.session.user){
		res.locals.user=req.session.user;
        res.render('/home');
    }
    else{
    	req.session.reset();
    	res.render('index');
    }

});
router.get('/home',function(req,res){
	if(req.session&&req.session.user){
		res.locals.user=req.session.user;
	    collection1.find({},function(err,docs){
	    	console.log(docs);
	    	res.locals.data=docs;
	    res.render('home');
        });
	}
	else{
		res.redirect('/');
	}
});
router.get('/forgetpassword', function(req, res) {
  res.render('forgetpassword');

});
router.post('/forgetpassword',function(req,res){
	var email=req.body.email;
	console.log(email);
	var otp=randomstring.generate(5);
	var msg="<html><head></head><body><b>"+otp+"</b></body></html>";
	var transporter = nodemailer.createTransport({
    service: 'gmail',
  auth: {
    user: 'saipriyapydi2000@gmail.com',
    pass: '9392412345'
  }
});

var mailOptions = {
  from: 'saipriyapydi2000@gmail.com',
  to: req.body.email,
  subject: 'your OTP',
  html:msg
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});
collection.update({"email":email},{$set:{"password":otp}});
res.redirect('/');
});
router.post('/signup',function(req,res){
var transporter = nodemailer.createTransport({
    service: 'gmail',
  auth: {
    user: 'saipriyapydi2000@gmail.com',
    pass: '9392412345'
  }
});

var mailOptions = {
  from: 'saipriyapydi2000@gmail.com',
  to: req.body.email,
  subject: 'sucessfully registered',
  text: 'than2s'
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});
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
	var logintime=moment().format("hh:mm:ss a");
	console.log(logintime);
	collection.update({"email":fem},{$set:{"logintime":logintime}});
	collection.findOne({"email":fem,"password":fpw},function(err,docs){
		if(!docs){
			console.log("invalid");
			res.render('index',{err:"invalid username or password"});
		}
		else if(docs){
			console.log("success");
			delete docs.password;
			req.session.user=docs;
			res.redirect('/home');
		}
		else{
			console.log(err);
		}
	});
});
router.get('/logout',function(req,res){
    req.session.reset();
	res.redirect('/');
})
router.post('/form',upload.single('image'),function(req,res){
	console.log(req.file);
	var data={
		firstname:req.body.ftname,
		lastname:req.body.ltname,
		email:req.body.email,
		image:req.file.originalname,
	}
	collection1.insert(data,function(err,docs){
		console.log(docs);
		res.redirect('/home');
	});
});
router.post('/remove',function(req,res){
	var id=req.body.no;
	console.log(id);
	collection1.remove({"_id":id},function(err,docs){
		res.send(docs);

	});
});
router.post('/edit',function(req,res){
	var id=req.body.no;
	collection1.find({"_id":id},function(err,docs){
		res.send(docs);
	});
});
router.post('/update',function(req,res){
	console.log(req.body.ftname);
	console.log(req.body.ltname);
	console.log(req.body.email);
	console.log(req.body.id);
	var data={
		firstname:req.body.ftname,
		lastname:req.body.ltname,
		email:req.body.email,
	}
	collection1.update({"_id":req.body.id},{$set:data},function(err,docs){
		res.redirect('/home');

	});
});

module.exports = router;
