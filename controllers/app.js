var LeagueManager = angular.module('LeagueManager', ['ngRoute','ngSanitize'])

//Routage
LeagueManager.config(function ($routeProvider) {
    $routeProvider
	.when("/archives", {
	    template: '<archives></archives>'
	})
	.when("/competition/:ID", {
	    template: '<competition></competition>'
	})
	.when("/league", {
	    template: '<league></league>'
	})
	.when("/team/:ID", {
	    template: '<team></team>'
	})
	.when("/match/:ID", {
	    template: '<match></match>'
	})
	.when("/ranking/:ID", {
	    template: '<ranking></ranking>'
	})
	.when("/forum", {
	    templateUrl: '/Forum/index.php'
	})
	.when("/", {
	    template: '<main></main>'
	});
});

LeagueManager.run(function($rootScope, $http, $location, $timeout) {
	$rootScope.user = window.User;
	$rootScope.admin = ['9','10','11','12'].indexOf(window.Group)>-1 ? 1 : 0;
	$rootScope.title = "Tribunes - le mag de la BBBL";
	$rootScope.competitions = [];
	$rootScope.finalsTemplate = ['Finale','Demi-Finales','Quart de finales','8emes de finales','16emes de finales','32emes de finales'];

	//Récupération des statistiques de la ligue
	$http.get('Backend/generic.php').success(function(result){
		$rootScope.leagueStats = result;
	});
	//Récupération des articles
	$http.get('Backend/articles.php').success(function(result){
		$rootScope.articles = result;

		for(i=0;i<$rootScope.articles.length;i++){
			$rootScope.articles[i].summary = $rootScope.articles[i].text.substr(0, $rootScope.articles[i].text.indexOf('<br/><br/>'))
		}
		//Récupération des compétitions
		$http.get('Backend/competitions.php?active=1').success(function(result){
			$rootScope.competitions = result;

			for(j=0;j<$rootScope.competitions.length;j++){

				for(k=0;k<Object.keys($rootScope.articles).length;k++){
					if($rootScope.articles[k].competition_id == $rootScope.competitions[j].id){
						$rootScope.competitions[j].article=$rootScope.articles[k];
					}
				}

			}

			$rootScope.competitionsFetched = 1;
			$rootScope.$broadcast('articlesFetched');
		});
	});

	$rootScope.goToPage = function(page) {
		$('#Logo').removeAttr( 'style' );
		$rootScope.$broadcast('routeChangeSuccess');
    $location.path( page );
  };

	//Gestion de l'historique
	$rootScope.history = [];
	$rootScope.$on('routeChangeSuccess', function() {
				$rootScope.history.push($location.$$path);
	});

	$rootScope.previousPage = function () {
		$('#Logo').removeAttr( 'style' );
		var prevUrl = $rootScope.history.length > 0 ? $rootScope.history.splice(-1)[0] : "/";
		console.log(prevUrl);
		$location.path(prevUrl);
	};

	$rootScope.randomArticle = function(categories){
		//Récupération des articles en JSON (temporaire)
		var selection = [];
		for(i=0;i<Object.keys($rootScope.articles).length;i++){
			if($rootScope.articles[i].random == 1 && categories.indexOf($rootScope.articles[i].category) != -1){
				selection.push($rootScope.articles[i]);
			}
		}
		return selection[Math.floor(Math.random() * selection.length)];
	};

	//Gestion des couleurs
	//Couleurs de bases du site
	$rootScope.colours = [];
	$rootScope.colourA = "#00558D";
	$rootScope.colourB = "#DD7C00";
	//Mise à jours de couleurs (pour les équipes)
	$rootScope.setColours = function(args){
		for(i=0; i < args.length; i++){
				$rootScope.colours[i] = {};
				$rootScope.colours[i].hexa = args[i];
				$rootScope.colours[i].color = { 'color': args[i] };
				$rootScope.colours[i].border = { 'border-color':args[i] };
				$rootScope.colours[i].background = { 'background-color':args[i] };
				$rootScope.colours[i].fill = { 'fill': args[i] };
		}
			$rootScope.navbarColour ={'background': '-webkit-linear-gradient('+args[0]+',#000000)', 'background': '-moz-linear-gradient('+args[0]+',#000000)', 'background': 'linear-gradient('+args[0]+',#000000)' };
	};
	//Tri des listes
	$rootScope.sortBy = function(orderFilter) {
		$rootScope.reverse = ($rootScope.orderFilter === orderFilter) ? !$rootScope.reverse : false;
		$rootScope.orderFilter = orderFilter;
	};

});
