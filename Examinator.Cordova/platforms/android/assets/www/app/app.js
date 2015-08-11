var App;
(function (App) {
    angular.module('examinator', [
        'ionic',
        App.Servicies.init(),
        App.Directives.init()
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
                'main': {
                    templateUrl: "templates/settings.html",
                    controller: App.SettingsCtrl
                }
            }
        }).state('app.exam', {
            url: "/exam",
            views: {
                'main': {
                    templateUrl: "templates/exam.html",
                    controller: App.ExamCtrl
                }
            }
        }).state('app.categories', {
            url: "/categories",
            views: {
                'main': {
                    templateUrl: "templates/categories.html",
                    controller: App.CategoriesCtrl
                }
            }
        }).state('app.category', {
            url: "/category/:categoryId",
            views: {
                'main': {
                    templateUrl: "templates/category.html",
                    controller: App.CategoryCtrl
                }
            }
        });
        $urlRouterProvider.otherwise('/app/categories');
    });
})(App || (App = {}));
