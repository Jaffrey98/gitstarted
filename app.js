var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var server = require('http').Server(app);
var mongoose = require('mongoose');
var assert = require('assert');

var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://127.0.0.1:27017/gs';

app.get('/',function(req,res){
    res.sendFile(__dirname+'/index.html');
});

app.use(express.static(__dirname));

server.listen(process.env.PORT || 3000,function(){
    console.log('Listening on '+server.address().port);
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var GitHub = require('github-api');
var gh = new GitHub();

app.post('/insert_user',function(req,res){

    var followers = req.body.followers;
    var stars = req.body.stars;
    var forks = req.body.forks;
    var repos = req.body.repos;
    var languages = req.body.languages;
    var sizes = req.body.sizes;
    var username = req.body.username;

    obj = {username:username,followers:followers,stars:stars,forks:forks,repos:repos,languages:JSON.parse(languages),sizes:JSON.parse(sizes)};

    MongoClient.connect(url, function(err, client) {
        assert.equal(null,err);
        const db = client.db('gs');

        db.collection('user_info').insert(obj,function(err,result){
            console.log("user inserted");
            return res.send(JSON.stringify({res:"Done"}));
        });
    });
});

app.post('/rep_info',function(req,res){

    var token = req.body.token;

    var gh = new GitHub({
        token:token
    });

    var userrepos = gh.getUser();
    var rate = gh.getRateLimit();

    rate.getRateLimit(function(error,result){
        //console.log(result);
    })

    userrepos.listRepos(function(error,result){
        //console.log(result);
        return res.send(JSON.stringify({"res":result}));
    });

});

app.post('/user_info',function(req,res){

    var token = req.body.token;

  var gh = new GitHub({
        token:token
  });

  var userinfo = gh.getUser();

  userinfo.getProfile(function(error,result){
      //console.log(result);
      return res.send(JSON.stringify({"res":result}));
  });

});

app.post('/get_cont',function(req,res){

    var token = req.body.token;
    var rep_name = req.body.rep_name;

  var gh = new GitHub({
        token:token
  });

  var repoinfo = gh.getRepo(rep_name);

  repoinfo.getContributors(function(error,result){
      // console.log(result);
      return res.send(JSON.stringify({"res":result}));
  });

});

var github = require('octonode');

app.post('/get_recom',function(req,res){

    var username = req.body.username;
    var key = req.body.key;

    console.log(username);
    var stars;
    var followers;
    var repos;
    var forks;
    var lang;
    var size;

    MongoClient.connect(url, function(err, client) {
        assert.equal(null,err);
        const db = client.db('gs');

        db.collection('user_info').find({username:username}).toArray(function(err,result){
            // console.log(result);

            stars = result[0].stars;
            followers = result[0].followers;
            repos = result[0].repos;
            forks = result[0].forks;
            lang = result[0].languages;
            size = result[0].sizes;

            var token = req.body.token;
            var page = req.body.page;

            console.log(key);

            if(key!=undefined)
                var query = key+"+";

            else
                var query = '';

            for(var i in lang){
                var string = 'language:'+lang[i]+"+";
                query = query+string;
            }

            stars = Number(stars);
            followers = Number(followers);
            forks = Number(forks);

            console.log(forks);

            var mstars = stars+20;
            //var mfollowers = followers+20;
            var mforks = forks+20;

            console.log(mforks);

            var st = 'stars:'+(stars-20)+".."+mstars+"+";
            //var fl = 'followers:'+(followers-20)+".."+mfollowers+"+";
            var fk = 'forks:'+(forks-20)+".."+mforks;

            query=query+st+fk;

            console.log(query);

            var client = github.client();
        
            var ghsearch = client.search();

            ghsearch.repos({
                q: query,
                sort: 'updated',
                order: 'asc',
                per_page: 100,
                page:page
            }, function(error,result){
                    // console.log(result);
                return res.send(JSON.stringify({"res":result}));
            });
        });
    }); 
});
