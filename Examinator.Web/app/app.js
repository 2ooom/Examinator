var App;
(function (App) {
    angular.module('examinator', [
        'ionic',
        'ngStorage',
        'examinator.controllers',
        App.Servicies.init(),
        'examinator.directives'
    ]).run(function ($ionicPlatform) {
        $ionicPlatform.ready(function () {
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if (window.StatusBar) {
                StatusBar.styleDefault();
            }
        });
    }).config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider.state('app', {
            url: "/app",
            abstract: true,
            templateUrl: "templates/menu.html",
            controller: App.AppCtrl
        }).state('app.settings', {
            url: "/settings",
            views: {
                'menuContent': {
                    templateUrl: "templates/settings.html",
                    controller: App.SettingsCtrl
                }
            }
        }).state('app.exam', {
            url: "/exam",
            views: {
                'menuContent': {
                    templateUrl: "templates/exam.html",
                    controller: 'ExamCtrl'
                }
            }
        }).state('app.categories', {
            url: "/categories",
            views: {
                'menuContent': {
                    templateUrl: "templates/categories.html",
                    controller: App.CategoriesCtrl
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
        });
        $urlRouterProvider.otherwise('/app/categories');
    });
})(App || (App = {}));
