/// <reference path="../_all.d.ts" />
var App;
(function (App) {
    var Utils = (function () {
        function Utils($q) {
            this.$q = $q;
        }
        Utils.prototype.getRandomNumbers = function (num, max) {
            var q = [];
            var attempts = 0;
            while (q.length !== num || attempts >= Utils.maxattempts) {
                attempts++;
                var i = Math.round(Math.round(Math.random() * 100) * (max) / 100);
                var existing = q.filter(function (c) { return (c === i); });
                if (existing.length === 0) {
                    q.push(i);
                    attempts = 0;
                }
            }
            if (attempts >= Utils.maxattempts) {
                console.log('Couldnt find random sequence');
                throw new Error('Invalid arguments. Couldnt find random sequence');
            }
            return q;
        };
        Utils.prototype.shuffle = function (array) {
            var currentIndex = array.length, randomIndex;
            var temporaryValue;
            while (0 !== currentIndex) {
                // Pick a remaining element...
                randomIndex = Math.floor(Math.random() * currentIndex);
                currentIndex -= 1;
                // And swap it with the current element.
                temporaryValue = array[currentIndex];
                array[currentIndex] = array[randomIndex];
                array[randomIndex] = temporaryValue;
            }
            return array;
        };
        Utils.prototype.preload = function (imageUrl) {
            var deffer = this.$q.defer();
            var img = new Image();
            var element = angular.element(img);
            element.bind('load', function () {
                //console.log(`${imageUrl} loaded`);
                deffer.resolve();
            });
            element.bind('error', function () {
                console.log("Error: failed to load " + imageUrl);
                deffer.reject();
            });
            img.src = imageUrl;
            return deffer.promise;
        };
        Utils.maxattempts = 1000;
        Utils.$inject = [
            '$q'
        ];
        return Utils;
    })();
    App.Utils = Utils;
})(App || (App = {}));
/// <reference path="../_all.d.ts" />
var App;
(function (App) {
    var Categories = (function () {
        function Categories(utils, $window) {
            var _this = this;
            this.utils = utils;
            this.$window = $window;
            this.categories = $window.categories;
            this.questions = [];
            this.categories.forEach(function (c) {
                _this.questions = _this.questions.concat(c.questions);
            });
        }
        Categories.prototype.getCategory = function (categoryId) {
            return this.categories.filter(function (c) { return (c.id === categoryId); })[0];
        };
        Categories.prototype.getQuestion = function (questionId) {
            return this.questions.filter(function (q) { return (q.id === questionId); })[0];
        };
        Categories.prototype.getRandomQuestions = function (num) {
            var _this = this;
            var indexes = this.utils.getRandomNumbers(num, this.questions.length - 1);
            return indexes.map(function (i) {
                var q = _this.questions[i];
                var qCopy = angular.extend({}, q);
                qCopy.answers = [];
                q.answers.forEach(function (a) {
                    qCopy.answers.push(angular.extend({}, a));
                });
                _this.utils.shuffle(qCopy.answers);
                //console.log(`Shuffled answers for ${q.id} from [${q.answers.map(i => i.id).join(', ') }] to [${qCopy.answers.map(i => i.id).join(', ')}]`);
                return qCopy;
            });
        };
        Categories.prototype.checkAnswers = function (question) {
            var correct = true;
            for (var i = 0; i < question.answers.length; i++) {
                correct = correct && !!question.answers[i].selected === !!question.answers[i].isRight;
            }
            question.isCorrect = correct;
            question.isAnswered = true;
        };
        Categories.prototype.reset = function (questionsList) {
            questionsList.forEach(function (q) {
                q.answers.forEach(function (a) {
                    delete a.selected;
                });
                delete q.isAnswered;
                delete q.isCorrect;
            });
        };
        Categories.prototype.getImageUrls = function () {
            var imgs = [];
            this.questions.forEach(function (q) {
                if (q.imageUrl) {
                    imgs.push(q.imageUrl);
                }
                q.answers.forEach(function (a) {
                    if (a.imageUrl) {
                        imgs.push(a.imageUrl);
                    }
                });
            });
            return imgs;
        };
        Categories.$inject = [
            'utils',
            '$window'
        ];
        return Categories;
    })();
    App.Categories = Categories;
})(App || (App = {}));
/// <reference path="../_all.d.ts" />
var App;
(function (App) {
    var Confirm = (function () {
        function Confirm($ionicModal, $rootScope, $q) {
            var _this = this;
            this.$ionicModal = $ionicModal;
            this.$rootScope = $rootScope;
            this.$q = $q;
            this.$scope = $rootScope.$new();
            this.modal = null;
            this.loadModal = $ionicModal.fromTemplateUrl('templates/confirm.html', {
                scope: this.$scope,
                backdropClickToClose: false,
                hardwareBackButtonClose: false
            }).then(function (m) {
                _this.modal = m;
            });
            console.log('creating confirm');
        }
        Confirm.prototype.show = function (text, resolveText, rejectText) {
            var _this = this;
            this.$scope.text = text;
            this.$scope.resolveText = resolveText || 'Ok';
            this.$scope.rejectText = rejectText || 'Cancel';
            var deferred = this.$q.defer();
            this.loadModal.then(function () {
                _this.modal.show();
            });
            this.$scope.reject = function () {
                _this.modal.hide();
                deferred.reject();
            };
            ;
            this.$scope.resolve = function () {
                _this.modal.hide();
                deferred.resolve();
            };
            return deferred.promise;
        };
        Confirm.$inject = [
            '$ionicModal',
            '$rootScope',
            '$q'
        ];
        return Confirm;
    })();
    App.Confirm = Confirm;
})(App || (App = {}));
/// <reference path="../_all.d.ts" />
var App;
(function (App) {
    var Servicies = (function () {
        function Servicies() {
        }
        Servicies.init = function () {
            console.log('Init servicies');
            angular.module(Servicies.Name, [
                'ngStorage'
            ]).service('confirm', App.Confirm).service('storage', App.Storage).service('categories', App.Categories).service('utils', App.Utils).service('settings', App.Settings);
            return Servicies.Name;
        };
        Servicies.Name = 'examinator.servicies';
        return Servicies;
    })();
    App.Servicies = Servicies;
})(App || (App = {}));
/// <reference path="../_all.d.ts" />
var App;
(function (App) {
    var Settings = (function () {
        function Settings($localStorage) {
            this.$localStorage = $localStorage;
            // Set default settings
            if (!$localStorage.settings) {
                $localStorage.settings = Settings.defaultSettings;
            }
        }
        Object.defineProperty(Settings.prototype, "saveProgress", {
            get: function () {
                if (this.$localStorage.settings.saveProgress === undefined) {
                    return Settings.defaultSettings.saveProgress;
                }
                return this.$localStorage.settings.saveProgress;
            },
            set: function (val) {
                this.$localStorage.settings.saveProgress = val;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Settings.prototype, "examQuestionsNumber", {
            get: function () {
                if (this.$localStorage.settings.examQuestionsNumber === undefined) {
                    return Settings.defaultSettings.examQuestionsNumber;
                }
                return this.$localStorage.settings.examQuestionsNumber;
            },
            set: function (val) {
                this.$localStorage.settings.examQuestionsNumber = val;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Settings.prototype, "examTimeLimitMinutes", {
            get: function () {
                if (this.$localStorage.settings.examTimeLimitMinutes === undefined) {
                    return Settings.defaultSettings.examTimeLimitMinutes;
                }
                return this.$localStorage.settings.examTimeLimitMinutes;
            },
            set: function (val) {
                this.$localStorage.settings.examTimeLimitMinutes = val;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Settings.prototype, "examMaxMistakes", {
            get: function () {
                if (this.$localStorage.settings.examMaxMistakes === undefined) {
                    return Settings.defaultSettings.examMaxMistakes;
                }
                return this.$localStorage.settings.examMaxMistakes;
            },
            set: function (val) {
                this.$localStorage.settings.examMaxMistakes = val;
            },
            enumerable: true,
            configurable: true
        });
        Settings.$inject = [
            '$localStorage'
        ];
        Settings.defaultSettings = {
            saveProgress: true,
            examQuestionsNumber: 35,
            examTimeLimitMinutes: 30,
            examMaxMistakes: 5
        };
        return Settings;
    })();
    App.Settings = Settings;
})(App || (App = {}));
/// <reference path="../_all.d.ts" />
var App;
(function (App) {
    var Storage = (function () {
        function Storage($localStorage, settings) {
            this.$localStorage = $localStorage;
            this.settings = settings;
            if (!this.$localStorage.progress) {
                this.$localStorage.progress = {};
            }
            if (!this.$localStorage.answers) {
                this.$localStorage.answers = {};
            }
        }
        Storage.prototype.getProgress = function (categoryId) {
            if (!this.settings.saveProgress) {
                return 0;
            }
            return this.$localStorage.progress[categoryId] || 0;
        };
        Storage.prototype.saveProgress = function (categoryId, questionIndex) {
            if (!this.settings.saveProgress) {
                this.$localStorage.progress[categoryId] = 0;
                return false;
            }
            this.$localStorage.progress[categoryId] = questionIndex;
            return true;
        };
        Storage.prototype.saveAnswers = function (categoryId, answers) {
            if (!this.settings.saveProgress) {
                this.$localStorage.answers[categoryId] = [];
                return false;
            }
            if (!this.$localStorage.answers[categoryId]) {
                this.$localStorage.answers[categoryId] = [];
            }
            this.$localStorage.answers[categoryId].push(answers);
            return true;
        };
        Storage.prototype.getAnswers = function (categoryId) {
            if (!this.settings.saveProgress) {
                return [];
            }
            return this.$localStorage.answers[categoryId] || [];
        };
        Storage.$inject = [
            '$localStorage',
            'settings'
        ];
        return Storage;
    })();
    App.Storage = Storage;
})(App || (App = {}));
/// <reference path="../_all.d.ts" />
var App;
(function (App) {
    var AppCtrl = (function () {
        function AppCtrl($scope, confirm, utils, categories, $q) {
            this.utils = utils;
            this.categories = categories;
            this.$q = $q;
            this.$inject = [
                '$scope',
                'confirm',
                'utils',
                'categories',
                '$q'
            ];
            this.preloadImages();
        }
        AppCtrl.prototype.preloadImages = function () {
            var _this = this;
            var urls = this.categories.getImageUrls();
            var promises = [];
            urls.forEach(function (url) {
                promises.push(_this.utils.preload(url));
            });
            this.$q.all(promises).then(function () {
                console.log("" + urls.length + " images are pre-loaded");
            });
        };
        return AppCtrl;
    })();
    App.AppCtrl = AppCtrl;
})(App || (App = {}));
/// <reference path="../_all.d.ts" />
var App;
(function (App) {
    var SettingsCtrl = (function () {
        function SettingsCtrl($scope, settings) {
            this.$inject = [
                '$scope',
                'settings'
            ];
            $scope.settings = settings;
        }
        return SettingsCtrl;
    })();
    App.SettingsCtrl = SettingsCtrl;
})(App || (App = {}));
/// <reference path="../_all.d.ts" />
var App;
(function (App) {
    var CategoriesCtrl = (function () {
        function CategoriesCtrl($scope, categories) {
            this.$inject = [
                '$scope',
                'categories'
            ];
            $scope.categories = categories.categories;
        }
        return CategoriesCtrl;
    })();
    App.CategoriesCtrl = CategoriesCtrl;
})(App || (App = {}));
/// <reference path="../_all.d.ts" />
var App;
(function (App) {
    var CategoryCtrl = (function () {
        function CategoryCtrl($scope, $stateParams, categories, $state, storage, $ionicScrollDelegate, confirm) {
            var _this = this;
            this.$stateParams = $stateParams;
            this.categories = categories;
            this.$state = $state;
            this.storage = storage;
            this.$ionicScrollDelegate = $ionicScrollDelegate;
            this.confirm = confirm;
            this.current = 1;
            this.wrong = 0;
            this.correct = 0;
            this.isFinished = false;
            this.category = this.categories.getCategory(parseInt($stateParams.categoryId));
            $scope.$on('$ionicView.afterLeave', function () {
                _this.categories.reset(_this.category.questions);
            });
            $scope.$on('$ionicView.beforeEnter', function () {
                $ionicScrollDelegate.scrollTop();
                _this.reset();
            });
            $scope.$on('$destroy', function () {
                //this.categories.reset(category.questions);
            });
            $scope.categoryCtrl = this;
        }
        CategoryCtrl.prototype.countAnswer = function (isCorrect) {
            if (isCorrect) {
                this.correct++;
            }
            else {
                this.wrong++;
            }
        };
        CategoryCtrl.prototype.setCurrent = function (index) {
            this.current = index;
            this.currentQuestion = this.category.questions[this.current - 1];
        };
        CategoryCtrl.prototype.reset = function () {
            var _this = this;
            this.setCurrent(1);
            this.wrong = 0;
            this.correct = 0;
            this.isFinished = false;
            var progress = this.storage.getProgress(this.category.id) + 1;
            if (progress > 1) {
                this.confirm.show('Do you want to continue from question #' + progress + '?', 'Continue', 'Restart').then(function () {
                    _this.setCurrent(progress);
                    console.log('loading question answers from previous session');
                    var answers = _this.storage.getAnswers(_this.category.id);
                    for (var i = 0; i < _this.current - 1; i++) {
                        var q = _this.category.questions[i];
                        var qa = answers[i];
                        for (var j = 0; j < qa.length; j++) {
                            q.answers[qa[j]].selected = true;
                        }
                        _this.categories.checkAnswers(q);
                        _this.countAnswer(q.isCorrect);
                    }
                }).catch(function () {
                    _this.storage.saveProgress(_this.category.id, 0);
                });
            }
        };
        CategoryCtrl.prototype.finish = function () {
            this.$state.go('app.categories');
        };
        CategoryCtrl.prototype.next = function () {
            var answersIndexes = [];
            this.currentQuestion.answers.forEach(function (a, i) {
                if (a.selected) {
                    answersIndexes.push(i);
                }
            });
            this.storage.saveAnswers(this.category.id, answersIndexes);
            this.countAnswer(this.currentQuestion.isCorrect);
            if (this.isLast()) {
                this.storage.saveProgress(this.category.id, 0);
                this.isFinished = true;
            }
            else {
                this.storage.saveProgress(this.category.id, this.current);
                this.current++;
                this.currentQuestion = this.category.questions[this.current - 1];
            }
        };
        CategoryCtrl.prototype.isLast = function () {
            return this.category.questions.length <= this.current;
        };
        CategoryCtrl.$inject = [
            '$scope',
            '$stateParams',
            'categories',
            '$state',
            'storage',
            '$ionicScrollDelegate',
            'confirm'
        ];
        return CategoryCtrl;
    })();
    App.CategoryCtrl = CategoryCtrl;
})(App || (App = {}));
/// <reference path="../_all.d.ts" />
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
/// <reference path="../_all.d.ts" />
var App;
(function (App) {
    var MistakesCtrl = (function () {
        function MistakesCtrl() {
        }
        MistakesCtrl.GetDirective = function () {
            return {
                scope: {
                    questions: '='
                },
                restrict: 'E',
                templateUrl: 'templates/mistakes.html'
            };
        };
        MistakesCtrl.DirectiveName = 'mistakes';
        return MistakesCtrl;
    })();
    App.MistakesCtrl = MistakesCtrl;
})(App || (App = {}));
/// <reference path="../_all.d.ts" />
var App;
(function (App) {
    var QuestionCtrl = (function () {
        function QuestionCtrl($scope, $element, $ionicScrollDelegate, categories) {
            this.$scope = $scope;
            this.$element = $element;
            this.$ionicScrollDelegate = $ionicScrollDelegate;
            this.categories = categories;
            $scope.questionCtrl = this;
            $scope.question.isCorrect = false;
        }
        QuestionCtrl.GetDirective = function () {
            return {
                scope: {
                    question: '=',
                    isLast: '=',
                    next: '&',
                    finish: '&'
                },
                restrict: 'AE',
                templateUrl: 'templates/question.html',
                controller: QuestionCtrl
            };
        };
        QuestionCtrl.prototype.answerHandle = function () {
            if (!this.$scope.question.isAnswered) {
                this.categories.checkAnswers(this.$scope.question);
            }
            else {
                this.$ionicScrollDelegate.scrollTop();
                if (this.$scope.next) {
                    this.$scope.next();
                }
            }
        };
        QuestionCtrl.prototype.getAnswerButtonText = function () {
            if (!this.$scope.question.isAnswered) {
                return 'Answer';
            }
            else if (this.$scope.question.isCorrect) {
                return 'Correct';
            }
            else {
                return 'Wrong';
            }
        };
        QuestionCtrl.prototype.getCorrectLabel = function () {
            if (this.$scope.question.correct !== 11 && this.$scope.question.correct % 10 === 1) {
                return 'Answer';
            }
            return 'Answers';
        };
        QuestionCtrl.prototype.getAnswerClass = function (answer) {
            if (this.$scope.question.isAnswered && ((answer.selected && answer.isRight) || (answer.isRight && !answer.selected))) {
                return 'checkbox-balanced';
            }
            else if (this.$scope.question.isAnswered && answer.selected && !answer.isRight) {
                return 'checkbox-assertive';
            }
            else {
                return 'checkbox-positive';
            }
        };
        QuestionCtrl.prototype.getAnswerButtonClass = function () {
            if (!this.$scope.question.isAnswered) {
                return 'button-positive';
            }
            var correctClass = this.$scope.question.isCorrect ? 'button-balanced icon-right' : 'button-assertive icon-right';
            if (!this.$scope.isLast) {
                return correctClass + ' ion-chevron-right';
            }
            else {
                return correctClass + ' ion-navicon';
            }
        };
        QuestionCtrl.$inject = [
            '$scope',
            '$element',
            '$ionicScrollDelegate',
            'categories'
        ];
        QuestionCtrl.DirectiveName = 'question';
        return QuestionCtrl;
    })();
    App.QuestionCtrl = QuestionCtrl;
})(App || (App = {}));
/// <reference path="../_all.d.ts" />
var App;
(function (App) {
    var Directives = (function () {
        function Directives() {
        }
        Directives.init = function () {
            angular.module(Directives.Name, []).directive(App.QuestionCtrl.DirectiveName, App.QuestionCtrl.GetDirective).directive(App.MistakesCtrl.DirectiveName, App.MistakesCtrl.GetDirective);
            return Directives.Name;
        };
        Directives.Name = 'examinator.directives';
        return Directives;
    })();
    App.Directives = Directives;
})(App || (App = {}));
/// <reference path="_all.d.ts" />
var App;
(function (App) {
    angular.module('examinator', [
        'ionic',
        App.Servicies.init(),
        App.Directives.init()
    ]).run(function ($ionicPlatform) {
        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }
        });
    }).config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider.state('app', {
            url: "/app",
            abstract: true,
            templateUrl: "templates/menu.html",
            controller: App.AppCtrl
        }).state('app.settings', {
            url: "/settings",
            views: {
                'main': {
                    templateUrl: "templates/settings.html",
                    controller: App.SettingsCtrl
                }
            }
        }).state('app.exam', {
            url: "/exam",
            views: {
                'main': {
                    templateUrl: "templates/exam.html",
                    controller: App.ExamCtrl
                }
            }
        }).state('app.categories', {
            url: "/categories",
            views: {
                'main': {
                    templateUrl: "templates/categories.html",
                    controller: App.CategoriesCtrl
                }
            }
        }).state('app.category', {
            url: "/category/:categoryId",
            views: {
                'main': {
                    templateUrl: "templates/category.html",
                    controller: App.CategoryCtrl
                }
            }
        });
        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/app/categories');
    });
})(App || (App = {}));
//# sourceMappingURL=appBundle.js.map