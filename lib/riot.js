var _ = require('underscore');
var Client = require('node-rest-client').Client;

var env = process.env;
var client = new Client();

// Riot server regions
var regions = {
	global: {
		platform: 'global',
		host: 'https://global.api.pvp.net'
	},
	na: {
		platform: 'na1',
		host: 'https://na.api.pvp.net'
	},
	euw: {
		platform: 'euw1',
		host: 'https://euw.api.pvp.net'
	}
};

// Base paths of Riot API
var basePaths = {
	'summoner': '/api/lol/{region}/v1.4/summoner',
	'mastery': '/championmastery/location/{platformId}/player/{playerId}',
	'champions': '/api/lol/static-data/{region}/v1.2/champion'
};

// Paths to dynamically create functions
var paths = { 
	'summonerInfo': basePaths.summoner + '/by-name/{summonerNames}?',
	'masteryChampions': basePaths.mastery + '/champions?',
	'masteryScore': basePaths.mastery + '/score?'
};

// Main API function
function Riot() {
	this.apiKey = env.apiKey;
};

// Set our base URL & platform
Riot.prototype.setBaseUrl = function () {
	this.platfrom = regions[this.region].platform;
	this.baseUrl = regions[this.region].host;
};

// Loop through the api paths above and add a method for each
_.each(paths, function(path, name, obj) {
  	Riot.prototype[name] = function (params, error, success) {
      	var cPath = this.setUrlParams(path, params);
		var apiKey = 'api_key=' + this.apiKey;
		var url = this.baseUrl + cPath + apiKey;
		this.doGetRequest(url, error, success);
 	};
});

// Get all champions data (static)
Riot.prototype.staticChampions = function (params, error, success) {
  	var cPath = this.setUrlParams(basePaths.champions, params);
	var apiKey = '?api_key=' + this.apiKey;
	var url = regions['global'].host + cPath + apiKey;
	console.log(url);
	this.doGetRequest(url, error, success);
};

// Helper class to change API parameters to real ones
Riot.prototype.setUrlParams = function (path, params) {
	_.each(params, function(value, key, param) {
		var regex = new RegExp('({'+ key +'})', 'g');
		path = path.replace(regex ,param[key]);
	});
	return path;
};

// Glue methods for performing an http/get
Riot.prototype.doGetRequest = function (url, error, success) {

	client.get(url, function (data, response) {
		if (response.statusCode == 200) success(data);
		else error(data);
	});

};

if (!(typeof exports === 'undefined')) {
		exports.Riot = Riot;
}
