/// <reference path="_all.d.ts" />
var App;
(function (App) {
    angular.module('starter.servicies', []).factory('utils', [
        function () {
            var maxattempts = 1000;
            return {
                getRandomNumbers: function (num, max) {
                    var q = [];
                    var attempts = 0;
                    while (q.length !== num || attempts >= maxattempts) {
                        attempts++;
                        var i = Math.round(Math.round(Math.random() * 100) * (max) / 100);
                        var existing = q.filter(function (c) { return (c === i); });
                        if (existing.length === 0) {
                            q.push(i);
                            attempts = 0;
                        }
                    }
                    if (attempts >= maxattempts) {
                        throw new Error('Invalid arguments. Couldnt find random sequence');
                    }
                    return q;
                }
            };
        }
    ]).factory('categories', [
        'utils',
        function (utils) {
            var categories = window.categories;
            var questions = [];
            categories.forEach(function (c) {
                questions = questions.concat(c.Questions);
            });
            return {
                categories: categories,
                getCategory: function (categoryId) {
                    return categories.filter(function (c) { return (c.Id === categoryId); })[0];
                },
                getQuestion: function (questionId) {
                    return questions.filter(function (q) { return (q.Id === questionId); })[0];
                },
                getRandomQuestions: function (num) {
                    var indexes = utils.getRandomNumbers(num, questions.length - 1);
                    return indexes.map(function (i) { return questions[i]; });
                }
            };
        }
    ]);
})(App || (App = {}));
//# sourceMappingURL=servicies.js.map