/// <reference path="../_all.d.ts" />

module App {
    export class CategoryCtrl {
        public static $inject = [
            '$scope',
            '$stateParams',
            'categories',
            '$state',
            'storage',
            '$ionicScrollDelegate',
            'confirm'
        ];

        private category:ICategory;

        public current = 1;
        public currentQuestion: IQuestion;

        public wrong = 0;
        public correct = 0;
        public isFinished = false;

        constructor(
            $scope: any,
            private $stateParams: any,
            private categories: Categories,
            private $state: any,
            private storage: Storage,
            private $ionicScrollDelegate,
            private confirm: Confirm) {

            this.category = this.categories.getCategory($stateParams.categoryId);
            
            $scope.$on('$ionicView.afterLeave',() => {
                this.categories.reset(this.category.questions);
            });

            $scope.$on('$ionicView.beforeEnter',() => {
                $ionicScrollDelegate.scrollTop();
                this.reset();
            });

            $scope.$on('$destroy',() => {
                //this.categories.reset(category.questions);
            });

            $scope.categoryCtrl = this;
        }
        
        private countAnswer(isCorrect: boolean) {
            if (isCorrect) {
                this.correct++;
            } else {
                this.wrong++;
            }
        }

        private setCurrent(index: number) {
            this.current = index;
            this.currentQuestion = this.category.questions[this.current - 1];
        }

        
        private reset() {
            this.setCurrent(1);

            this.wrong = 0;
            this.correct = 0;
            this.isFinished = false;

            var progress = this.storage.getProgress(this.category.id) + 1;

            if (progress > 1) {
                this.confirm.show('Do you want to continue from question #' + progress + '?', 'Continue', 'Restart').then(() => {
                    this.setCurrent(progress);
                    console.log('loading question answers from previous session');
                    var answers = this.storage.getAnswers(this.category.id);
                    for (var i = 0; i < this.current - 1; i++) {
                        var q = this.category.questions[i];
                        var qa = answers[i];
                        for (var j = 0; j < qa.length; j++) {
                            q.answers[qa[j]].selected = true;
                        }
                        this.categories.checkAnswers(q);
                        this.countAnswer(q.isCorrect);
                    }
                }).catch(() => {
                    this.storage.saveProgress(this.category.id, 0);
                });
            }
        }

        public finish() {
            this.$state.go('app.categories');
        }

        public next() {
            var answersIndexes = [];
            this.currentQuestion.answers.forEach((a, i) => {
                if (a.selected) {
                    answersIndexes.push(i);
                }
            });
            this.storage.saveAnswers(this.category.id, answersIndexes);
            this.countAnswer(this.currentQuestion.isCorrect);
            if (this.isLast()) {
                this.storage.saveProgress(this.category.id, 0);
                this.isFinished = true;

            } else {
                this.storage.saveProgress(this.category.id, this.current);
                this.current++;
                this.currentQuestion = this.category.questions[this.current - 1];
            }
        }

        public isLast() {
            return this.category.questions.length <= this.current;
        }
    }
}