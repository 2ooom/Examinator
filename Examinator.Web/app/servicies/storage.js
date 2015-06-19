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
