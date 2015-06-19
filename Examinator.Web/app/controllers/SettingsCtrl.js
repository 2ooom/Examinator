var App;
(function (App) {
    var SettingsCtrl = (function () {
        function SettingsCtrl($scope, settings) {
            this.$inject = [
                '$scope',
                'settings'
            ];
            $scope.settings = settings;
        }
        return SettingsCtrl;
    })();
    App.SettingsCtrl = SettingsCtrl;
})(App || (App = {}));
