/// <reference path="../_all.d.ts" />

module App {
    export class AppCtrl {
        public $inject = [
            '$scope',
            'confirm',
            'utils',
            'categories',
            '$q'
        ];

        constructor(
            $scope: any,
            confirm: Confirm,
            private utils: Utils,
            private categories : Categories,
            private $q : ng.IQService
            ) {

            this.preloadImages();
        }

        private preloadImages() {
            var urls = this.categories.getImageUrls();
            var promises = [];
            urls.forEach(url => {
                promises.push(this.utils.preload(url));
            });
            this.$q.all(promises).then(() => {
                console.log(`${urls.length} images are pre-loaded`);
            });
        }
        
    }
}