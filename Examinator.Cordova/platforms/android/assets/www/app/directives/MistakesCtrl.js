var App;
(function (App) {
    var MistakesCtrl = (function () {
        function MistakesCtrl() {
        }
        MistakesCtrl.GetDirective = function () {
            return {
                scope: {
                    questions: '='
                },
                restrict: 'E',
                templateUrl: 'templates/mistakes.html'
            };
        };
        MistakesCtrl.DirectiveName = 'mistakes';
        return MistakesCtrl;
    })();
    App.MistakesCtrl = MistakesCtrl;
})(App || (App = {}));
