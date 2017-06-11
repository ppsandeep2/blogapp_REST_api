var express = require('express');
var app = express();
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

app.use(bodyParser.json({limit:'10mb',extended:true}));
app.use(bodyParser.urlencoded({limit:'10mb',extended:true}));


db = mongoose.connect('mongodb://localhost/blogdb');


mongoose.connection.once('open', function() {

	console.log("database connection opened successfully");
	console.log("------------------------------------------");

});


var Blog = require('./blogSchema.js');
var blogModel = mongoose.model('Blog');

//middleware
app.use(function(req,res,next){
	console.log("------------------------------------------");

	console.log("Hostname",req.hostname);
	console.log("Date",new Date());
	console.log("Ip address",req.ip);
	console.log("Navigated to ",req.path);
	console.log("Request Method ",req.method);
	console.log("------------------------------------------");

	next();
});


app.get('/', function (req, res) {

  res.send("Rest API for Blog App")


});


app.get('/blogs',function(req, res) {
 console.log("Get all Blogs");
  blogModel.find(function(err,result){
    if(err){
			res.send(err)
		}
		else{
			res.send(result)
		}
	});

});


app.get('/blogs/:id',function(req, res) {
 console.log("Get Blog id : "+req.params.id);

	blogModel.findOne({'_id':req.params.id},function(err,result){
		if(err){
			console.log("ERROR");
			res.send(err);
		}
		else{
			res.send(result)
		}
	});

});

	



app.post('/blog/create',function(req, res) {

		var newBlog = new blogModel({

			title 		: req.body.title,
			subTitle 	: req.body.subTitle,
			blogBody 	: req.body.blogBody
 
		
		}); 

	    var authorInfo = 
		{
			authorName    :   req.body.authorName,
			authorEmail   :   req.body.authorEmail
	
		};
	    
	    newBlog.authorInfo = authorInfo;

		newBlog.created = Date.now();

		
		var allTags = (req.body.allTags!=undefined && req.body.allTags!=null)?req.body.allTags.split(','):''
		newBlog.tags = allTags;

		
		
		

		newBlog.save(function(err){
			if(err){
				console.log(err, "ERROR");
				res.send(err);

			}
			else{
				res.send(newBlog);
			 console.log("Created new blog  : "+req.body.title);

			}

		});


	});






app.put('/blogs/:id/edit',function(req, res) {

	var update = req.body;

	blogModel.findOneAndUpdate({'_id':req.params.id},update,function(err,result){

		if(err){
			console.log("ERROR");
			res.send(err);
		}
		else{
			res.send(result);
           console.log("Edited blog  : "+req.body.title);

		}


	});

});
app.post('/blogs/:id/delete',function(req, res) {

	blogModel.remove({'_id':req.params.id},function(err,result){

		if(err){
			console.log("ERROR");
			res.send(err);
		}
		else{
			res.send(result);
		    console.log("Deleted blog  : "+req.body.title);

		}


	});
});


app.use(function(req, res) {
   res.status('404').send("404: Page not Found");
   console.log('404: Page not Found');
});


app.listen(3000, function () {
  console.log('BlogApp  listening on port 3000!');
});