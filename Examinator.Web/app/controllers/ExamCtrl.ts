/// <reference path="../_all.d.ts" />

module App {
    export class ExamCtrl {

        public static $inject = [
            '$scope',
            'categories',
            '$state',
            'settings',
            '$timeout',
            '$ionicScrollDelegate'
        ];

        public total:number;
        public current = 1;
        public wrong = 0;
        public correct = 0;
        public isFailed = false;
        public isFinished = false;
        public isTimerElapsed = false;
        public secondsElapsed = 0;
        public currentQuestion: IQuestion;

        private timerPromise: ng.IPromise<any>;
        private timeLimitSeconds:number;
        private questions: IQuestion[];

        constructor(
            $scope: any,
            private categories: Categories,
            private $state: any,
            private settings: Settings,
            private $timeout: ng.ITimeoutService,
            private $ionicScrollDelegate: any) {
            $scope.examCtrl = this;
            this.timeLimitSeconds = settings.examTimeLimitMinutes * 60;
            
            $scope.$on('$ionicView.afterLeave',() => {
                categories.reset(this.questions);
                $timeout.cancel(this.timerPromise);
            });

            $scope.$on('$ionicView.beforeEnter',(a, b, c) => {
                $ionicScrollDelegate.scrollTop();
                this.reset();
            });
        }

        private timer() {
            this.timerPromise = this.$timeout(() => {
                this.secondsElapsed++;
                if (this.secondsElapsed <= this.timeLimitSeconds) {
                    this.timer();
                } else {
                    this.isFinished = true;
                    this.isFailed = true;
                    this.isTimerElapsed = true;
                }
            }, 1000);
        }
        
        private reset() {
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
        }

        public getTimer() {
            return new Date((this.timeLimitSeconds - this.secondsElapsed) * 1000);
        }

        public complete() {
            this.isFinished = true;
            this.$timeout.cancel(this.timerPromise);
        }
        public next() {
            if (!this.currentQuestion.isCorrect) {
                this.wrong++;
            } else {
                this.correct++;
            }
            if (this.wrong > this.settings.examMaxMistakes) {
                this.isFailed = true;
                this.complete();
            }
            else if (this.isLast()) {
                this.complete();
            } else {
                this.current++;
                this.currentQuestion = this.questions[this.current - 1];
            }
        }

        public finish() {
            this.categories.reset(this.questions);
            this.$state.go('app.categories');
        }

        public isLast() {
            return this.questions.length <= this.current;
        }
    }
}