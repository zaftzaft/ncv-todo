uuid = require "node-uuid"

class App
  constructor: (@storageName) ->
    store = localStorage[@storageName]
    @tasks = if store then JSON.parse store else []

  save: ->
    tasks = @tasks.map (task) ->
      {
        todo: task.todo
        id:   task.id
      }
    localStorage[@storageName] = JSON.stringify(tasks)

  add: (todo) ->
    @tasks.push {
      todo: todo
      id  : uuid.v4()
    }
    @save()

  done: (id) ->
    #@tasks = (task for task in @tasks when task.id isnt id)
    index = null
    @tasks.some (task, i) ->
      if task.id is id
        index = i
        true
    @tasks.splice index, 1 if index
    @save()

  edit: (id, todo) ->
    @tasks.forEach (task) ->
      if task.id is id
        task.todo = todo
    @save()


todo = new App "todo"

create = new Vue {
  el: "#create"
  methods: {
    add: ->
      todo.add @text
      @text = ""
  }
}

list = new Vue {
  el: "#list",
  data: {
    tasks: todo.tasks
  },
  methods: {
    save: (e) ->
      todo.save()
      vm = e.targetVM
      vm.edit = false

    done: (e) ->
      vm = e.targetVM
      @tasks.$remove vm.$index
  }
}
