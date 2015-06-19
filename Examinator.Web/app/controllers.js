var App;
(function (App) {
    angular.module('examinator.controllers', []).controller('ExamCtrl', [
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
    ]);
})(App || (App = {}));
