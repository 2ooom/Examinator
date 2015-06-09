/// <reference path="_all.d.ts" />
var App;
(function (App) {
    angular.module('starter', ['ionic', 'starter.controllers', 'starter.servicies', 'starter.directives']).run(function ($ionicPlatform) {
        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }
        });
    }).config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider.state('app', {
            url: "/app",
            abstract: true,
            templateUrl: "templates/menu.html",
            controller: 'AppCtrl'
        }).state('app.search', {
            url: "/search",
            views: {
                'menuContent': {
                    templateUrl: "templates/search.html"
                }
            }
        }).state('app.browse', {
            url: "/browse",
            views: {
                'menuContent': {
                    templateUrl: "templates/browse.html"
                }
            }
        }).state('app.exam', {
            url: "/exam",
            views: {
                'menuContent': {
                    templateUrl: "templates/exam.html",
                    controller: 'ExamsCtrl'
                }
            }
        }).state('app.categories', {
            url: "/categories",
            views: {
                'menuContent': {
                    templateUrl: "templates/categories.html",
                    controller: 'CategoriesCtrl'
                }
            }
        }).state('app.category', {
            url: "/category/:categoryId",
            views: {
                'menuContent': {
                    templateUrl: "templates/category.html",
                    controller: 'CategoryCtrl'
                }
            }
        }).state('app.category.question', {
            url: "/question/:questionId",
            views: {
                'categoryContent': {
                    templateUrl: "templates/question.html",
                    controller: 'QuestionCtrl'
                }
            }
        });
        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/app/categories');
    });
})(App || (App = {}));
//# sourceMappingURL=app.js.map