/// <reference path="_all.d.ts" />
module App {
    angular.module('examinator.servicies', [])
        .factory('settings', ['$localStorage',
            ($localStorage) => {
                if (!$localStorage.settings) {
                    // Set default settings
                    $localStorage.settings = {
                        saveProgress: true
                    }
                }
                return $localStorage.settings;
            }
        ])
        .factory('utils', [
            () => {
                var maxattempts = 1000;
                return {
                    getRandomNumbers(num, max) {
                        var q = [];
                        var attempts = 0;
                        while (q.length !== num || attempts >= maxattempts) {
                            attempts++;
                            var i = Math.round(Math.round(Math.random() * 100) * (max) / 100);
                            var existing = q.filter(c => (c === i));
                            if (existing.length === 0) {
                                q.push(i);
                                attempts = 0;
                            }
                        }
                        if (attempts >= maxattempts) {
                            throw new Error('Invalid arguments. Couldnt find random sequence');
                        }
                        return q;
                    }
                }
            }
        ])
        .factory('categories', [
            'utils',
            utils => {
                var categories = (<any>window).categories;
                var questions = [];
                categories.forEach(c => { questions = questions.concat(c.Questions) });
                return {
                    categories: categories,
                    getCategory(categoryId) {
                        return categories.filter(c => (c.Id === categoryId))[0];
                    },
                    getQuestion(questionId) {
                        return questions.filter((q: any) => (q.Id === questionId))[0];
                    },
                    getRandomQuestions(num) {
                        var indexes = utils.getRandomNumbers(num, questions.length - 1);
                        return indexes.map(i => questions[i]);
                    }
                }
            }
        ]);
}