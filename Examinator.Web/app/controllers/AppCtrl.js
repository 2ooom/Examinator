var App;
(function (App) {
    var AppCtrl = (function () {
        function AppCtrl($scope, confirm) {
            this.$inject = [
                '$scope',
                'confirm'
            ];
        }
        return AppCtrl;
    })();
    App.AppCtrl = AppCtrl;
})(App || (App = {}));
