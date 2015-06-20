var App;
(function (App) {
    var CategoryCtrl = (function () {
        function CategoryCtrl($scope, $stateParams, categories, $state, storage, $ionicScrollDelegate, confirm) {
            var _this = this;
            this.$stateParams = $stateParams;
            this.categories = categories;
            this.$state = $state;
            this.storage = storage;
            this.$ionicScrollDelegate = $ionicScrollDelegate;
            this.confirm = confirm;
            this.current = 1;
            this.wrong = 0;
            this.correct = 0;
            this.isFinished = false;
            this.category = this.categories.getCategory(parseInt($stateParams.categoryId));
            $scope.$on('$ionicView.afterLeave', function () {
                _this.categories.reset(_this.category.questions);
            });
            $scope.$on('$ionicView.beforeEnter', function () {
                $ionicScrollDelegate.scrollTop();
                _this.reset();
            });
            $scope.$on('$destroy', function () {
            });
            $scope.categoryCtrl = this;
        }
        CategoryCtrl.prototype.countAnswer = function (isCorrect) {
            if (isCorrect) {
                this.correct++;
            }
            else {
                this.wrong++;
            }
        };
        CategoryCtrl.prototype.setCurrent = function (index) {
            this.current = index;
            this.currentQuestion = this.category.questions[this.current - 1];
        };
        CategoryCtrl.prototype.reset = function () {
            var _this = this;
            this.setCurrent(1);
            this.wrong = 0;
            this.correct = 0;
            this.isFinished = false;
            var progress = this.storage.getProgress(this.category.id) + 1;
            if (progress > 1) {
                this.confirm.show('Do you want to continue from question #' + progress + '?', 'Continue', 'Restart').then(function () {
                    _this.setCurrent(progress);
                    console.log('loading question answers from previous session');
                    var answers = _this.storage.getAnswers(_this.category.id);
                    for (var i = 0; i < _this.current - 1; i++) {
                        var q = _this.category.questions[i];
                        var qa = answers[i];
                        for (var j = 0; j < qa.length; j++) {
                            q.answers[qa[j]].selected = true;
                        }
                        _this.categories.checkAnswers(q);
                        _this.countAnswer(q.isCorrect);
                    }
                }).catch(function () {
                    _this.storage.saveProgress(_this.category.id, 0);
                });
            }
        };
        CategoryCtrl.prototype.finish = function () {
            this.$state.go('app.categories');
        };
        CategoryCtrl.prototype.next = function () {
            var answersIndexes = [];
            this.currentQuestion.answers.forEach(function (a, i) {
                if (a.selected) {
                    answersIndexes.push(i);
                }
            });
            this.storage.saveAnswers(this.category.id, answersIndexes);
            this.countAnswer(this.currentQuestion.isCorrect);
            if (this.isLast()) {
                this.storage.saveProgress(this.category.id, 0);
                this.isFinished = true;
            }
            else {
                this.storage.saveProgress(this.category.id, this.current);
                this.current++;
                this.currentQuestion = this.category.questions[this.current - 1];
            }
        };
        CategoryCtrl.prototype.isLast = function () {
            return this.category.questions.length <= this.current;
        };
        CategoryCtrl.$inject = [
            '$scope',
            '$stateParams',
            'categories',
            '$state',
            'storage',
            '$ionicScrollDelegate',
            'confirm'
        ];
        return CategoryCtrl;
    })();
    App.CategoryCtrl = CategoryCtrl;
})(App || (App = {}));
