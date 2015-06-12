/// <reference path="_all.d.ts" />
module App {
    angular.module('examinator.servicies', [])
        .factory('settings', ['$localStorage',
            ($localStorage) => {
                if (!$localStorage.settings) {
                    // Set default settings
                    $localStorage.settings = {
                        saveProgress: true,
                        examQuestionsNumber: 35,
                        examTimeLimitMinutes: 60
                    }
                }
                return $localStorage.settings;
            }
        ])
        .factory('storage', ['$localStorage', 'settings',
            ($localStorage, settings) => {
                if (!$localStorage.progress) {
                    $localStorage.progress = {}
                }
                if (!$localStorage.answers) {
                    $localStorage.answers = {}
                }
                return {
                    getProgress: (categoryId: string) => {
                        if (!settings.saveProgress) {
                            return 0;
                        }
                        return $localStorage.progress[categoryId] || 0;
                    },
                    saveProgress: (categoryId: string, questionIndex: number) => {
                        if (!settings.saveProgress) {
                            $localStorage.progress[categoryId] = 0;
                            return false;
                        }
                        $localStorage.progress[categoryId] = questionIndex;
                        return true;
                    },
                    saveAnswers: (categoryId: string, answers: number[]) => {
                        if (!settings.saveProgress) {
                            $localStorage.answers[categoryId] = [];
                            return false;
                        }
                        if (!$localStorage.answers[categoryId]) {
                            $localStorage.answers[categoryId] = [];
                        }
                        $localStorage.answers[categoryId].push(answers);
                        return true;
                    },
                    getAnswers: (categoryId: string) => {
                        if (!settings.saveProgress) {
                            return [];
                        }
                        return $localStorage.answers[categoryId] || [];
                    }
                };
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
                    getCategory(categoryId:string) {
                        return categories.filter(c => (c.Id === categoryId))[0];
                    },
                    getQuestion(questionId:string) {
                        return questions.filter((q: any) => (q.Id === questionId))[0];
                    },
                    getRandomQuestions(num:number) {
                        var indexes = utils.getRandomNumbers(num, questions.length - 1);
                        return indexes.map(i => questions[i]);
                    },
                    reset(questions: any[]) {
                        questions.forEach(q => {
                            q.Answers.forEach(a => {
                                delete a.selected;
                            });
                            delete q.isAnswered;
                        });
                    }
                }
            }
        ]);
}