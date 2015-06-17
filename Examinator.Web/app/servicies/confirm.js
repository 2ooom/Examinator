/// <reference path="../_all.d.ts" />
var App;
(function (App) {
    var Confirm = (function () {
        function Confirm($ionicModal, $rootScope, $q) {
            var _this = this;
            this.$ionicModal = $ionicModal;
            this.$rootScope = $rootScope;
            this.$q = $q;
            this.$scope = $rootScope.$new();
            this.modal = null;
            this.loadModal = $ionicModal.fromTemplateUrl('templates/confirm.html', {
                scope: this.$scope,
                backdropClickToClose: false,
                hardwareBackButtonClose: false
            }).then(function (m) {
                _this.modal = m;
            });
        }
        Confirm.prototype.show = function (text, resolveText, rejectText) {
            var _this = this;
            this.$scope.text = text;
            this.$scope.resolveText = resolveText || 'Ok';
            this.$scope.rejectText = rejectText || 'Cancel';
            var deferred = this.$q.defer();
            this.loadModal.then(function () {
                _this.modal.show();
            });
            this.$scope.reject = function () {
                _this.modal.hide();
                deferred.reject();
            };
            ;
            this.$scope.resolve = function () {
                _this.modal.hide();
                deferred.resolve();
            };
            return deferred.promise;
        };
        Confirm.$inject = [
            '$ionicModal',
            '$rootScope',
            '$q'
        ];
        return Confirm;
    })();
    App.Confirm = Confirm;
})(App || (App = {}));
//# sourceMappingURL=confirm.js.map