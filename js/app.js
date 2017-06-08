'use strict';

/*window.onerror = function(){
   return true;
}*/

function isCompatible(set1, set2) {
  return compatible(intersect(set1.tableTypes, set2.tableTypes));
}

Array.prototype.diff = function(a) {
    return this.filter(function(i) {return a.indexOf(i) < 0;});
};

function intersect(a, b) {
    var t;
    if (b.length > a.length) t = b, b = a, a = t; // indexOf to loop over shorter
    return a.filter(function (e) {
        return b.indexOf(e) > -1;
    });
}

function getItems(arr1, arr2) {
  var items = arr1.concat(arr2);
  $http.get('items.json').then(function(result) {
    console.log(result);
  });
}

function compatible(array) {
  var l = array.length;
  var a = 4; // valeur de l'anneau
  // retourner le tableau ainsi que la valeur pour mettre en surbrillance les combinaisons impossibles
  if (l == 0) {
    return 0; // compatible
  }
  if (l == 1 && (array[0] == a) ) {
    return 0; // compatible parce qu'anneau
  }
  if (l == 1) {
    return 1; // incompatible à un item
  }
  if (l == 2 && (array[0] == a || array[1] == a) ) {
    return 1; //incompatible à un item;
  }
  if (l == 2) {
    return 2;
  }
  else {
    return l;
  }
}




function getName(authData) {
  switch (authData.providerData[0].providerId) {
    case 'password':
      return 'Nouvel utilisateur';
    case 'twitter':
      return authData.twitter.displayName;
    case 'facebook':
      return authData.facebook.displayName;
    case 'google.com':
      return authData.providerData[0].displayName;
  }
  return 'Inconnu';
}

function getProviderLink(text) {
  switch (text) {
    case 'password':
      return 'no provider';
    case 'twitter.com':
      return new firebase.auth.TwitterAuthProvider();
    case 'facebook.com':
      return new firebase.auth.FacebookAuthProvider();
    case 'google.com':
      return new firebase.auth.GoogleAuthProvider();
  }
}

function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

function setVal(value, defaultValue){
   return (value === undefined) ? defaultValue : value;
}

var app = angular.module('myApp', ['ngRoute', 'firebase', 'ngCookies', 'ngDragDrop', 'angularMoment']);

app.constant('USERS_URL', 'https://appcrud-c9166.firebaseio.com/users');

app.run(["$rootScope", "$location", function($rootScope, $location, amMoment) {
  $rootScope.$on("$routeChangeError", function(event, next, previous, error) {
    if (error === "AUTH_REQUIRED") {
      $location.path("/home");
    }
  });
}]);

app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
  $locationProvider.hashPrefix('');
  /*$locationProvider.html5Mode({
    enabled: true
  });*/
  $routeProvider
    .when('/home', {
      templateUrl: 'views/home.html',
      controller: 'HomeCtrl',
      resolve: {
        "currentAuth": ["Auth", function(Auth) {
          return Auth.$waitForSignIn();
        }]
      }
    })
    .when('/contact', {
      templateUrl: 'views/contact.html',
      controller: 'ContactCtrl'
    })
    .when('/sets', {
      templateUrl: 'views/sets.html',
      controller: 'SetsCtrl'
    })
    .when('/set/:id', {
      templateUrl: 'views/setId.html',
      controller: 'SetIdCtrl'
    })
    .when('/itemsType/:type/:build', {
      templateUrl: 'views/itemsType.html',
      controller: 'ItemsTypeCtrl',
      resolve: {
        "currentAuth": ["Auth", function(Auth) {
          return Auth.$waitForSignIn();
        }]
      }
    })
    .when('/item/:type/:id', {
      templateUrl: 'views/itemId.html',
      controller: 'ItemIdCtrl'
    })
    .when('/items', {
      templateUrl: 'views/items.html',
      controller: 'ItemsCtrl'
    })
    .when('/weapons', {
      templateUrl: 'views/weapons.html',
      controller: 'WeaponsCtrl'
    })
    .when('/sets', {
      templateUrl: 'views/sets.html',
      controller: 'SetsCtrl'
    })
    .when('/dashboard', {
      templateUrl: 'views/dashboard.html',
      controller: 'DashboardCtrl'
    })
    .when('/builds', {
      templateUrl: 'views/builds.html',
      controller: 'BuildsCtrl',
      resolve: {
        "currentAuth": ["Auth", function(Auth) {
          return Auth.$requireSignIn();
        }]
      }
    })
    .when('/build/:id', {
      templateUrl: 'views/buildId.html',
      controller: 'BuildIdCtrl'
    })
    .when('/build/:id/edit', {
      templateUrl: 'views/buildEdit.html',
      controller: 'BuildEditCtrl',
      resolve: {
        "currentAuth": ["Auth", function(Auth) {
          return Auth.$requireSignIn();
        }]
      }
    })
    .when('/profile', {
      templateUrl: 'views/profile.html',
      controller: 'ProfileCtrl',
      resolve: {
        "currentAuth": ["Auth", function(Auth) {
          return Auth.$requireSignIn();
        }]
      }
    })
    .when('/compare', {
      templateUrl: 'views/buildsCompare.html',
      controller: 'CompareCtrl',
      resolve: {
        "currentAuth": ["Auth", function(Auth) {
          return Auth.$requireSignIn();
        }]
      }
    })
    .when('/resultCompare/:firstBuild/:secondBuild', {
      templateUrl: 'views/resultCompare.html',
      controller: 'ResultCompareCtrl'
    })
    .otherwise({
      redirectTo: '/home'
    });
}]);
