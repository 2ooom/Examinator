/// <reference path="_all.d.ts" />

module App {
    angular.module('examinator', [
            'ionic',
            Servicies.init(),
            Directives.init()
        ])
        .run($ionicPlatform => {
            $ionicPlatform.ready(() => {
                // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
                // for form inputs)
                if ((<any>window).cordova && (<any>window).cordova.plugins.Keyboard) {
                    cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                }
                if ((<any>window).StatusBar) {
                    // org.apache.cordova.statusbar required
                    StatusBar.styleDefault();
                }
            });
        })
        .config(($stateProvider, $urlRouterProvider) => {
            $stateProvider
                .state('app', {
                    url: "/app",
                    abstract: true,
                    templateUrl: "templates/menu.html",
                    controller: AppCtrl
                })
                .state('app.settings', {
                    url: "/settings",
                    views: {
                        'main': {
                            templateUrl: "templates/settings.html",
                            controller: SettingsCtrl
                        }
                    }
                })
                .state('app.exam', {
                    url: "/exam",
                    views: {
                        'main': {
                            templateUrl: "templates/exam.html",
                            controller: ExamCtrl
                        }
                    }
                })
                .state('app.categories', {
                    url: "/categories",
                    views: {
                        'main': {
                            templateUrl: "templates/categories.html",
                            controller: CategoriesCtrl
                        }
                    }
                })
                .state('app.category', {
                    url: "/category/:categoryId",
                    views: {
                        'main': {
                            templateUrl: "templates/category.html",
                            controller: CategoryCtrl
                        }
                    }
                });
            // if none of the above states are matched, use this as the fallback
            $urlRouterProvider.otherwise('/app/categories');
        });
}