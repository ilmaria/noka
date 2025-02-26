// @ts-check

/**
 * @typedef Entity
 * @type {object}
 * @property {EntityId} id
 * @property {EntityId} [parent]
 * @property {number} [index]
 * @property {Layout} [layout]
 * @property {Flags} [flags]
 * @property {number} [cornerRadius]
 * @property {Color} [color]
 * @property {void} [enabledIf]
 * @property {Length} [triangleStrip]
 * @property {Rectangle} [rectangle]
 * @property {string} [text]
 * @property {TextType} [textType]
 * @property {void} [fontFamily]
 * @property {void} [fontSize]
 */

/**
 * @typedef EntityId
 * @type {number}
 */

/**
 * @typedef Length
 * @type {number}
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
 * @property {boolean} [useRtl]
 * @property {boolean} [removePreviousChildren]
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
 * @property {Anchor} anchor
 * @property {UNITS_ALL_PIXEL|UNITS_ALL_PERCENTAGE|UNITS_X_PIXEL_AND_Y_PERCENTAGE|UNITS_X_PERCENTAGE_AND_Y_PIXEL} units
 * @property {number} x
 * @property {number} y
 */

/**
 * @typedef Anchor
 * @type {ANCHOR_TOP_LEFT|ANCHOR_TOP_RIGHT|ANCHOR_BOTTOM_LEFT|ANCHOR_BOTTOM_RIGHT}
 */

const ANCHOR_TOP_LEFT = 7;
const ANCHOR_TOP_RIGHT = 8;
const ANCHOR_BOTTOM_LEFT = 9;
const ANCHOR_BOTTOM_RIGHT = 10;

const UNITS_ALL_PIXEL = 11;
const UNITS_ALL_PERCENTAGE = 12;
const UNITS_X_PIXEL_AND_Y_PERCENTAGE = 13;
const UNITS_X_PERCENTAGE_AND_Y_PIXEL = 14;

/**
 * @typedef TextType
 * @type {TEXT_TYPE_BODY|TEXT_TYPE_TITLE|TEXT_TYPE_SUB_TITLE}
 */

const TEXT_TYPE_BODY = 15;
const TEXT_TYPE_TITLE = 16;
const TEXT_TYPE_SUB_TITLE = 17;

function main() {
}

main();

/**
 * @type Map<EntityId, {entity: Entity, elem: HTMLElement}>
 */
const entitiesMap = new Map();

/**
 * @param {Entity} entity 
 * @returns {void}
 */
