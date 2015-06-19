var App;
(function (App) {
    angular.module('examinator.directives', []).directive('mistakes', [
        function () {
            return {
                scope: {
                    questions: '='
                },
                restrict: 'E',
                templateUrl: 'templates/mistakes.html'
            };
        }
    ]).directive('question', ['$ionicScrollDelegate', 'categories', function ($ionicScrollDelegate, categories) {
        function link(scope) {
            scope.question.isCorrect = false;
            scope.answerHandle = function () {
                if (!scope.question.isAnswered) {
                    categories.checkAnswers(scope.question);
                }
                else {
                    $ionicScrollDelegate.scrollTop();
                    if (scope.next) {
                        scope.next();
                    }
                }
            };
            scope.getAnswerButtonText = function () {
                if (!scope.question.isAnswered) {
                    return 'Answer';
                }
                else if (scope.question.isCorrect) {
                    return 'Correct';
                }
                else {
                    return 'Wrong';
                }
            };
            scope.getAnswerClass = function (answer) {
                if (scope.question.isAnswered && ((answer.selected && answer.isRight) || (answer.isRight && !answer.selected))) {
                    return 'checkbox-balanced';
                }
                else if (scope.question.isAnswered && answer.selected && !answer.isRight) {
                    return 'checkbox-assertive';
                }
                else {
                    return 'checkbox-positive';
                }
            };
            scope.getAnswerButtonClass = function () {
                if (!scope.question.isAnswered) {
                    return 'button-positive';
                }
                var correctClass = scope.question.isCorrect ? 'button-balanced icon-right' : 'button-assertive icon-right';
                if (!scope.isLast) {
                    return correctClass + ' ion-chevron-right';
                }
                else {
                    return correctClass + ' ion-navicon';
                }
            };
        }
        return {
            scope: {
                question: '=',
                isLast: '=',
                next: '&',
                finish: '&'
            },
            restrict: 'AE',
            templateUrl: 'templates/question.html',
            link: link
        };
    }]);
})(App || (App = {}));
