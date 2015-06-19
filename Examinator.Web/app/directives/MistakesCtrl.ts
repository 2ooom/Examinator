/// <reference path="../_all.d.ts" />

module App {
    export interface IMistakesCtrlScope {
        questions:IQuestion[];
    }
    export class MistakesCtrl {
        
        static DirectiveName = 'mistakes';

        static GetDirective() {
            return {
                scope: {
                    questions: '='
                },
                restrict: 'E',
                templateUrl: 'templates/mistakes.html'
            }
        }
    }
}