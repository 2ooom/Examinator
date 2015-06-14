/// <reference path="_all.d.ts" />
module App {
    angular.module('examinator.directives', [])
        .directive('mistakes', [
            () => {

                return {
                    scope: {
                        questions: '='
                    },
                    restrict: 'E',
                    templateUrl: 'templates/mistakes.html'
                }
            }
        ])
        .directive('question', ['$ionicScrollDelegate', 'categories',
        ($ionicScrollDelegate, categories) => {
                function link(scope, element, attributes) {
                    scope.question.isCorrect = false;

                    scope.answerHandle = () => {
                        if (!scope.question.isAnswered) {
                            categories.checkAnswers(scope.question);
                        } else {
                            $ionicScrollDelegate.scrollTop();
                            if (scope.next) {
                                scope.next();
                            }
                        }
                    };

                    scope.getAnswerButtonText = () => {
                        if (!scope.question.isAnswered) {
                            return 'Answer';
                        } else if (scope.question.isCorrect) {
                            return 'Correct';
                        } else {
                            return 'Wrong';
                        }
                    };

                    scope.getAnswerButtonClass = () => {
                        if (!scope.question.isAnswered) {
                            return 'button-positive';
                        }
                        var correctClass = scope.question.isCorrect ? 'button-balanced icon-right' : 'button-assertive icon-right';
                        if (!scope.isLast) {
                            return correctClass + ' ion-chevron-right';
                        } else {
                            return correctClass + ' ion-navicon';
                        }
                    }
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
                }
            }
        ]);
}