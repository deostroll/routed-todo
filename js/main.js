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

  self.items = ko.observableArray(items.map(x => {
    let obj = {};
    for(let prop in x) {
      obj[prop] = ko.observable(x[prop])
    }
    return obj;
  }));

  self.itemsDone = ko.computed(() => self.items().filter(x => x.done()).length);

  self.itemsNotDone = ko.computed(() => self.items().length - self.itemsDone());

  self.hasTodos = ko.computed(() => self.items().length > 0);

  self.mainVm = {
    items: self.items,
    itemsDone: self.itemsDone,
    itemsNotDone: self.itemsNotDone,
    hasTodos: self.hasTodos
  };

  self.todoVm = {
    hasTodos: self.hasTodos,
    items: self.items,

    toggle: (item) => {      
      item.done(!item.done());
    }
  };

  self.addVm = {
    todo: ko.observable(),
    id: ko.observable(),
    alert: ko.observable(),
    alertClass: ko.observable(),

    add: () => {
      let addVm = self.addVm;
      try {
        var newId = parseInt(addVm.id());  
      } catch (error) {
        console.error(error);
        addVm.showMessage('id should be an integer value');
        return;
      }
      
      let newTodo = addVm.todo();

      if(!newTodo.length) {
        addVm.showMessage('error', 'You need to enter a todo description');
        return;
      }

      if(self.items().map(x => x.id).indexOf(newId) > -1) {
        addVm.showMessage('error', 'The id already exists!')
        return;
      }

      self.items.push({
        id: ko.observable(newId),
        todo: ko.observable(newTodo),
        done: ko.observable(false)
      });

      addVm.id(null);
      addVm.todo('');
    },

    showMessage: (msgClass, msg) => {
      let vm = self.addVm;
      vm.alert(msg);
      vm.alertClass(msgClass);
      if (msgClass === 'error') {
        // do nothing
      } else {
        setTimeout(() => {
          vm.alert('');          
        }, 1000);
      }
    },

    dismiss: () => {
      self.addVm.alert('');      
    }

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
      viewModel: self.todoVm
    },
    {
      name: 'add',
      url: '#/add',
      template: 'views/add.html',
      viewModel: self.addVm
    }
  ];
};

$(() => {
  let vm = new AppViewModel();
  let items = ko.toJSON(vm.items);
  console.log(items);
  let $view = $('#main');
  // console.log($view);
  let app = $.sammy();

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