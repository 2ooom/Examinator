/// <reference path="../_all.d.ts" />
var App;
(function (App) {
    var Servicies = (function () {
        function Servicies() {
        }
        Servicies.init = function () {
            angular.module(Servicies.Name, []).service('confirm', App.Confirm).service('storage', App.Storage).service('categories', App.Categories).service('utils', App.Utils).factory('settings', [
                '$localStorage',
                function ($localStorage) {
                    if (!$localStorage.settings) {
                        // Set default settings
                        $localStorage.settings = {
                            saveProgress: true,
                            examQuestionsNumber: 35,
                            examTimeLimitMinutes: 45,
                            examMaxMistakes: 5
                        };
                    }
                    else {
                        if ($localStorage.settings.saveProgress === undefined) {
                            $localStorage.settings.saveProgress = true;
                        }
                        if ($localStorage.settings.examQuestionsNumber === undefined) {
                            $localStorage.settings.examQuestionsNumber = 35;
                        }
                        if ($localStorage.settings.examTimeLimitMinutes === undefined) {
                            $localStorage.settings.examTimeLimitMinutes = 45;
                        }
                        if ($localStorage.settings.examMaxMistakes === undefined) {
                            $localStorage.settings.examMaxMistakes = 5;
                        }
                    }
                    return $localStorage.settings;
                }
            ]);
            return Servicies.Name;
        };
        Servicies.Name = 'examinator.servicies';
        return Servicies;
    })();
    App.Servicies = Servicies;
})(App || (App = {}));
//# sourceMappingURL=servicies.js.map