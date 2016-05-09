# Master Gynius

Entry for the [Riot Games API Challenge 2016](https://developer.riotgames.com/), using the champion mastery API.

As an avid League of Legends player and a Web developer, finding out how the API of my favourite game works was really adventerious and fun for me.

## Technologies

The heart of the project is a Node JS app.  For the Front-End [Jade(pug)](http://jade-lang.com/), [SCSS](http://sass-lang.com/), and [Angular JS](https://angularjs.org/) has been used to turn this web app to a beauty.

Tech: NodeJS, AngularJS, ExpressJS, Isotope, Riot Rest Api's

## What Master Gynius does

With this web applications other players can search theirs (or anyone else's) username
to see how well they are doing with their champion mastery, which champions they have
mastered and how many points they have earned in total.

## Step by Step Explanation

Here is the home page, here the user inputs his summoner name and selects which region (for the purpose of this project, I have only used EUW and NA, but it can be easily scaled) and clicks on search:

<img src="home.png" />

At this point the only thing that happens is that Angular takes the field values and combine them to make the path for our search and redirects the user to that path :
  
    $scope.search = function() {
      var searchString = '/search/' + $scope.region + '/' + $scope.name.replace(/\s+/g, '');
      $window.location.href = searchString;
    };
    
When the user gets redirected to the url e.g. "/search/name" , Node JS router detects the url and runs a function which uses my custom made library for Riot API, from here onward most of the things are done dynamically as the only variables that we pass to the function from the library are "region" and "summoner-name". With this two alone, the library creates a huge object which holds the user information and all of his mastery details. This object is then passed to the next view (search).

The one challenge that I encountered while building this mini library was using **async.series** calls, because I needed the summoner ID which I only was able to get by calling a GET to summoner API by the "name" variable which the user entered, and then only after that call the other mastery API's.

This function from the library loops through the API paths and creates a method for each of them:

    _.each(paths, function(path, name, obj) {
      	Riot.prototype[name] = function (params, error, success) {
          	var cPath = this.setUrlParams(path, params);
    		var apiKey = 'api_key=' + this.apiKey;
    		var url = this.baseUrl + cPath + apiKey;
    		this.doGetRequest(url, error, success);
     	};
    });
    
Now that we have the data, the only thing left is to do the processing and populate them into the view.
Final Result:

<img src="search.png" />
