/// <reference path="../_all.d.ts" />

module App {
    export class Utils {
        private static maxattempts = 1000;
        private static $inject = [
            '$q'
        ];

        constructor(private $q:ng.IQService) {
            
        }

        getRandomNumbers(num: number, max: number) {
            var q = [];
            var attempts = 0;
            while (q.length !== num || attempts >= Utils.maxattempts) {
                attempts++;
                var i = Math.round(Math.round(Math.random() * 100) * (max) / 100);
                var existing = q.filter(c => (c === i));
                if (existing.length === 0) {
                    q.push(i);
                    attempts = 0;
                }
            }
            if (attempts >= Utils.maxattempts) {
                console.log('Couldnt find random sequence');
                throw new Error('Invalid arguments. Couldnt find random sequence');
            }
            return q;
        }

        shuffle<T>(array: T[]): T[] {
            var currentIndex = array.length, randomIndex;
            var temporaryValue: T;

            // While there remain elements to shuffle...
            while (0 !== currentIndex) {

                // Pick a remaining element...
                randomIndex = Math.floor(Math.random() * currentIndex);
                currentIndex -= 1;

                // And swap it with the current element.
                temporaryValue = array[currentIndex];
                array[currentIndex] = array[randomIndex];
                array[randomIndex] = temporaryValue;
            }

            return array;
        }

        preload(imageUrl: string):ng.IPromise<any> {
            var deffer = this.$q.defer();
            var img = new Image();
            var element = angular.element(img);
            element.bind('load', () => {
                //console.log(`${imageUrl} loaded`);
                deffer.resolve();
            });
            element.bind('error', () => {
                console.log(`Error: failed to load ${imageUrl}`);
                deffer.reject();
            });
            img.src = imageUrl;
            return deffer.promise;
        }
    }
}