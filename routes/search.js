var express = require('express');
var router = express.Router();
var async = require('async');

// Custom made API libarary
var Riot = require('../lib/riot').Riot;
var riot = new Riot();

// Catch errors during call
var error = function(res) {
  return function (err, response, body) {
    res.send(err);
  };
};

// /search lands on home
router.get('/', function(req, res) {
	res.render('index', {title: 'Home'});
});

// Get parameters from URL and send data + render
router.get('/:region/:name', function(req, res) {
	riot.region = req.params.region;
	riot.summonerName = req.params.name;

	riot.setBaseUrl();

	async.series([

		// GET Summoner Info
	    function(callback) {
	    	riot.summonerInfo({'region': riot.region, 'summonerNames': riot.summonerName}, error(res), function(data) {
	    		var name = riot.summonerName.toLowerCase();
	    		riot.summonerId = data[name].id;
				callback(false, {'account': data[name]});
			});
	    },

	    // GET Summoner Mastery Score
	    function(callback) {
	    	riot.masteryScore({'platformId': riot.platfrom, 'playerId': riot.summonerId}, error(res), function(data) {
				callback(false, {'masteryScore': data});
			});
	    },

	    // GET Summoner Mastery Champions
	    function(callback) {
	    	riot.masteryChampions({'platformId': riot.platfrom, 'playerId': riot.summonerId}, error(res), function(data) {
	    		callback(false, {'masteryChamps': data});
	    	});
	    },

	    // Get All Static Champions
	    function(callback) {
	    	riot.staticChampions({'region': riot.region}, error(res), function(data) {
	    		callback(false, {'staticChampions': data});
	    	});
	    }
	],

	// Execute all async tasks
	function(err, results) {
		if(err) { console.log(err); res.send(500,"Server Error"); return; }
		res.render('search', {title: 'Search', apiData: results});
	});

});

module.exports = router;
