var App;
(function (App) {
    var Categories = (function () {
        function Categories(utils, $window) {
            var _this = this;
            this.utils = utils;
            this.$window = $window;
            this.categories = $window.categories;
            this.questions = [];
            this.categories.forEach(function (c) {
                _this.questions = _this.questions.concat(c.questions);
            });
        }
        Categories.prototype.getCategory = function (categoryId) {
            return this.categories.filter(function (c) { return (c.id === categoryId); })[0];
        };
        Categories.prototype.getQuestion = function (questionId) {
            return this.questions.filter(function (q) { return (q.id === questionId); })[0];
        };
        Categories.prototype.getRandomQuestions = function (num) {
            var _this = this;
            var indexes = this.utils.getRandomNumbers(num, this.questions.length - 1);
            return indexes.map(function (i) {
                var q = _this.questions[i];
                var qCopy = angular.extend({}, q);
                qCopy.answers = [];
                q.answers.forEach(function (a) {
                    qCopy.answers.push(angular.extend({}, a));
                });
                _this.utils.shuffle(qCopy.answers);
                return qCopy;
            });
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
        Categories.prototype.getImageUrls = function () {
            var imgs = [];
            this.questions.forEach(function (q) {
                if (q.imageUrl) {
                    imgs.push(q.imageUrl);
                }
                q.answers.forEach(function (a) {
                    if (a.imageUrl) {
                        imgs.push(a.imageUrl);
                    }
                });
            });
            return imgs;
        };
        Categories.$inject = [
            'utils',
            '$window'
        ];
        return Categories;
    })();
    App.Categories = Categories;
})(App || (App = {}));
