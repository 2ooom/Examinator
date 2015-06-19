/// <reference path="../_all.d.ts" />

module App {
    export class Utils {
        private static maxattempts = 1000;

        public getRandomNumbers(num: number, max: number) {
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
                throw new Error('Invalid arguments. Couldnt find random sequence');
            }
            return q;
        }
    }
}