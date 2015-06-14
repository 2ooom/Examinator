/// <reference path="_all.d.ts" />
module App {
    angular.module('examinator.controllers', [])
        .controller('AppCtrl', ['$scope', 'confirm',
        ($scope, confirm) => {

            }
        ])
        .controller('CategoriesCtrl', [
            '$scope', 'categories', ($scope, categories) => {
                $scope.categories = categories.categories;
            }
        ])
        .controller('CategoryCtrl', [
        '$scope', '$stateParams', 'categories', '$state', 'storage', '$ionicScrollDelegate','confirm', ($scope, $stateParams, categories, $state, storage, $ionicScrollDelegate, confirm) => {

            var category = categories.getCategory($stateParams.categoryId);

                function countAnswer(isCorrect:boolean) {
                    if(isCorrect) {
                        $scope.correct++;
                    } else {
                        $scope.wrong++;
                    }
                }

                function setCurrent(index: number) {
                    $scope.current = index;
                    $scope.currentQuestion = category.Questions[$scope.current - 1];
                }
                function reset() {
                    $scope.category = category;
                    setCurrent(1);
                    
                    $scope.wrong = 0;
                    $scope.correct = 0;
                    $scope.isFinished = false;

                    var progress = storage.getProgress(category.Id) + 1;

                    if (progress > 1) {
                        confirm.show('Do you want to continue from question #' + progress + '?', 'Continue', 'Restart').then(() => {
                            setCurrent(progress);
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
                                categories.checkAnswers(q);
                                countAnswer(q.isCorrect);
                            }
                        }).catch(() => {
                            storage.saveProgress(category.Id, 0);
                        });
                    }
                }

                $scope.finish = () => {
                    $state.go('app.categories');
                }

                $scope.$on('$ionicView.afterLeave',() => {
                    categories.reset(category.Questions);
                });

                $scope.$on('$ionicView.beforeEnter',() => {
                    $ionicScrollDelegate.scrollTop();
                    reset();
                });

                $scope.next = () => {
                    var answersIndexes = [];
                    $scope.currentQuestion.Answers.forEach((a, i) => {
                        if (a.selected) {
                            answersIndexes.push(i);
                        }
                    });
                    storage.saveAnswers(category.Id, answersIndexes);
                    countAnswer($scope.currentQuestion.isCorrect);
                    if ($scope.isLast()) {
                        storage.saveProgress(category.Id, 0);
                        $scope.isFinished = true;

                    } else {
                        storage.saveProgress(category.Id, $scope.current);
                        $scope.current++;
                        $scope.currentQuestion = category.Questions[$scope.current - 1];
                    }
                }
                
                $scope.isLast = () => (category.Questions.length <= $scope.current);
                
                $scope.$on('$destroy', () => {
                    //categories.reset(category.Questions);
                });
            }
        ])
        .controller('ExamCtrl', [
        '$scope', 'categories', '$state', 'settings', '$timeout', '$ionicScrollDelegate', ($scope, categories, $state, settings, $timeout, $ionicScrollDelegate) => {
                var timerPromise;
                var timeLimitSeconds = settings.examTimeLimitMinutes * 60;
                function timer() {
                    timerPromise = $timeout(() => {
                        $scope.secondsElapsed++;
                        if ($scope.secondsElapsed <= timeLimitSeconds) {
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
                    return new Date((timeLimitSeconds - $scope.secondsElapsed) * 1000);
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

                $scope.$on('$ionicView.afterLeave',() => {
                    categories.reset($scope.questions);
                    $timeout.cancel(timerPromise);
                });

                $scope.$on('$ionicView.beforeEnter',(a, b, c) => {
                    $ionicScrollDelegate.scrollTop();
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