(function() {
  var JSONStorage, create, list, todo, uuid,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  uuid = require("node-uuid");

  JSONStorage = (function() {
    function JSONStorage(storageName, properties) {
      var store;
      this.storageName = storageName;
      this.properties = properties != null ? properties : [];
      this.save = __bind(this.save, this);
      store = localStorage[this.storageName];
      this.json = store ? JSON.parse(store) : [];
    }

    JSONStorage.prototype.save = function() {
      var json;
      json = this.json.map((function(_this) {
        return function(item) {
          var obj, prop, _i, _len, _ref;
          obj = {};
          _ref = _this.properties;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            prop = _ref[_i];
            obj[prop] = item[prop];
          }
          return obj;
        };
      })(this));
      return localStorage[this.storageName] = JSON.stringify(json);
    };

    return JSONStorage;

  })();

  todo = new JSONStorage("todo", ["todo", "id"]);

  create = new Vue({
    el: "#create",
    methods: {
      add: function() {
        todo.json.push({
          todo: this.text,
          id: uuid.v4()
        });
        return this.text = "";
      }
    }
  });

  list = new Vue({
    el: "#list",
    data: {
      tasks: todo.json
    },
    methods: {
      done: function(e) {
        var vm;
        vm = e.targetVM;
        return this.tasks.$remove(vm.$index);
      }
    }
  });

  list.$watch("tasks", function() {
    return todo.save();
  });

}).call(this);
