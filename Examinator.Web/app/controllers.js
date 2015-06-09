/// <reference path="_all.d.ts" />
var App;
(function (App) {
    angular.module('examinator.controllers', []).controller('AppCtrl', function ($scope, $ionicModal, $timeout) {
        // With the new view caching in Ionic, Controllers are only called
        // when they are recreated or on app start, instead of every page change.
        // To listen for when this page is active (for example, to refresh data),
        // listen for the $ionicView.enter event:
        //$scope.$on('$ionicView.enter', function(e) {
        //});
        // Form data for the login modal
        $scope.loginData = {};
        // Create the login modal that we will use later
        $ionicModal.fromTemplateUrl('templates/login.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.modal = modal;
        });
        // Triggered in the login modal to close it
        $scope.closeLogin = function () {
            $scope.modal.hide();
        };
        // Open the login modal
        $scope.login = function () {
            $scope.modal.show();
        };
        // Perform the login action when the user submits the login form
        $scope.doLogin = function () {
            console.log('Doing login', $scope.loginData);
            // Simulate a login delay. Remove this and replace with your login
            // code if using a login system
            $timeout(function () {
                $scope.closeLogin();
            }, 1000);
        };
    }).controller('QuestionCtrl', [
        '$scope',
        'categories',
        '$stateParams',
        function ($scope, categories, $stateParams) {
            $scope.question = categories.getQuestion($stateParams.questionId);
        }
    ]).controller('CategoriesCtrl', [
        '$scope',
        'categories',
        function ($scope, categories) {
            $scope.categories = categories.categories;
        }
    ]).controller('CategoryCtrl', [
        '$scope',
        '$stateParams',
        'categories',
        '$state',
        function ($scope, $stateParams, categories, $state) {
            var category = categories.getCategory($stateParams.categoryId);
            var questions = [];
            $scope.category = category;
            $scope.currentQuestion = category.Questions[0];
            $scope.current = 1;
            var cleanup = function () {
                category.Questions.forEach(function (q) {
                    q.Answers.forEach(function (a) {
                        delete a.selected;
                    });
                    delete q.isAnswered;
                });
            };
            $scope.next = function () {
                questions.push($scope.currentQuestion);
                if ($scope.isLast()) {
                    cleanup();
                    $state.go('app.categories');
                }
                else {
                    $scope.current++;
                    $scope.currentQuestion = category.Questions[$scope.current - 1];
                }
            };
            $scope.isLast = function () { return (category.Questions.length <= $scope.current); };
            $scope.$on('$destroy', function () {
                cleanup();
            });
        }
    ]).controller('ExamCtrl', [
        '$scope',
        'categories',
        '$state',
        function ($scope, categories, $state) {
        }
    ]);
})(App || (App = {}));
//# sourceMappingURL=controllers.js.map