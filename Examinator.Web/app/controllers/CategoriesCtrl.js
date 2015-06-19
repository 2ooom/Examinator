var App;
(function (App) {
    var CategoriesCtrl = (function () {
        function CategoriesCtrl($scope, categories) {
            this.$inject = [
                '$scope',
                'categories'
            ];
            $scope.categories = categories.categories;
        }
        return CategoriesCtrl;
    })();
    App.CategoriesCtrl = CategoriesCtrl;
})(App || (App = {}));
