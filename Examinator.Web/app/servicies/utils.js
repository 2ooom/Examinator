/// <reference path="../_all.d.ts" />
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
                throw new Error('Invalid arguments. Couldnt find random sequence');
            }
            return q;
        };
        Utils.maxattempts = 1000;
        return Utils;
    })();
    App.Utils = Utils;
})(App || (App = {}));
//# sourceMappingURL=utils.js.map