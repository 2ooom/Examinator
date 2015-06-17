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
                        examTimeLimitMinutes: 45,
                        examMaxMistakes: 5
                    }
                } else {
                    if ($localStorage.settings.saveProgress === undefined) {
                        $localStorage.settings.saveProgress = true;
                    }
                    if ($localStorage.settings.examQuestionsNumber === undefined) {
                        $localStorage.settings.examQuestionsNumber = 35;
                    }
                    if ($localStorage.settings.examTimeLimitMinutes === undefined) {
                        $localStorage.settings.examTimeLimitMinutes = 45;
                    }
                    if ($localStorage.settings.examMaxMistakes === undefined) {
                        $localStorage.settings.examMaxMistakes = 5;
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
                    getRandomNumbers(num:number, max:number) {
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
        .factory('confirm', ['$ionicModal', '$rootScope', '$q',
        ($ionicModal, $rootScope :ng.IRootScopeService, $q:ng.IQService) => {
                var $scope = $rootScope.$new();
                var deferred = $q.defer();
                var modal = null;

                var loadModal = $ionicModal.fromTemplateUrl('templates/confirm.html', {
                    scope: $scope,
                    backdropClickToClose: false,
                    hardwareBackButtonClose: false
                }).then(m => {
                    modal = m;
                });

                (<any>$scope).reject = () => {
                    modal.hide();
                    deferred.reject();
                };;
            
                (<any>$scope).resolve = () => {
                    modal.hide();
                    deferred.resolve();
                };

                return {
                    show: (text: string, resolveText: string, rejectText:string) => {
                        (<any>$scope).text = text;
                        (<any>$scope).resolveText = resolveText || 'Ok';
                        (<any>$scope).rejectText = rejectText || 'Cancel';
                        deferred = $q.defer();
                        loadModal.then(() => {
                            modal.show();
                        });

                        return deferred.promise;
                    }
                }
            }
        ])
        .factory('categories', ['utils',
            utils => {
                var categories:ICategory[] = (<any>window).categories;
                var questions:IQuestion[] = [];
                categories.forEach(c => { questions = questions.concat(c.questions) });
                return {
                    categories: categories,
                    getCategory(categoryId:string):ICategory {
                        return categories.filter(c => (c.id === categoryId))[0];
                    },
                    getQuestion(questionId:string):IQuestion {
                        return questions.filter((q: any) => (q.id === questionId))[0];
                    },
                    getRandomQuestions(num:number):IQuestion[] {
                        var indexes = utils.getRandomNumbers(num, questions.length - 1);
                        return indexes.map(i => questions[i]);
                    },
                    checkAnswers(question: IQuestion):void {
                        var correct = true;
                        for (var i = 0; i < question.answers.length; i++) {
                            correct = correct && question.answers[i].selected === question.answers[i].isRight;
                        }
                        question.isCorrect = correct;
                        question.isAnswered = true;
                    },
                    reset(questionsList: IQuestion[]):void {
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
        ]);
}