angular.module('starter.servicies', [])

.factory('categories', [function () {
    var categories = window.categories;
    return {
        categories: categories,
        getCategory: function(categoryId) {
            return categories.filter(function(c) { return c.Id === categoryId })[0];
        },
        getQuestion: function(category, questionId) {
            return category.Questions.filter(function (q) { return q.Id === questionId })[0];
        }
    }
}]);
