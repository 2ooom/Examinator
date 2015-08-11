var App;
(function (App) {
    var Settings = (function () {
        function Settings($localStorage) {
            this.$localStorage = $localStorage;
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
