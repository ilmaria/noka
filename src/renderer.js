/**
 * @typedef Element
 * @type {object}
 * @property {Id} id
 * @property {Id} [parent]
 * @property {number} [index]
 * @property {Layout} [layout]
 * @property {Flags} [flags]
 * @property {number} [corner_radius]
 * @property {Color} [color]
 * @property {void} [enabled_if]
 * @property {number} [triangle_strip]
 * @property {Rectangle} [rectangle]
 */

/**
 * @typedef Layout
 * @type {LAYOUT_VERTICAL_STACK|LAYOUT_HORIZONTAL_STACK|LAYOUT_GRID}
 */

const LAYOUT_VERTICAL_STACK = 4;
const LAYOUT_HORIZONTAL_STACK = 5;
const LAYOUT_GRID = 6;

/**
 * @typedef Flags
 * @type {object}
 * @property {boolean} [use_rtl]
 * @property {boolean} [remove_previous_children]
 */

/**
 * @typedef Color
 * @type {object}
 * @property {number} [r]
 * @property {number} [g]
 * @property {number} [b]
 * @property {number} [a]
 */

/**
 * @typedef Rectangle
 * @type {object}
 * @property {Point} min
 * @property {Point} max
 */

/**
 * @typedef Point
 * @type {object}
 * @property {ANCHOR_TOP_LEFT|ANCHOR_TOP_RIGHT|ANCHOR_BOTTOM_LEFT|ANCHOR_BOTTOM_RIGHT} anchor
 * @property {UNITS_ALL_PIXEL|UNITS_ALL_PERCENTAGE|UNITS_X_PIXEL_AND_Y_PERCENTAGE|UNITS_X_PERCENTAGE_AND_Y_PIXEL} units
 * @property {number} x
 * @property {number} y
 */

const ANCHOR_TOP_LEFT = 7;
const ANCHOR_TOP_RIGHT = 8;
const ANCHOR_BOTTOM_LEFT = 9;
const ANCHOR_BOTTOM_RIGHT = 10;

const UNITS_ALL_PIXEL = 11;
const UNITS_ALL_PERCENTAGE = 12;
const UNITS_X_PIXEL_AND_Y_PERCENTAGE = 13;
const UNITS_X_PERCENTAGE_AND_Y_PIXEL = 14;

function main() {
}

main();

/**
 * @param {Element} elem 
 * @returns {void}
 */
function processElement(elem) { }
