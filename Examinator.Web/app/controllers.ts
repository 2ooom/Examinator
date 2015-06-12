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
                var questions = [];
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

                var cleanup = () => {
                    category.Questions.forEach(q => {
                        q.Answers.forEach(a => {
                            delete a.selected;
                        });
                        delete q.isAnswered;
                    });
                };

                $scope.next = () => {
                    questions.push($scope.currentQuestion);
                    var answersIndexes = [];
                    $scope.currentQuestion.Answers.forEach((a, i) => {
                        if (a.selected) {
                            answersIndexes.push(i);
                        }
                    });
                    storage.saveAnswers(category.Id, answersIndexes);
                    
                    if ($scope.isLast()) {
                        cleanup();
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
                    cleanup();
                });
            }
        ])
        .controller('ExamCtrl', [
            '$scope', 'categories', '$state', ($scope, categories, $state) => {

            }
        ])
        .controller('SettingsCtrl', [
            '$scope', 'settings', ($scope, settings) => {
                $scope.settings = settings;
            }
        ]);

}