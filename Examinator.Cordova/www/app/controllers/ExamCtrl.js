var App;
(function (App) {
    var ExamCtrl = (function () {
        function ExamCtrl($scope, categories, $state, settings, $timeout, $ionicScrollDelegate) {
            var _this = this;
            this.categories = categories;
            this.$state = $state;
            this.settings = settings;
            this.$timeout = $timeout;
            this.$ionicScrollDelegate = $ionicScrollDelegate;
            this.current = 1;
            this.wrong = 0;
            this.correct = 0;
            this.isFailed = false;
            this.isFinished = false;
            this.isTimerElapsed = false;
            this.secondsElapsed = 0;
            $scope.examCtrl = this;
            this.timeLimitSeconds = settings.examTimeLimitMinutes * 60;
            $scope.$on('$ionicView.afterLeave', function () {
                _this.questions = null;
                $timeout.cancel(_this.timerPromise);
            });
            $scope.$on('$ionicView.beforeEnter', function () {
                $ionicScrollDelegate.scrollTop();
                _this.reset();
            });
        }
        ExamCtrl.prototype.timer = function () {
            var _this = this;
            this.timerPromise = this.$timeout(function () {
                _this.secondsElapsed++;
                if (_this.secondsElapsed <= _this.timeLimitSeconds) {
                    _this.timer();
                }
                else {
                    _this.isFinished = true;
                    _this.isFailed = true;
                    _this.isTimerElapsed = true;
                }
            }, 1000);
        };
        ExamCtrl.prototype.reset = function () {
            this.total = this.settings.examQuestionsNumber;
            this.current = 1;
            this.wrong = 0;
            this.correct = 0;
            this.isFailed = false;
            this.isFinished = false;
            this.isTimerElapsed = false;
            this.secondsElapsed = 0;
            this.questions = this.categories.getRandomQuestions(this.settings.examQuestionsNumber);
            this.currentQuestion = this.questions[this.current - 1];
            this.timer();
        };
        ExamCtrl.prototype.getTimer = function () {
            return new Date((this.timeLimitSeconds - this.secondsElapsed) * 1000);
        };
        ExamCtrl.prototype.complete = function () {
            this.isFinished = true;
            this.$timeout.cancel(this.timerPromise);
        };
        ExamCtrl.prototype.next = function () {
            if (!this.currentQuestion.isCorrect) {
                this.wrong++;
            }
            else {
                this.correct++;
            }
            if (this.wrong > this.settings.examMaxMistakes) {
                this.isFailed = true;
                this.complete();
            }
            else if (this.isLast()) {
                this.complete();
            }
            else {
                this.current++;
                this.currentQuestion = this.questions[this.current - 1];
            }
        };
        ExamCtrl.prototype.finish = function () {
            this.$state.go('app.categories');
        };
        ExamCtrl.prototype.isLast = function () {
            return this.questions.length <= this.current;
        };
        ExamCtrl.$inject = [
            '$scope',
            'categories',
            '$state',
            'settings',
            '$timeout',
            '$ionicScrollDelegate'
        ];
        return ExamCtrl;
    })();
    App.ExamCtrl = ExamCtrl;
})(App || (App = {}));
