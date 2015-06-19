var App;
(function (App) {
    angular.module('examinator.controllers', []).controller('AppCtrl', ['$scope', 'confirm', function ($scope, confirm) {
    }]).controller('CategoriesCtrl', [
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
        '$ionicScrollDelegate',
        'confirm',
        function ($scope, $stateParams, categories, $state, storage, $ionicScrollDelegate, confirm) {
            var category = categories.getCategory($stateParams.categoryId);
            function countAnswer(isCorrect) {
                if (isCorrect) {
                    $scope.correct++;
                }
                else {
                    $scope.wrong++;
                }
            }
            function setCurrent(index) {
                $scope.current = index;
                $scope.currentQuestion = category.questions[$scope.current - 1];
            }
            function reset() {
                $scope.category = category;
                setCurrent(1);
                $scope.wrong = 0;
                $scope.correct = 0;
                $scope.isFinished = false;
                var progress = storage.getProgress(category.id) + 1;
                if (progress > 1) {
                    confirm.show('Do you want to continue from question #' + progress + '?', 'Continue', 'Restart').then(function () {
                        setCurrent(progress);
                        console.log('loading question answers from previous session');
                        var answers = storage.getAnswers(category.id);
                        for (var i = 0; i < $scope.current - 1; i++) {
                            var q = category.questions[i];
                            var qa = answers[i];
                            for (var j = 0; j < qa.length; j++) {
                                q.answers[qa[j]].selected = true;
                            }
                            categories.checkAnswers(q);
                            countAnswer(q.isCorrect);
                        }
                    }).catch(function () {
                        storage.saveProgress(category.id, 0);
                    });
                }
            }
            $scope.finish = function () {
                $state.go('app.categories');
            };
            $scope.$on('$ionicView.afterLeave', function () {
                categories.reset(category.questions);
            });
            $scope.$on('$ionicView.beforeEnter', function () {
                $ionicScrollDelegate.scrollTop();
                reset();
            });
            $scope.next = function () {
                var answersIndexes = [];
                $scope.currentQuestion.answers.forEach(function (a, i) {
                    if (a.selected) {
                        answersIndexes.push(i);
                    }
                });
                storage.saveAnswers(category.id, answersIndexes);
                countAnswer($scope.currentQuestion.isCorrect);
                if ($scope.isLast()) {
                    storage.saveProgress(category.id, 0);
                    $scope.isFinished = true;
                }
                else {
                    storage.saveProgress(category.id, $scope.current);
                    $scope.current++;
                    $scope.currentQuestion = category.questions[$scope.current - 1];
                }
            };
            $scope.isLast = function () { return (category.questions.length <= $scope.current); };
            $scope.$on('$destroy', function () {
            });
        }
    ]).controller('ExamCtrl', [
        '$scope',
        'categories',
        '$state',
        'settings',
        '$timeout',
        '$ionicScrollDelegate',
        function ($scope, categories, $state, settings, $timeout, $ionicScrollDelegate) {
            var timerPromise;
            var timeLimitSeconds = settings.examTimeLimitMinutes * 60;
            function timer() {
                timerPromise = $timeout(function () {
                    $scope.secondsElapsed++;
                    if ($scope.secondsElapsed <= timeLimitSeconds) {
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
                return new Date((timeLimitSeconds - $scope.secondsElapsed) * 1000);
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
            $scope.$on('$ionicView.afterLeave', function () {
                categories.reset($scope.questions);
                $timeout.cancel(timerPromise);
            });
            $scope.$on('$ionicView.beforeEnter', function (a, b, c) {
                $ionicScrollDelegate.scrollTop();
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
