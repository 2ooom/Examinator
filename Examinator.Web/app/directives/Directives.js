var App;
(function (App) {
    var Directives = (function () {
        function Directives() {
        }
        Directives.init = function () {
            angular.module(Directives.Name, []).directive(App.QuestionCtrl.DirectiveName, App.QuestionCtrl.GetDirective).directive(App.MistakesCtrl.DirectiveName, App.MistakesCtrl.GetDirective);
            return Directives.Name;
        };
        Directives.Name = 'examinator.directives';
        return Directives;
    })();
    App.Directives = Directives;
})(App || (App = {}));
