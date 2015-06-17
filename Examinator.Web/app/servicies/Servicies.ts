/// <reference path="../_all.d.ts" />
module App {
    export class Servicies {
        public static Name: string = 'examinator.servicies';
        
        public static init() {
            angular.module(Servicies.Name, [])
                .service('confirm', Confirm)
                .service('storage', Storage)
                .service('categories', Categories)
                .service('utils', Utils)
                .factory('settings', [
                    '$localStorage', ($localStorage) => {
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
                ]);

            return Servicies.Name;
        }
    }
}