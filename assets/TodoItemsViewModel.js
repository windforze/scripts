/// <reference path="_references.js" />

window.TodoItem = function (initialData) {
    var self = this;
    upshot.map(initialData, upshot.type(TodoItem), self);
}

window.TodoItemsViewModel = function () {
    // Private data
    var self = this;
    var dataSource = upshot.dataSources.TodoItems.refresh();

    // Public data
    self.todoItems = dataSource.getEntities();
    self.editingTodoItem = ko.observable();
    self.validationRules = $.extend({}, dataSource.getEntityValidationRules(), {
        submitHandler: function () { self.acceptEdit() },
        resetFormOnChange: self.editingTodoItem
    });

    // Navigation
    self.nav = new NavHistory({
        params: { editItem: null },
        onNavigate: function (navEntry) {
            dataSource.findById(navEntry.params.editItem, self.editingTodoItem);
        }
    }).initialize({ linkToUrl: true });

    // Public operations
    self.openEditor = function (item) {
        self.nav.navigate({ editItem: dataSource.getEntityId(item) });
    }

    self.closeEditor = function () {
        self.nav.navigate({ editItem: null });
    }

    self.saveAll = function () {
        dataSource.commitChanges(null, showFirstInvalidItem); // On error, display the affected item
    }

    self.revertAll = function () {
        dataSource.revertChanges();
    }

    self.acceptEdit = function () {
        self.closeEditor();
    }

    self.rejectEdit = function () {
        var currentItem = self.editingTodoItem();
        dataSource.revertChanges(currentItem);
        self.closeEditor();
    }

    self.createTodoItem = function () {
        var newItem = new TodoItem({});
        self.todoItems.push(newItem);
        self.openEditor(newItem);
    }

    self.deleteCurrentTodoItem = function () {
        var currentItem = self.editingTodoItem();
        dataSource.deleteEntity(currentItem);
        self.closeEditor();
    }

    // Private functions
    function showFirstInvalidItem() {
        var firstError = dataSource.getEntityErrors()[0];
        if (firstError)
            self.openEditor(firstError.entity);
    }
}

