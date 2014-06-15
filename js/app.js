(function() {
  var App, create, list, todo, uuid;

  uuid = require("node-uuid");

  App = (function() {
    function App(storageName) {
      var store;
      this.storageName = storageName;
      store = localStorage[this.storageName];
      this.tasks = store ? JSON.parse(store) : [];
    }

    App.prototype.save = function() {
      var tasks;
      tasks = this.tasks.map(function(task) {
        return {
          todo: task.todo,
          id: task.id
        };
      });
      return localStorage[this.storageName] = JSON.stringify(tasks);
    };

    App.prototype.add = function(todo) {
      this.tasks.push({
        todo: todo,
        id: uuid.v4()
      });
      return this.save();
    };

    App.prototype.done = function(id) {
      var index;
      index = null;
      this.tasks.some(function(task, i) {
        if (task.id === id) {
          index = i;
          return true;
        }
      });
      if (index) {
        this.tasks.splice(index, 1);
      }
      return this.save();
    };

    App.prototype.edit = function(id, todo) {
      this.tasks.forEach(function(task) {
        if (task.id === id) {
          return task.todo = todo;
        }
      });
      return this.save();
    };

    return App;

  })();

  todo = new App("todo");

  create = new Vue({
    el: "#create",
    methods: {
      add: function() {
        todo.add(this.text);
        return this.text = "";
      }
    }
  });

  list = new Vue({
    el: "#list",
    data: {
      tasks: todo.tasks
    },
    methods: {
      save: function(e) {
        var vm;
        todo.save();
        vm = e.targetVM;
        return vm.edit = false;
      },
      done: function(e) {
        var vm;
        vm = e.targetVM;
        return this.tasks.$remove(vm.$index);
      }
    }
  });

}).call(this);
