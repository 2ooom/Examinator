/// <reference path="../_all.d.ts" />

module App {
    export class CategoriesCtrl {
        public $inject = [
            '$scope',
            'categories'
        ];

        constructor(
            $scope: any,
            categories: Categories
            ) {
            $scope.categories = categories.categories;
        }
        
    }
}