function processElement(entity) {
  const prev = entitiesMap.get(entity.id);

  /** @type {HTMLElement} */
  let elem;
  {
    // Apply attributes that can create a new element.
    /** @type {HTMLElement|undefined} */
    let newElem;
    if (entity.textType && entity.textType !== prev?.entity.textType) {
      if (entity.textType == TEXT_TYPE_BODY) {
        elem = createNewElement(prev?.elem, 'p');
      } else if (entity.textType == TEXT_TYPE_TITLE) {
        elem = createNewElement(prev?.elem, 'h1');
      } else if (entity.textType == TEXT_TYPE_SUB_TITLE) {
        elem = createNewElement(prev?.elem, 'h2');
      }
    }

    newElem = newElem || prev?.elem;
    if (entity.text && entity.text !== prev?.entity.text) {
      if (!newElem) {
        newElem = document.createElement('p');
      }
      newElem.textContent = entity.text;
    }

    elem = newElem || document.createElement('div');
    elem.style.position = 'relative';
  }

  if (entity.index && entity.index !== prev?.entity.index) {
    const parentId = entity.parent || prev?.entity.parent;
    if (parentId) {
      const parent = entitiesMap.get(parentId);
      if (parent) {
        let numPlaceholderChildren = entity.index - (parent.elem.childElementCount + 1);
        if (numPlaceholderChildren < 0) {
          parent.elem.insertBefore(elem, parent.elem.children[entity.index]);
        } else {
          while (numPlaceholderChildren > 0) {
            const placeholder = document.createElement('div');
            parent.elem.appendChild(placeholder);
            numPlaceholderChildren--;
          }
          parent.elem.appendChild(elem);
        }
      }
    }
  }

  if (entity.layout && entity.layout !== prev?.entity.layout) {
    switch (entity.layout) {
      case LAYOUT_HORIZONTAL_STACK:
        elem.style.display = 'flex';
        elem.style.direction = 'row';
        break;
      case LAYOUT_VERTICAL_STACK:
        elem.style.display = 'flex';
        elem.style.direction = 'column';
        break;
      case LAYOUT_GRID:
        elem.style.display = 'grid';
        break;
    }
  }

  if (entity.flags && entity.flags !== prev?.entity.flags) {
    // TODO
  }

  if (entity.cornerRadius && entity.cornerRadius !== prev?.entity.cornerRadius) {
    elem.style.borderRadius = entity.cornerRadius.toString();
  }

  if (entity.color && entity.color !== prev?.entity.color) {
    const { r, g, b, a } = entity.color;
    elem.style.backgroundColor = `rgb(${r},${g},${b},${a})`;
  }

  if (entity.enabledIf && entity.enabledIf !== prev?.entity.enabledIf) {
    // TODO
  }

  if (entity.triangleStrip && entity.triangleStrip !== prev?.entity.triangleStrip) {
    // TODO
  }

  if (entity.rectangle && entity.rectangle !== prev?.entity.rectangle) {
    const min = entity.rectangle.min;
    switch (min.anchor) {
      case ANCHOR_BOTTOM_LEFT:
        setRectanglePosition(elem, min, 'bottom', 'left');
        break;
      case ANCHOR_BOTTOM_RIGHT:
        setRectanglePosition(elem, min, 'bottom', 'right');
        break;
      case ANCHOR_TOP_LEFT:
        setRectanglePosition(elem, min, 'top', 'left');
        break;
      case ANCHOR_TOP_RIGHT:
        setRectanglePosition(elem, min, 'top', 'right');
        break;
    }
  }


  if (entity.fontFamily && entity.fontFamily !== prev?.entity.fontFamily) {
    elem.style.fontFamily = entity.fontFamily;
  }

  if (entity.fontSize && entity.fontSize !== prev?.entity.fontSize) {
    elem.style.fontSize = entity.fontSize;
  }

  if (prev) {
    Object.assign(prev.entity, entity);
  } else {
    entitiesMap.set(entity.id, { entity, elem });
  }
}

/**
 * @param {HTMLElement} elem
 * @param {Point} point
 * @param {string} yAnchor
 * @param {string} xAnchor
 * @returns {void}
 */
function setRectanglePosition(elem, point, yAnchor, xAnchor) {
  switch (point.units) {
    case UNITS_ALL_PERCENTAGE:
      elem.style[yAnchor] = `${point.y}%`;
      elem.style[xAnchor] = `${point.x}%`;
      break;
    case UNITS_ALL_PIXEL:
      elem.style[yAnchor] = `${point.y}px`;
      elem.style[xAnchor] = `${point.x}px`;
      break;
    case UNITS_X_PERCENTAGE_AND_Y_PIXEL:
      elem.style[yAnchor] = `${point.y}px`;
      elem.style[xAnchor] = `${point.x}%`;
      break;
    case UNITS_X_PIXEL_AND_Y_PERCENTAGE:
      elem.style[yAnchor] = `${point.y}%`;
      elem.style[xAnchor] = `${point.x}px`;
      break;
  }
}

/**
 * @param {HTMLElement|undefined} oldElem 
 * @param {keyof HTMLElementTagNameMap} newElemType 
 * @returns {HTMLElement}
 */
function createNewElement(oldElem, newElemType) {
  const newElem = document.createElement(newElemType);
  if (oldElem) {
    newElem.style.cssText = oldElem.style.cssText;
  }
  return newElem;
}
