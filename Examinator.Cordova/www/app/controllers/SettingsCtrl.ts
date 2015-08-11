/// <reference path="../_all.d.ts" />

module App {
    export class SettingsCtrl {
        public $inject = [
            '$scope',
            'settings'
        ];

        constructor(
            $scope: any,
            settings: Settings
            ) {
            $scope.settings = settings;
        }
        
    }
}