/// <reference path="_all.d.ts" />
var App;
(function (App) {
    var Categories = (function () {
        function Categories(utils, $window) {
            var _this = this;
            this.utils = utils;
            this.$window = $window;
            this.categories = $window.categories;
            this.questions = [];
            categories.forEach(function (c) {
                _this.questions = _this.questions.concat(c.questions);
            });
        }
        Categories.prototype.getCategory = function (categoryId) {
            return categories.filter(function (c) { return (c.id === categoryId); })[0];
        };
        Categories.prototype.getQuestion = function (questionId) {
            return this.questions.filter(function (q) { return (q.id === questionId); })[0];
        };
        Categories.prototype.getRandomQuestions = function (num) {
            var _this = this;
            var indexes = this.utils.getRandomNumbers(num, this.questions.length - 1);
            return indexes.map(function (i) { return _this.questions[i]; });
        };
        Categories.prototype.checkAnswers = function (question) {
            var correct = true;
            for (var i = 0; i < question.answers.length; i++) {
                correct = correct && !!question.answers[i].selected === !!question.answers[i].isRight;
            }
            question.isCorrect = correct;
            question.isAnswered = true;
        };
        Categories.prototype.reset = function (questionsList) {
            questionsList.forEach(function (q) {
                q.answers.forEach(function (a) {
                    delete a.selected;
                });
                delete q.isAnswered;
                delete q.isCorrect;
            });
        };
        Categories.$inject = [
            'utils',
            '$window'
        ];
        return Categories;
    })();
    App.Categories = Categories;
})(App || (App = {}));
//# sourceMappingURL=categories.js.map