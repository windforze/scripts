/// <reference path="../_references.js" />

function DailyScheduleViewModel() {
    // Data
    var self = this;
    self.dataSource = upshot.dataSources.DailySchedule.refresh();

    self.localDataSource = upshot.LocalDataSource({ source: self.dataSource, autoRefresh: true });

    self.dailySchedule = self.localDataSource.getEntities();
    self.excludeDone = ko.observable(false);

    //alert(self.dailySchedule);

    // Operations
    self.saveAll = function () { SaveAll() }
    self.revertAll = function () { RevertAll() }
    /*
    self.feedback = ko.observable();
    this.feedback.subscribe(function (newValue) {
        SaveAll();
    }, this);
    */
}

function TodolistViewModel() {
    // Data
    var self = this;
    self.dataSource = upshot.dataSources.TodoListForToday.refresh();
    self.localDataSource = upshot.LocalDataSource({ source: self.dataSource, autoRefresh: true });

    self.todolist = self.localDataSource.getEntities();
    self.excludeDone = ko.observable(false);

    //self.schedule = upshot.dataSources.ScheduleForToday.refresh();
    //self.memo = self.localDataSource.getEntities();

    // Operations
    self.saveAll = function () { SaveAll() }
    self.revertAll = function () { RevertAll() }

    self.excludeDone.subscribe(function (shouldExcludeDone) {
        var filterRule = shouldExcludeDone ? { property: "IsDone", operation: "==", value: false }
                                                : null;
        self.localDataSource.setFilter(filterRule);
        self.localDataSource.refresh(); 
    });
}

/*
function MobiletodolistViewModel() {
    // Inherit from TodolistViewModel
    var self = this;
    TodolistViewModel.call(self);

    // Data
    self.currentDelivery = ko.observable();
    self.nav = new NavHistory({
        params: { view: 'todolist', deliveryId: null },
        onNavigate: function (navEntry) {
            var requestedDeliveryId = navEntry.params.deliveryId;
            self.dataSource.findById(requestedDeliveryId, self.currentDelivery);
        }
    });

    self.nav.initialize({ linkToUrl: true });

    // Operations
    self.showtodolist = function () { self.nav.navigate({ view: 'todolist' }) }
    self.showCustomers = function () { self.nav.navigate({ view: 'customers' }) }

    self.showDelivery = function (delivery) {
        self.nav.navigate({ view: 'delivery', deliveryId: delivery.DeliveryId() })
    }
}
*/