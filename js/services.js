app.factory("UserService", ["$firebaseObject",
  function($firebaseObject) {
    return function(username) {
      var ref = firebase.database().ref("users");
      var profileRef = ref.child(username);
      return $firebaseObject(profileRef);
    }
  }
]);

app.factory("Auth", ["$firebaseAuth",
  function($firebaseAuth) {
    return $firebaseAuth();
  }
]);

app.factory("Items", ["$firebaseObject",
  function($firebaseObject) {
    return function(type,limit) {
      console.log('id is : ' + type);
      var ref = firebase.database().ref("items");
      var itemsRef = ref.child(type).limitToLast(limit);
      return $firebaseObject(itemsRef);
    }
  }
]);

app.factory("Item", ["$firebaseObject",
  function($firebaseObject) {
    return function(type, id) {
      var ref = firebase.database().ref("items");
      var itemsRef = ref.child(type).child(id);
      return $firebaseObject(itemsRef);
    }
  }
]);
app.factory("SingleSet", ["$firebaseObject",
  function($firebaseObject) {
    return function(id) {
      var ref = firebase.database().ref("sets");
      var itemsRef = ref.child(id);
      return $firebaseObject(itemsRef);
    }
  }
]);

app.factory("Categories", ["$firebaseObject",
  function($firebaseObject) {
    return function() {
      var ref = firebase.database().ref("cat");
      return $firebaseObject(ref);
    }
  }
]);

app.factory("Sets", ["$firebaseArray",
  function($firebaseArray) {
    // create a reference to the database where we will store our data
    var ref = firebase.database().ref("sets");
    return $firebaseArray(ref);
  }
]);

app.factory("Builds", ["$firebaseArray",
  function($firebaseArray) {
    return function(uid) {
      var ref = firebase.database().ref("builds");
      var buildsRef = ref.child(uid);
      return $firebaseArray(buildsRef);
    }
  }
]);

app.factory("Spells", ["$firebaseArray",
  function($firebaseArray) {
    return function(id) {
      var ref = firebase.database().ref("spells");
      var buildsRef = ref.child(id);
      return $firebaseArray(buildsRef);
    }
  }
]);

app.factory("BuildId", ["$firebaseObject",
  function($firebaseObject) {
    return function(id) {
      var ref = firebase.database().ref("buildID");
      var buildRef = ref.child(id);
      return $firebaseObject(buildRef);
    }
  }
]);

app.factory("Database",
  function() {
    // create a reference to the database where we will store our data
    var ref = firebase.database();
    return ref;
  }
);
