/// <reference path="_references.js" />

window.Todo = function (initialData) {
    var self = this;
    upshot.map(initialData, upshot.type(Todo), self);
}

window.TodoesViewModel = function () {
    // Private data
    var self = this;
    var dataSource = upshot.dataSources.Todoes.refresh();

    // Public data
    self.todoes = dataSource.getEntities();
    self.editingTodo = ko.observable();
    self.validationRules = $.extend({}, dataSource.getEntityValidationRules(), {
        submitHandler: function () { self.acceptEdit() },
        resetFormOnChange: self.editingTodo
    });

    // Navigation
    self.nav = new NavHistory({
        params: { editItem: null },
        onNavigate: function (navEntry) {
            dataSource.findById(navEntry.params.editItem, self.editingTodo);
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
        var currentItem = self.editingTodo();
        dataSource.revertChanges(currentItem);
        self.closeEditor();
    }

    self.createTodo = function () {
        var newItem = new Todo({});
        self.todoes.push(newItem);
        self.openEditor(newItem);
    }

    self.deleteCurrentTodo = function () {
        var currentItem = self.editingTodo();
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

