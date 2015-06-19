/// <reference path="../_all.d.ts" />

module App {
    export class Servicies {
        public static Name = 'examinator.servicies';
        
        public static init() {
            angular.module(Servicies.Name, [])
                .service('confirm', Confirm)
                .service('storage', Storage)
                .service('categories', Categories)
                .service('utils', Utils)
                .service('settings', Settings);

            return Servicies.Name;
        }
    }
}