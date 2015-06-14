/// <reference path="_all.d.ts" />
var App;
(function (App) {
    angular.module('examinator.servicies', []).factory('settings', ['$localStorage', function ($localStorage) {
        if (!$localStorage.settings) {
            // Set default settings
            $localStorage.settings = {
                saveProgress: true,
                examQuestionsNumber: 35,
                examTimeLimitMinutes: 45,
                examMaxMistakes: 5
            };
        }
        else {
            if ($localStorage.settings.saveProgress === undefined) {
                $localStorage.settings.saveProgress = true;
            }
            if ($localStorage.settings.examQuestionsNumber === undefined) {
                $localStorage.settings.examQuestionsNumber = 35;
            }
            if ($localStorage.settings.examTimeLimitMinutes === undefined || $localStorage.settings.examTimeLimitMinutes === 60) {
                $localStorage.settings.examTimeLimitMinutes = 45;
            }
            if ($localStorage.settings.examMaxMistakes === undefined) {
                $localStorage.settings.examMaxMistakes = 5;
            }
        }
        return $localStorage.settings;
    }]).factory('storage', ['$localStorage', 'settings', function ($localStorage, settings) {
        if (!$localStorage.progress) {
            $localStorage.progress = {};
        }
        if (!$localStorage.answers) {
            $localStorage.answers = {};
        }
        return {
            getProgress: function (categoryId) {
                if (!settings.saveProgress) {
                    return 0;
                }
                return $localStorage.progress[categoryId] || 0;
            },
            saveProgress: function (categoryId, questionIndex) {
                if (!settings.saveProgress) {
                    $localStorage.progress[categoryId] = 0;
                    return false;
                }
                $localStorage.progress[categoryId] = questionIndex;
                return true;
            },
            saveAnswers: function (categoryId, answers) {
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
            getAnswers: function (categoryId) {
                if (!settings.saveProgress) {
                    return [];
                }
                return $localStorage.answers[categoryId] || [];
            }
        };
    }]).factory('utils', [
        function () {
            var maxattempts = 1000;
            return {
                getRandomNumbers: function (num, max) {
                    var q = [];
                    var attempts = 0;
                    while (q.length !== num || attempts >= maxattempts) {
                        attempts++;
                        var i = Math.round(Math.round(Math.random() * 100) * (max) / 100);
                        var existing = q.filter(function (c) { return (c === i); });
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
            };
        }
    ]).factory('categories', [
        'utils',
        function (utils) {
            var categories = window.categories;
            var questions = [];
            categories.forEach(function (c) {
                questions = questions.concat(c.Questions);
            });
            return {
                categories: categories,
                getCategory: function (categoryId) {
                    return categories.filter(function (c) { return (c.Id === categoryId); })[0];
                },
                getQuestion: function (questionId) {
                    return questions.filter(function (q) { return (q.Id === questionId); })[0];
                },
                getRandomQuestions: function (num) {
                    var indexes = utils.getRandomNumbers(num, questions.length - 1);
                    return indexes.map(function (i) { return questions[i]; });
                },
                reset: function (questions) {
                    questions.forEach(function (q) {
                        q.Answers.forEach(function (a) {
                            delete a.selected;
                        });
                        delete q.isAnswered;
                        delete q.isCorrect;
                    });
                }
            };
        }
    ]);
})(App || (App = {}));
//# sourceMappingURL=servicies.js.map