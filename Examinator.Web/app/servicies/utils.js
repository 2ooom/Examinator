var App;
(function (App) {
    var Utils = (function () {
        function Utils() {
        }
        Utils.prototype.getRandomNumbers = function (num, max) {
            var q = [];
            var attempts = 0;
            while (q.length !== num || attempts >= Utils.maxattempts) {
                attempts++;
                var i = Math.round(Math.round(Math.random() * 100) * (max) / 100);
                var existing = q.filter(function (c) { return (c === i); });
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
        };
        Utils.prototype.shuffle = function (array) {
            var currentIndex = array.length, randomIndex;
            var temporaryValue;
            while (0 !== currentIndex) {
                randomIndex = Math.floor(Math.random() * currentIndex);
                currentIndex -= 1;
                temporaryValue = array[currentIndex];
                array[currentIndex] = array[randomIndex];
                array[randomIndex] = temporaryValue;
            }
            return array;
        };
        Utils.maxattempts = 1000;
        return Utils;
    })();
    App.Utils = Utils;
})(App || (App = {}));
