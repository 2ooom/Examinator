/// <reference path="../_all.d.ts" />

module App {
    export class Directives {
        static Name = 'examinator.directives';

        static init() {
            angular.module(Directives.Name, [])
                .directive(QuestionCtrl.DirectiveName, QuestionCtrl.GetDirective)
                .directive(MistakesCtrl.DirectiveName, MistakesCtrl.GetDirective);

            return Directives.Name;
        }
    }
}