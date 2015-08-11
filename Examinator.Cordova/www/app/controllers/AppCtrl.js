var App;
(function (App) {
    var AppCtrl = (function () {
        function AppCtrl($scope, confirm, utils, categories, $q) {
            this.utils = utils;
            this.categories = categories;
            this.$q = $q;
            this.$inject = [
                '$scope',
                'confirm',
                'utils',
                'categories',
                '$q'
            ];
            this.preloadImages();
        }
        AppCtrl.prototype.preloadImages = function () {
            var _this = this;
            var urls = this.categories.getImageUrls();
            var promises = [];
            urls.forEach(function (url) {
                promises.push(_this.utils.preload(url));
            });
            this.$q.all(promises).then(function () {
                console.log("" + urls.length + " images are pre-loaded");
            });
        };
        return AppCtrl;
    })();
    App.AppCtrl = AppCtrl;
})(App || (App = {}));
