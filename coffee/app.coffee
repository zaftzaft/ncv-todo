uuid = require "node-uuid"

class JSONStorage
  constructor: (@storageName, @properties = []) ->
    store = localStorage[@storageName]
    @json = if store then JSON.parse store else []

  save: =>
    json = @json.map (item) =>
      obj = {}
      for prop in @properties
        obj[prop] = item[prop]
      return obj
    localStorage[@storageName] = JSON.stringify(json)

todo = new JSONStorage "todo", ["todo", "id"]

create = new Vue {
  el: "#create"
  methods: {
    add: ->
      todo.json.push {
        todo: @text
        id  : uuid.v4()
      }
      @text = ""
  }
}

list = new Vue {
  el: "#list"
  data: {
    tasks: todo.json
  }
  methods: {
    done: (e) ->
      vm = e.targetVM
      @tasks.$remove vm.$index
  }
  lazy: true
}

list.$watch "tasks", ->
  todo.save()
