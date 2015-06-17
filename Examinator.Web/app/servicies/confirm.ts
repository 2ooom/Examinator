/// <reference path="../_all.d.ts" />
module App {
    export class Confirm {
        public static $inject = [
            '$ionicModal',
            '$rootScope',
            '$q'
        ];
        
        private deferred: ng.IDeferred<any>;
        private loadModal: any;
        private $scope: ng.IScope;
        private modal: any;

        constructor(
            private $ionicModal: any,
            private $rootScope: ng.IRootScopeService,
            private $q: ng.IQService
            ) {
            this.$scope = $rootScope.$new();
            this.modal = null;

            this.loadModal = $ionicModal.fromTemplateUrl('templates/confirm.html', {
                scope: this.$scope,
                backdropClickToClose: false,
                hardwareBackButtonClose: false
            }).then(m => {
                this.modal = m;
            });
        }

        public show(text: string, resolveText: string, rejectText: string) {
            (<any>this.$scope).text = text;
            (<any>this.$scope).resolveText = resolveText || 'Ok';
            (<any>this.$scope).rejectText = rejectText || 'Cancel';
            var deferred = this.$q.defer();
            this.loadModal.then(() => {
                this.modal.show();
            });

            (<any>this.$scope).reject = () => {
                this.modal.hide();
                deferred.reject();
            };;

            (<any>this.$scope).resolve = () => {
                this.modal.hide();
                deferred.resolve();
            };

            return deferred.promise;
        }
    }
}