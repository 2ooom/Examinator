var App;
(function (App) {
    var Servicies = (function () {
        function Servicies() {
        }
        Servicies.init = function () {
            console.log('Init servicies');
            angular.module(Servicies.Name, [
                'ngStorage'
            ]).service('confirm', App.Confirm).service('storage', App.Storage).service('categories', App.Categories).service('utils', App.Utils).service('settings', App.Settings);
            return Servicies.Name;
        };
        Servicies.Name = 'examinator.servicies';
        return Servicies;
    })();
    App.Servicies = Servicies;
})(App || (App = {}));
