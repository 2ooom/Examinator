var App;
(function (App) {
    var Servicies = (function () {
        function Servicies() {
        }
        Servicies.init = function () {
            angular.module(Servicies.Name, []).service('confirm', App.Confirm).service('storage', App.Storage).service('categories', App.Categories).service('utils', App.Utils).service('settings', App.Settings);
            return Servicies.Name;
        };
        Servicies.Name = 'examinator.servicies';
        return Servicies;
    })();
    App.Servicies = Servicies;
})(App || (App = {}));
