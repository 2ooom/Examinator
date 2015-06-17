/// <reference path="../_all.d.ts" />
var App;
(function (App) {
    var Config = (function () {
        function Config() {
        }
        Config.Init = function () {
            angular.module(Config.Name, []).service('categories', App.Categories).service('utils', App.Utils);
        };
        Config.Name = 'examinator.servicies';
        return Config;
    })();
    App.Config = Config;
})(App || (App = {}));
//# sourceMappingURL=config.js.map