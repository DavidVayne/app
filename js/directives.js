function calculStats(build, stats) {
  var items = build.items;
  var a = {}
  for ( i in items) {
    a = merge(a, items[i][0].stats);
  }
  return merge(stats, addStats(a, build.stats));
}

function conditions(items, stats)  {
  var result = [];
  for (i in items) {
    var conditions = items[i][0].conditions;
    for (e in conditions) {
      if(stats[e].max > conditions[e].max) {
        result.push(items[i][0]);
      }
      else if(stats[e].max < conditions[e].min) {
        result.push(items[i][0]);
      }
    }
  }
  return result;
}

function addStats(stats, build) {
  for (i in build) {
    if (stats[i]) {
      stats[i].max += build[i].bonus + build[i].base;
      stats[i].min += build[i].bonus + build[i].base;
    }
    else {
      stats[i] = {
        "max" : 0,
        "min" : 0
      };
      stats[i].max += build[i].bonus + build[i].base;
      stats[i].min += build[i].bonus + build[i].base;
    }
  }
  return stats;
}
function merge(firstObject, secondObject) {
    var result = $.extend(true, {}, firstObject, secondObject);
    for (var k in result) {
        if ("object" === typeof result[k]) {
            firstObject[k] = firstObject[k] || {};
            secondObject[k] = secondObject[k] || {};
            result[k] = merge(firstObject[k], secondObject[k]);
        } else {
            firstObject[k] = firstObject[k] || 0;
            secondObject[k] = secondObject[k] || 0;
            result[k] = ("number" === typeof firstObject[k] && "number" === typeof secondObject[k]) ? (firstObject[k] + secondObject[k]) : result[k];
        }
    }
    return result;
}

app.directive('backButton', function() {
  return {
    restrict: 'E',
    template: '<button class="btn">{{back}}</button>',
    scope: {
      back: '@back',
      icons: '@icons'
    },
    link: function(scope, element, attrs) {
      $(element[0]).on('click', function() {
        history.back();
        scope.$apply();
      });
    }
  };
});

app.directive("itemTemplate", function(Item, $location) {
  return {
    restrict: 'E',
    scope: {
      item: '=',
      buildId: '@',
      build: '=',
      itemToShow: '='
    },
    templateUrl: 'views/directives/itemEditBloc.html',
    link: function(scope, element, attrs) {
      // fonction de redirection à la sélection
      scope.redirectItem = function() {
        $location.path('/itemsType/' + attrs.type + '/' + scope.buildId);
      }

      // suppression d'item
      scope.deleteItem = function() {
        scope.build.items['type' + attrs.type] = null;
        scope.build.$save().then(function(res) {
          scope.item = null;
        },
        function(err) {
            console.log(err);
        });
        scope.build.titre = "test";
      }

      // ouverture de la fiche item
      scope.openItem = function(item) {
        scope.itemToShow = item;
        $('#modalItem').modal('show');
      }
    }
  };
});

app.directive("statsTemplate", function($location, $http) {
  return {
    restrict: 'E',
    scope: {
      build: '=',
      spells: '='
    },
    templateUrl: 'views/directives/statistiques.html',
    link: function($scope, element, attrs) {
      $scope.spellToShow = {}
      $http.get('views/directives/jsontype.json').then(function(result) {
        $scope.stats = result.data.stats;
        $scope.$watch("build",function(newValue,oldValue) {
          $scope.calculatedStats = calculStats($scope.build, $scope.stats);
          console.log($scope.calculatedStats);
          $scope.conditionsResult = conditions($scope.build.items, $scope.calculatedStats);
          if($scope.conditionsResult.length > 0) {
            $scope.conditionBool = true;
          }
        }, true);
      });
      $scope.calculDmg = function(element, value)  {
        var stats = $scope.calculatedStats;
        if(element == 'neu') {
          return value + value * ((stats['fo'].max + stats['pui'].max)/100) + stats['do'].max + stats['do' + element].max;
        }
        if (stats[element]) {
          return value + value * ((stats[element].max + stats['pui'].max)/100) + stats['do'].max + stats['do' + element].max;
        }
        return value;
      }

      $scope.updateSpellToShow = function(spell) {
        $scope.spellToShow = spell;
      }
      $scope.updateLevelToShow = function(level) {
        console.log(level);
        $scope.levelToShow = level;
      }
    }
  };
});
