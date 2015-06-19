/// <reference path="../_all.d.ts" />

module App {
    export class AppCtrl {
        public $inject = [
            '$scope',
            'confirm'
        ];

        constructor(
            $scope: any,
            confirm: Confirm
            ) {
        }
        
    }
}