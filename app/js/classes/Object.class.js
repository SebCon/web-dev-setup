"use strict";
exports.__esModule = true;
var Object = /** @class */ (function () {
    function Object() {
    }
    Object.prototype.getPosition = function () {
        return this.pos;
    };
    Object.prototype.setPosition = function (pos) {
        this.pos = pos;
    };
    Object.prototype.modifyState = function (damage) {
        this.state = this.state - damage;
        if (this.state <= 0) {
            // destroy Object
        }
    };
    return Object;
}());
exports.Object = Object;
