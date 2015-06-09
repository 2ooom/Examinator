/// <reference path="_all.d.ts" />
module App {
    angular.module('starter.directives', [])
        .directive('question', [
            () => {
                function link(scope, element, attributes) {
                    scope.isCorrect = false;

                    scope.answerHandle = () => {
                        if (!scope.question.isAnswered) {
                            scope.checkAnswer();
                        } else {
                            if (scope.next) {
                                scope.next();
                            }
                        }
                    };

                    scope.getAnswerButtonText = () => {
                        if (!scope.question.isAnswered) {
                            return 'Aswer';
                        } else if (scope.isCorrect) {
                            return 'Correct';
                        } else {
                            return 'Wrong';
                        }
                    };

                    scope.getAnswerButtonClass = () => {
                        if (!scope.question.isAnswered) {
                            return 'button-positive';
                        }
                        var correctClass = scope.isCorrect ? 'button-balanced icon-right' : 'button-assertive icon-right';
                        if (!scope.isLast) {
                            return correctClass + ' ion-chevron-right';
                        } else {
                            return correctClass + ' ion-navicon';
                        }
                    }

                    scope.checkAnswer = () => {
                        scope.question.isAnswered = true;
                        var correct = true;
                        for (var i = 0; i < scope.question.Answers.length; i++) {
                            correct = correct && !!scope.question.Answers[i].selected === !!scope.question.Answers[i].IsRight;
                        }
                        scope.isCorrect = correct;
                        scope.question.isAnswered = true;
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
                }
            }
        ]);
}