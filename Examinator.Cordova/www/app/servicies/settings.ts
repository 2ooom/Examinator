/// <reference path="../_all.d.ts" />

module App {
    export class Settings {
        public static $inject = [
            '$localStorage'
        ];

        private static defaultSettings = {
            saveProgress: true,
            examQuestionsNumber: 35,
            examTimeLimitMinutes: 30,
            examMaxMistakes: 5
        }

        constructor(
            private $localStorage: any
            ) {
            
            // Set default settings
            if (!$localStorage.settings) {
                $localStorage.settings = Settings.defaultSettings;
            }
        }

        public get saveProgress(): boolean {
            if (this.$localStorage.settings.saveProgress === undefined) {
                return Settings.defaultSettings.saveProgress;
            }
            return this.$localStorage.settings.saveProgress;
        }

        public set saveProgress(val:boolean) {
            this.$localStorage.settings.saveProgress = val;
        }

        public get examQuestionsNumber(): number {
            if (this.$localStorage.settings.examQuestionsNumber === undefined) {
                return Settings.defaultSettings.examQuestionsNumber;
            }
            return this.$localStorage.settings.examQuestionsNumber;
        }

        public set examQuestionsNumber(val:number) {
            this.$localStorage.settings.examQuestionsNumber = val;
        }

        public get examTimeLimitMinutes(): number {
            if (this.$localStorage.settings.examTimeLimitMinutes === undefined) {
                return Settings.defaultSettings.examTimeLimitMinutes;
            }
            return this.$localStorage.settings.examTimeLimitMinutes;
        }

        public set examTimeLimitMinutes(val:number) {
            this.$localStorage.settings.examTimeLimitMinutes = val;
        }

        public get examMaxMistakes(): number {
            if (this.$localStorage.settings.examMaxMistakes === undefined) {
                return Settings.defaultSettings.examMaxMistakes;
            }
            return this.$localStorage.settings.examMaxMistakes;
        }

        public set examMaxMistakes(val:number) {
            this.$localStorage.settings.examMaxMistakes = val;
        }
    }
}