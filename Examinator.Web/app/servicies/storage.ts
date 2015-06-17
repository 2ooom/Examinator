/// <reference path="../_all.d.ts" />
module App {
    export class Storage {
        public static $inject = [
            '$localStorage',
            'settings'
        ];
        
        constructor(
            private $localStorage: any,
            private settings: any
            ) {
            if (!this.$localStorage.progress) {
                this.$localStorage.progress = {}
            }
            if (!this.$localStorage.answers) {
                this.$localStorage.answers = {}
            }
        }

        public getProgress(categoryId: string):number {
            if (!this.settings.saveProgress) {
                return 0;
            }
            return this.$localStorage.progress[categoryId] || 0;
        }

        public saveProgress(categoryId: string, questionIndex: number) {
            if (!this.settings.saveProgress) {
                this.$localStorage.progress[categoryId] = 0;
                return false;
            }
            this.$localStorage.progress[categoryId] = questionIndex;
            return true;
        }

        public saveAnswers(categoryId: string, answers: number[]) {
            if (!this.settings.saveProgress) {
                this.$localStorage.answers[categoryId] = [];
                return false;
            }
            if (!this.$localStorage.answers[categoryId]) {
                this.$localStorage.answers[categoryId] = [];
            }
            this.$localStorage.answers[categoryId].push(answers);
            return true;
        }

        public getAnswers(categoryId: string) {
            if (!this.settings.saveProgress) {
                return [];
            }
            return this.$localStorage.answers[categoryId] || [];
        }
    }
}