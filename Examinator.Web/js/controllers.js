angular.module('starter.controllers', [])
    .controller('AppCtrl', function($scope, $ionicModal, $timeout) {

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
        }).then(function(modal) {
            $scope.modal = modal;
        });

        // Triggered in the login modal to close it
        $scope.closeLogin = function() {
            $scope.modal.hide();
        };

        // Open the login modal
        $scope.login = function() {
            $scope.modal.show();
        };

        // Perform the login action when the user submits the login form
        $scope.doLogin = function() {
            console.log('Doing login', $scope.loginData);

            // Simulate a login delay. Remove this and replace with your login
            // code if using a login system
            $timeout(function() {
                $scope.closeLogin();
            }, 1000);
        };
    })
    .controller('QuestionCtrl', [
        '$scope', 'categories','$stateParams', function($scope, categories, $stateParams) {
            $scope.question = categories.getQuestion($stateParams.questionId);
        }
    ])
    .controller('CategoriesCtrl', [
        '$scope', 'categories', function($scope, categories) {
            $scope.categories = categories.categories;
        }
    ])
    .controller('CategoryCtrl', [
        '$scope', '$stateParams', 'categories', '$state', function($scope, $stateParams, categories, $state) {
            var category = categories.getCategory($stateParams.categoryId);
            var questions = [];
            $scope.category = category;
            if ($stateParams.questionId) {
                console.log($stateParams.questionId);
            } else {
                $scope.current = 1;
                $state.go('app.category.question', { questionId: category.Questions[0].Id });
            }
            var cleanup = function() {
                category.Questions.forEach(function (q) {
                    q.Answers.forEach(function(a) {
                        delete a.selected;
                    });
                    delete q.isAnswered;
                });
            };
            $scope.answerHandle = function() {
                if (!$scope.isAnswered) {
                    $scope.checkAnswer();
                } else if (category.Questions.length > $scope.current) {
                    $scope.next();
                } else {
                    $scope.finish();
                }
            };

            $scope.getAnswerButtonText = function () {
                if (!$scope.isAnswered) {
                    return 'Aswer';
                } else if ($scope.isCorrect) {
                    return 'Correct';
                } else {
                    return 'Wrong';
                }
            };

            $scope.getAnswerButtonClass = function () {
                if (!$scope.isAnswered) {
                    return 'button-positive';
                }
                var correctClass = $scope.isCorrect ? 'button-balanced icon-right' : 'button-assertive icon-right';
                if (category.Questions.length > $scope.current) {
                    return correctClass + ' ion-chevron-right';
                } else {
                    return correctClass + ' ion-navicon';
                }
            }

            $scope.checkAnswer = function() {
                $scope.isAnswered = true;
                var question = categories.getQuestion(category.Questions[$scope.current - 1].Id);
                questions.push(question);
                var correct = true;
                for (var i = 0; i < question.Answers.length; i++) {
                    correct = correct && !!question.Answers[i].selected === !!question.Answers[i].IsRight;
                }
                $scope.isCorrect = correct;
                question.isAnswered = true;
            };

            $scope.next = function () {
                $scope.isAnswered = false;
                $scope.current++;
                $state.go('app.category.question', { questionId: category.Questions[$scope.current - 1].Id });
            }

            $scope.finish = function () {
                cleanup();
                $state.go('app.categories');
            }

            $scope.$on('$destroy', function() {
                cleanup();
            });
        }
    ]);
