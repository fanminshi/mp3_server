// Get the packages we need
var express = require('express');
var mongoose = require('mongoose');
var Llama = require('./models/llama');
var bodyParser = require('body-parser');
var router = express.Router();
var User = require('./models/users');
var Task = require('./models/tasks');

//replace this with your Mongolab URL
mongoose.connect('mongodb://modernphysics:1234@ds061641.mongolab.com:61641/modernphysics');

// Create our Express application
var app = express();

// Use environment defined port or 4000
var port = process.env.PORT || 4000;

//Allow CORS so that backend and frontend could pe put on different servers
var allowCrossDomain = function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept");
  next();
};
 
app.use(allowCrossDomain);

// Use the body-parser package in our application
app.use(bodyParser.urlencoded({
  extended: true
}));

// All our routes will start with /api
app.use('/api', router);

// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log(req.body);
    console.log(req.params);
    next(); // make sure we go to the next routes and don't stop here
});

//Default route here
var homeRoute = router.route('/');

homeRoute.get(function(req, res) {
  res.json({ message: 'Hello World!' });
});

//Llama route 
var llamaRoute = router.route('/llamas');

llamaRoute.get(function(req, res) {
  res.json([{ "name": "alice", "height": 12 }, { "name": "jane", "height": 13 }]);
});

//users route
router.route('/users')

  
    .get(function(req, res) {
    	/*User.find(function(err, users){
    		console.log(req.query);
    		console.log(req.query.where);

    		if(err)
    			return next(err);
    		else
    			res.json(users);

    	});*/
    	console.log(req.query);
    	console.log(req.query.where);
    	var q = User.find()
    	var x;
    	var count = false;
    	for(x in req.query){
    		console.log(x);
    		switch(x){
    			case 'where':
    				q = q.where(eval("(" + req.query[x] + ")"))
    			break;
    			case  'sort':
    				q = q.where(eval("(" + req.query[x] + ")"))
    			break;
    			case 'select':
    				q = q.where(eval("(" + req.query[x] + ")"))
    			break;
    			case 'skip':
    				q = q.skip(req.query[x])
    			break;
    			case 'limit':
    				q = q.limit(req.query[x])
    			break;
    			case 'count':
    				count = true;
    			break;
    		}

    	}

    	q.exec(function(err, user) {
   			if (err) 
   				res.send(err)
   			if (count)
   				res.json(user.length)
   			else
   				res.json(user)
		});

    	
 
    })

      .post(function(req, res) {

      	var user;

      	//user = new User({name:req.body.name, email:req.body.email, pendingTasks:req.body.pendingTasks});   

      	user = new User()

      	if(req.body.name != undefined)
      		user.name = req.body.name;
      	if(req.body.email != undefined)
      		user.email = req.body.email;
      	if(req.body.pendingTasks != undefined && typeof(req.body.pendingTasks) == 'arraystring')
      		user.pendingTasks = req.body.pendingTasks;

      	console.log("pending tasks array"+ typeof(req.body.pendingTasks));
      	console.log(user);
      

      	user.save(function(err) {
            if (err){
                 res.send(err)
                 console.log("error occur");
             }
             else
            	res.json(user);
        });

     
    })

 
    .options(function(req, res) {
      res.writeHead(200);
      res.end();
    });


router.route('/users/:id')

  
    .get(function(req, res) {
    	console.log("paras id is " + req.params.id);

    	User.findById(req.params.id, function(err, user){
    		if(err)
    			res.send(err)
    		res.json(user)
    	});
 
    })

      .put(function(req, res) {
      	User.findById(req.params.id, function(err, user){
      		if (err) 
      			res.send(err)
      		user.name = req.body.name;
      		user.email = req.body.email;
      		user.pendingTasks = req.body.email == undefined ? [] : req.body.email

      		user.save(function(err){
      			if(err)
      				res.send(err)
      			res.json(user);

      		})

      	})
   
    })

 
    .delete(function(req, res) {
        User.remove({
            _id: req.params.id
        }, function(err, user) {
            if (err)
                res.send(err);

            res.json({ message: 'Successfully deleted' });
        });
    });


//tasks route
router.route('/tasks')

  
    .get(function(req, res) {

    	var q = Task.find()
    	var x;
    	var count = false;
    	for(x in req.query){
    		console.log(x);
    		switch(x){
    			case 'where':
    				q = q.where(eval("(" + req.query[x] + ")"))
    			break;
    			case  'sort':
    				q = q.where(eval("(" + req.query[x] + ")"))
    			break;
    			case 'select':
    				q = q.where(eval("(" + req.query[x] + ")"))
    			break;
    			case 'skip':
    				q = q.skip(req.query[x])
    			break;
    			case 'limit':
    				q = q.limit(req.query[x])
    			break;
    			case 'count':
    				count = true;
    			break;
    		}

    	}

    	q.exec(function(err, task) {
   			if (err) 
   				res.send(err)
   			if (count)
   				res.json(task.length)
   			else
   				res.json(task)
		});
   
    })

      .put(function(req, res) {

      	var task = new Task({name:req.body.name, 
      		description:req.body.description, 
      		deadline:req.body.deadline, 
      		completed:req.body.completed,
      		assignedUser:req.body.assignedUser,
      		assignedUserName:req.body.assignedUser});   


      	console.log(task)

      	task.save(function(err) {
            if (err)
                res.send(err);

            res.json(task);
        });
  
    })

 
    .options(function(req, res) {
            res.writeHead(200);
     		res.end();
    });


//tasks route
router.route('/tasks/:id')

  
    .get(function(req, res) {
      	Task.findById(req.params.id, function(err, task){
      		if (err) 
      			res.send(err)
      		res.json(task);

      	})

    })

      .put(function(req, res) {


      	    Task.findById(req.params.id, function(err, task){
      		if (err) 
      			res.send(err)
 
      		task.name = req.body.name, 
      		task.description = req.body.description, 
      		task.deadline = req.body.deadline, 
      		task.completed = req.body.completed,
      		task.assignedUser = req.body.assignedUser,
      		task.assignedUserName = req.body.assignedUser

      		task.save(function(err){
      			if(err)
      				res.send(err)
      			res.json(task);

      		})

      	})


   
    })

 
    .delete(function(req, res) {
        Task.remove({
            _id: req.params.id
        }, function(err, user) {
            if (err)
                res.send(err);

            res.json({ message: 'Successfully deleted' });
        });
    });





//Add more routes here

// Start the server
app.listen(port);
console.log('Server running on port ' + port); 