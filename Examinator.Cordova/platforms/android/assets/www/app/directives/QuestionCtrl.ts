/// <reference path="../_all.d.ts" />

module App {
    export interface IQuestionCtrlScope {
        questionCtrl: QuestionCtrl;
        question:IQuestion;
        isLast:boolean;
        next:() => void;
        finish:() => void;
    }

    export class QuestionCtrl {

        public static $inject = [
            '$scope',
            '$element',
            '$ionicScrollDelegate',
            'categories'
        ];

        private inputElement: ng.IAugmentedJQuery;

        static DirectiveName = 'question';

        static GetDirective() {
            return {
                scope: {
                    question: '=',
                    isLast: '=',
                    next: '&',
                    finish: '&'
                },
                restrict: 'AE',
                templateUrl: 'templates/question.html',
                controller: QuestionCtrl
            }
        }

        constructor(
            private $scope: IQuestionCtrlScope,
            private $element: ng.IAugmentedJQuery,
            private $ionicScrollDelegate: any,
            private categories:Categories) {
            $scope.questionCtrl = this;
            $scope.question.isCorrect = false;
        }

        answerHandle () {
            if (!this.$scope.question.isAnswered) {
                this.categories.checkAnswers(this.$scope.question);
            } else {
                this.$ionicScrollDelegate.scrollTop();
                if (this.$scope.next) {
                    this.$scope.next();
                }
            }
        }

        getAnswerButtonText () {
            if (!this.$scope.question.isAnswered) {
                return 'Answer';
            } else if (this.$scope.question.isCorrect) {
                return 'Correct';
            } else {
                return 'Wrong';
            }
        }
        getCorrectLabel() {
            if (this.$scope.question.correct !== 11 &&
                this.$scope.question.correct % 10 === 1) {
                return 'Answer';
            }
            return 'Answers';
        }

        getAnswerClass (answer: IAnswer) {
            if (this.$scope.question.isAnswered && ((answer.selected && answer.isRight) || (answer.isRight && !answer.selected))) {
                return 'checkbox-balanced';
            } else if (this.$scope.question.isAnswered && answer.selected && !answer.isRight) {
                return 'checkbox-assertive';
            } else {
                return 'checkbox-positive';
            }
        }

        getAnswerButtonClass () {
            if (!this.$scope.question.isAnswered) {
                return 'button-positive';
            }
            var correctClass = this.$scope.question.isCorrect ? 'button-balanced icon-right' : 'button-assertive icon-right';
            if (!this.$scope.isLast) {
                return correctClass + ' ion-chevron-right';
            } else {
                return correctClass + ' ion-navicon';
            }
        }
    }
}