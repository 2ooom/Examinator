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

        public getCategory(categoryId: string): ICategory {
            return this.categories.filter(c => (c.id === categoryId))[0];
        }

        public getQuestion(questionId: string): IQuestion {
            return this.questions.filter((q: any) => (q.id === questionId))[0];
        }

        public getRandomQuestions(num: number): IQuestion[] {
            var indexes = this.utils.getRandomNumbers(num, this.questions.length - 1);
            return indexes.map(i => this.questions[i]);
        }

        public checkAnswers(question: IQuestion): void {
            var correct = true;
            for (var i = 0; i < question.answers.length; i++) {
                correct = correct && !!question.answers[i].selected === !!question.answers[i].isRight;
            }
            question.isCorrect = correct;
            question.isAnswered = true;
        }
        public reset(questionsList: IQuestion[]): void {
            questionsList.forEach(q => {
                q.answers.forEach(a => {
                    delete a.selected;
                });
                delete q.isAnswered;
                delete q.isCorrect;
            });
        }
    }
}