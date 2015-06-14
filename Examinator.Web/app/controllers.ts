/// <reference path="_all.d.ts" />
module App {
    angular.module('examinator.controllers', [])
        .controller('AppCtrl', ($scope) => {

            // With the new view caching in Ionic, Controllers are only called
            // when they are recreated or on app start, instead of every page change.
            // To listen for when this page is active (for example, to refresh data),
            // listen for the $ionicView.enter event:
            //$scope.$on('$ionicView.enter', function(e) {
            //});
        
        })
        .controller('CategoriesCtrl', [
            '$scope', 'categories', ($scope, categories) => {
                $scope.categories = categories.categories;
            }
        ])
        .controller('CategoryCtrl', [
            '$scope', '$stateParams', 'categories', '$state', 'storage', ($scope, $stateParams, categories, $state, storage) => {
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

                $scope.next = () => {
                    var answersIndexes = [];
                    $scope.currentQuestion.Answers.forEach((a, i) => {
                        if (a.selected) {
                            answersIndexes.push(i);
                        }
                    });
                    storage.saveAnswers(category.Id, answersIndexes);
                    
                    if ($scope.isLast()) {
                        categories.reset(category.Questions);
                        storage.saveProgress(category.Id, 0);
                        $state.go('app.categories');
                    } else {
                        storage.saveProgress(category.Id, $scope.current);
                        $scope.current++;
                        $scope.currentQuestion = category.Questions[$scope.current - 1];
                    }
                }

                $scope.isLast = () => (category.Questions.length <= $scope.current);

                $scope.$on('$destroy', () => {
                    categories.reset(category.Questions);
                });
            }
        ])
        .controller('ExamCtrl', [
        '$scope', 'categories', '$state', 'settings','$timeout', ($scope, categories, $state, settings, $timeout) => {
                var timerPromise;

                function timer() {
                    timerPromise = $timeout(() => {
                        $scope.secondsElapsed++;
                        if ($scope.secondsElapsed <= settings.examTimeLimitMinutes * 60) {
                            timer();
                        } else {
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
                
                $scope.getTimer = () => {
                    return new Date($scope.secondsElapsed * 1000);
                }

                function complete() {
                    $scope.isFinished = true;
                    $timeout.cancel(timerPromise);
                }

                $scope.next = () => {
                    if (!$scope.currentQuestion.isCorrect) {
                        $scope.wrong++;
                    } else {
                        $scope.correct++;
                    }
                    if ($scope.wrong > settings.examMaxMistakes) {
                        $scope.isFailed = true;
                        complete();
                    }
                    else if ($scope.isLast()) {
                        complete();
                    } else {
                        $scope.current++;
                        $scope.currentQuestion = $scope.questions[$scope.current - 1];
                    }
                }

                $scope.finish = () => {
                    categories.reset($scope.questions);
                    $state.go('app.categories');
                }

                $scope.isLast = () => ($scope.questions.length <= $scope.current);

                $scope.$on('$ionicView.leave',() => {
                    categories.reset($scope.questions);
                    $timeout.cancel(timerPromise);
                });
                $scope.$on('$ionicView.enter', (a, b, c) => {
                    reset();
                });
            }
        ])
        .controller('SettingsCtrl', [
            '$scope', 'settings', ($scope, settings) => {
                $scope.settings = settings;
            }
        ]);

}