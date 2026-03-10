"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateAverageDistance = calculateAverageDistance;
var getDistance_1 = require("./getDistance");
/**
 * Calculate the average distance between all pairs of pointers
 */
function calculateAverageDistance(pointers) {
    if (pointers.length < 2) {
        return 0;
    }
    var totalDistance = 0;
    var pairCount = 0;
    // Calculate distance between each pair of pointers
    for (var i = 0; i < pointers.length; i += 1) {
        for (var j = i + 1; j < pointers.length; j += 1) {
            totalDistance += (0, getDistance_1.getDistance)({ x: pointers[i].clientX, y: pointers[i].clientY }, { x: pointers[j].clientX, y: pointers[j].clientY });
            pairCount += 1;
        }
    }
    // Return average distance
    return pairCount > 0 ? totalDistance / pairCount : 0;
}
