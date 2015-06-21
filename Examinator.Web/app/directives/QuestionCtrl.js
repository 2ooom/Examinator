var App;
(function (App) {
    var QuestionCtrl = (function () {
        function QuestionCtrl($scope, $element, $ionicScrollDelegate, categories) {
            this.$scope = $scope;
            this.$element = $element;
            this.$ionicScrollDelegate = $ionicScrollDelegate;
            this.categories = categories;
            $scope.questionCtrl = this;
            $scope.question.isCorrect = false;
        }
        QuestionCtrl.GetDirective = function () {
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
            };
        };
        QuestionCtrl.prototype.answerHandle = function () {
            if (!this.$scope.question.isAnswered) {
                this.categories.checkAnswers(this.$scope.question);
            }
            else {
                this.$ionicScrollDelegate.scrollTop();
                if (this.$scope.next) {
                    this.$scope.next();
                }
            }
        };
        QuestionCtrl.prototype.getAnswerButtonText = function () {
            if (!this.$scope.question.isAnswered) {
                return 'Answer';
            }
            else if (this.$scope.question.isCorrect) {
                return 'Correct';
            }
            else {
                return 'Wrong';
            }
        };
        QuestionCtrl.prototype.getCorrectLabel = function () {
            if (this.$scope.question.correct !== 11 && this.$scope.question.correct % 10 === 1) {
                return 'Answer';
            }
            return 'Answers';
        };
        QuestionCtrl.prototype.getAnswerClass = function (answer) {
            if (this.$scope.question.isAnswered && ((answer.selected && answer.isRight) || (answer.isRight && !answer.selected))) {
                return 'checkbox-balanced';
            }
            else if (this.$scope.question.isAnswered && answer.selected && !answer.isRight) {
                return 'checkbox-assertive';
            }
            else {
                return 'checkbox-positive';
            }
        };
        QuestionCtrl.prototype.getAnswerButtonClass = function () {
            if (!this.$scope.question.isAnswered) {
                return 'button-positive';
            }
            var correctClass = this.$scope.question.isCorrect ? 'button-balanced icon-right' : 'button-assertive icon-right';
            if (!this.$scope.isLast) {
                return correctClass + ' ion-chevron-right';
            }
            else {
                return correctClass + ' ion-navicon';
            }
        };
        QuestionCtrl.$inject = [
            '$scope',
            '$element',
            '$ionicScrollDelegate',
            'categories'
        ];
        QuestionCtrl.DirectiveName = 'question';
        return QuestionCtrl;
    })();
    App.QuestionCtrl = QuestionCtrl;
})(App || (App = {}));
