function AppViewModel() {
  var self = this;
  var items = [
    {
      todo: 'Item 1',
      done: false,
      id: 1
    },
    {
      todo: 'Item 2',
      done: false,
      id: 2
    },
    {
      todo: 'Item 3',
      done: false,
      id: 3
    },
    {
      todo: 'Item 4',
      done: false,
      id: 4
    }
  ];

  self.items = ko.observableArray(items);

  self.itemsDone = ko.computed(() => self.items().filter(x => x.done).length);

  self.itemsNotDone = ko.computed(() => self.items().length - self.itemsDone());

  self.hasTodos = ko.computed(() => !!self.items().length);

  self.mainVm = {
    items: self.items,
    itemsDone: self.itemsDone,
    itemsNotDone: self.itemsNotDone,
    hasTodos: self.hasTodos
  };

  self.routes = [
    {
      name: 'main',
      url: '#/',
      template: 'views/main.html',
      viewModel: self.mainVm
    },
    {
      name: 'main',
      url: '#/main',
      template: 'views/main.html',
      viewModel: self.mainVm
    },
    {
      name: 'todo',
      url: '#/todo',
      template: 'views/todo.html',
      viewModel: null
    },
    {
      name: 'add',
      url: '#/add',
      template: 'views/add.html',
      viewModel: null
    }
  ];
};

$(() => {
  let vm = new AppViewModel();
  let $view = $('#main');
  let app = $.sammy('#main');

  vm.routes.forEach(route => {
    app.get(route.url, function (context) {      
      context.render(route.template, function (template) {
        $view.html(template);
        ko.cleanNode($view[0]);
        ko.applyBindings(route.viewModel, $view[0]);
      });
    });
  });

  app.run('#/');

});