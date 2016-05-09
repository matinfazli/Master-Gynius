// Just making the use of data easier
var dt = {
	'account': data[0].account,
	'masteryScore': data[1].masteryScore,
	'masteryChamps': data[2].masteryChamps,
	'staticChamps': data[3].staticChampions
}

// Static paths for profile pics and loading splash arts
var staticPaths = {
	'profileIcon': 'http://ddragon.leagueoflegends.com/cdn/6.9.1/img/profileicon/',
	'champLoading': 'http://ddragon.leagueoflegends.com/cdn/img/champion/loading/'
};

// This function gets all the static champion IDs
// and compares them with all the mastery champion IDs
// and creates an item for each in view using creatIteam()
function getMasteredChamps(masteries, champs) {

	for (var mastery in masteries) {
		var curMastery = masteries[mastery];

		for (var champ in champs.data) {
			var curChamp = champs.data[champ];

			if (curMastery.championId == curChamp.id) {
				createItem(curMastery, curChamp);
			}
		}
	}
}

// Creates an item for each champion mastery
function createItem(mastery, champ) {

	var background = staticPaths.champLoading + champ.key + '_0.jpg';
	var bkgElem = $("<img />", {src: background});

	var nameElem = $("<p />", {"class": "champ-name"}).text(champ.name);
	var pointsElem = $("<p />", {"class": "mastery-points"}).text(mastery.championPoints + ' Points');

	var scoreElem = $("<div />", {"class": "mastery-score"});
	for (var star = 1; star <= 5; star++) {
		var span = $("<span />", {"class": "fa fa-star"});
		if (star <= mastery.championLevel) {
			span.addClass("active");
			scoreElem.append(span);
		} else {
			span.removeClass("active");
			scoreElem.append(span);
		}
	}

	$('.champion-grid')
		.append($("<div />", {"class": "item"})

				.append($("<div />", {"class": "bkg"})
						.append(bkgElem))

				.append($("<div />", {"class": "details"})
						.append(nameElem)
						.append(scoreElem)
						.append(pointsElem)
				)
		);
}

// AngularJS App and Controller
var app = angular.module("App", []);

app.controller("showDataCtrl", function($scope) {

	$scope.avatar = staticPaths.profileIcon + dt.account.profileIconId + '.png';
	$scope.name = dt.account.name;
	$scope.level = dt.account.summonerLevel;
	$scope.score = dt.masteryScore;
	$scope.points = 0;

	// Calculates total mastery points
	$scope.calcPoints = function() {

		for (var mastery in dt.masteryChamps) {
			var curMastery = dt.masteryChamps[mastery];

			for (var champ in dt.staticChamps.data) {
				var curChamp = dt.staticChamps.data[champ];

				if (curMastery.championId == curChamp.id) {
					$scope.points += curMastery.championPoints;
				}
			}
		}
	}


	$scope.calcPoints();
	getMasteredChamps(dt.masteryChamps, dt.staticChamps);


	// Using isotop to sort data and fit in rows
	var $grid = $('.champion-grid').isotope({
	  	itemSelector: '.item',
	  	layoutMode: 'fitRows',
	  	getSortData: {
    		name: '.champ-name',
    		points: '.mastery-points parseInt'
  		}
	});

	// onClick sort by the sorting method inputed from view
	$scope.sortBy = function(sort) {
		if (sort == 'name') {
			$grid.isotope({ sortBy : sort, sortAscending: true });
		} else {
			$grid.isotope({ sortBy : sort, sortAscending: false });
		}
		
	}

});