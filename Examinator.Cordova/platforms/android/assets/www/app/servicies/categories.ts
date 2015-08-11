/// <reference path="../_all.d.ts" />

module App {
    export class Categories {
        public static $inject = [
            'utils',
            '$window'
        ];

        public categories: ICategory[];
        private questions: IQuestion[];

        constructor(
            private utils: Utils,
            private $window: any
            ) {

            this.categories = $window.categories;
            this.questions = [];
            this.categories.forEach(c => { this.questions = this.questions.concat(c.questions) });
        }

        getCategory(categoryId: number): ICategory {
            return this.categories.filter(c => (c.id === categoryId))[0];
        }

        getQuestion(questionId: string): IQuestion {
            return this.questions.filter((q: any) => (q.id === questionId))[0];
        }

        getRandomQuestions(num: number): IQuestion[] {
            var indexes = this.utils.getRandomNumbers(num, this.questions.length - 1);
            return indexes.map(i => {
                var q = this.questions[i];
                var qCopy = angular.extend({}, q);
                qCopy.answers = [];
                q.answers.forEach(a => {
                    qCopy.answers.push(angular.extend({}, a));
                });
                this.utils.shuffle(qCopy.answers);
                //console.log(`Shuffled answers for ${q.id} from [${q.answers.map(i => i.id).join(', ') }] to [${qCopy.answers.map(i => i.id).join(', ')}]`);
                return qCopy;
            });
        }

        checkAnswers(question: IQuestion): void {
            var correct = true;
            for (var i = 0; i < question.answers.length; i++) {
                correct = correct && !!question.answers[i].selected === !!question.answers[i].isRight;
            }
            question.isCorrect = correct;
            question.isAnswered = true;
        }

        reset(questionsList: IQuestion[]): void {
            questionsList.forEach(q => {
                q.answers.forEach(a => {
                    delete a.selected;
                });
                delete q.isAnswered;
                delete q.isCorrect;
            });
        }

        getImageUrls(): string[] {
            var imgs: string[] = [];
            this.questions.forEach(q => {
                if (q.imageUrl) {
                    imgs.push(q.imageUrl);
                }
                q.answers.forEach(a => {
                    if (a.imageUrl) {
                        imgs.push(a.imageUrl);
                    }
                });
            });
            return imgs;
        }
    }
}