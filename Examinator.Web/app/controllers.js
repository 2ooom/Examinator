/// <reference path="_all.d.ts" />
var App;
(function (App) {
    angular.module('examinator.controllers', []).controller('AppCtrl', function ($scope) {
        // With the new view caching in Ionic, Controllers are only called
        // when they are recreated or on app start, instead of every page change.
        // To listen for when this page is active (for example, to refresh data),
        // listen for the $ionicView.enter event:
        //$scope.$on('$ionicView.enter', function(e) {
        //});
    }).controller('CategoriesCtrl', [
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
        'storage',
        function ($scope, $stateParams, categories, $state, storage) {
            var category = categories.getCategory($stateParams.categoryId);
            $scope.category = category;
            $scope.current = storage.getProgress(category.Id) + 1;
            $scope.currentQuestion = category.Questions[$scope.current - 1];
            if ($scope.current > 1) {
                console.log('loading question answers from previous session');
                var answers = storage.getAnswers(category.Id);
                for (var i = 0; i < $scope.current - 1; i++) {
                    var q = category.Questions[i];
                    var qa = answers[i];
                    console.log('loading answers for question [' + q.Id + ']: ');
                    console.log(qa);
                    for (var j = 0; j < qa.length; j++) {
                        q.Answers[qa[j]].selected = true;
                    }
                }
            }
            $scope.next = function () {
                var answersIndexes = [];
                $scope.currentQuestion.Answers.forEach(function (a, i) {
                    if (a.selected) {
                        answersIndexes.push(i);
                    }
                });
                storage.saveAnswers(category.Id, answersIndexes);
                if ($scope.isLast()) {
                    categories.reset(category.Questions);
                    storage.saveProgress(category.Id, 0);
                    $state.go('app.categories');
                }
                else {
                    storage.saveProgress(category.Id, $scope.current);
                    $scope.current++;
                    $scope.currentQuestion = category.Questions[$scope.current - 1];
                }
            };
            $scope.isLast = function () { return (category.Questions.length <= $scope.current); };
            $scope.$on('$destroy', function () {
                categories.reset(category.Questions);
            });
        }
    ]).controller('ExamCtrl', [
        '$scope',
        'categories',
        '$state',
        'settings',
        '$timeout',
        function ($scope, categories, $state, settings, $timeout) {
            var timerPromise;
            function timer() {
                timerPromise = $timeout(function () {
                    $scope.secondsElapsed++;
                    if ($scope.secondsElapsed <= settings.examTimeLimitMinutes * 60) {
                        timer();
                    }
                    else {
                        $scope.isFinished = true;
                        $scope.isFailed = true;
                        $scope.isTimerElapsed = true;
                    }
                }, 1000);
            }
            function reset() {
                $scope.total = settings.examQuestionsNumber;
                $scope.current = 1;
                $scope.wrong = 0;
                $scope.correct = 0;
                $scope.isFailed = false;
                $scope.isFinished = false;
                $scope.isTimerElapsed = false;
                $scope.secondsElapsed = 0;
                $scope.questions = categories.getRandomQuestions(settings.examQuestionsNumber);
                $scope.currentQuestion = $scope.questions[$scope.current - 1];
                timer();
            }
            $scope.getTimer = function () {
                return new Date($scope.secondsElapsed * 1000);
            };
            function complete() {
                $scope.isFinished = true;
                $timeout.cancel(timerPromise);
            }
            $scope.next = function () {
                if (!$scope.currentQuestion.isCorrect) {
                    $scope.wrong++;
                }
                else {
                    $scope.correct++;
                }
                if ($scope.wrong > settings.examMaxMistakes) {
                    $scope.isFailed = true;
                    complete();
                }
                else if ($scope.isLast()) {
                    complete();
                }
                else {
                    $scope.current++;
                    $scope.currentQuestion = $scope.questions[$scope.current - 1];
                }
            };
            $scope.finish = function () {
                categories.reset($scope.questions);
                $state.go('app.categories');
            };
            $scope.isLast = function () { return ($scope.questions.length <= $scope.current); };
            $scope.$on('$ionicView.leave', function () {
                categories.reset($scope.questions);
                $timeout.cancel(timerPromise);
            });
            $scope.$on('$ionicView.enter', function (a, b, c) {
                reset();
            });
        }
    ]).controller('SettingsCtrl', [
        '$scope',
        'settings',
        function ($scope, settings) {
            $scope.settings = settings;
        }
    ]);
})(App || (App = {}));
//# sourceMappingURL=controllers.js.map