angular.module('starter.servicies', [])
    .factory('categories', [
        function() {
            var categories = window.categories;
            var questions = [];
            categories.forEach(function(c) { questions = questions.concat(c.Questions) });
            return {
                categories: categories,
                getCategory: function(categoryId) {
                    return categories.filter(function(c) { return c.Id === categoryId })[0];
                },
                getQuestion: function(questionId) {
                    return questions.filter(function (q) { return q.Id === questionId })[0];
                }
            }
        }
    ]);
