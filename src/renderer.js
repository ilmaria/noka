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
 * @property {number} [borderWidth]
 * @property {Color} [borderColor]
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

// maxInt(u32)
const ROOT_ENTITY_ID = 4294967295;

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
 * @property {Point} start
 * @property {Point} end
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

/**
 * @typedef {object} WindowExtraFields
 * @property {boolean} [NOKA_DEBUG]
 */

/**
 * @typedef {Window & WindowExtraFields} CustomWindow
 */

/** @type {CustomWindow} */(window).NOKA_DEBUG = true;

/** @type {Entity[]} */
const entities = [
  { id: 1, parent: ROOT_ENTITY_ID, layout: LAYOUT_HORIZONTAL_STACK, index: 0 },
  {
    id: 2, parent: 1, rectangle: {
      start: { anchor: ANCHOR_TOP_LEFT, units: UNITS_ALL_PIXEL, x: 0, y: 0 },
      end: { anchor: ANCHOR_TOP_LEFT, units: UNITS_ALL_PIXEL, x: 100, y: 100 }
    },
    color: { r: 255, g: 0.0, b: 10, a: 1.0 },
    index: 0,
  },
  {
    id: 3, parent: 1, rectangle: {
      start: { anchor: ANCHOR_TOP_LEFT, units: UNITS_ALL_PIXEL, x: 0, y: 0 },
      end: { anchor: ANCHOR_TOP_LEFT, units: UNITS_ALL_PIXEL, x: 100, y: 100 }
    },
    color: { r: 10, g: 230, b: 10, a: 1.0 },
    index: 2,
  },
  {
    id: 4, parent: 1, rectangle: {
      start: { anchor: ANCHOR_TOP_LEFT, units: UNITS_ALL_PIXEL, x: 0, y: 0 },
      end: { anchor: ANCHOR_TOP_LEFT, units: UNITS_ALL_PIXEL, x: 500, y: 500 }
    },
    borderColor: { r: 10, g: 230, b: 200, a: 1.0 },
    borderWidth: 2.0,
    index: 1,
  },
  {
    id: 5, parent: 4, rectangle: {
      start: { anchor: ANCHOR_BOTTOM_LEFT, units: UNITS_ALL_PIXEL, x: 5, y: 5 },
      end: { anchor: ANCHOR_BOTTOM_RIGHT, units: UNITS_ALL_PIXEL, x: 10, y: 50 }
    },
    borderColor: { r: 50, g: 30, b: 200, a: 1.0 },
    borderWidth: 4.0,
    index: 0,
  },
  {
    id: 6, parent: 5, rectangle: {
      start: { anchor: ANCHOR_TOP_LEFT, units: UNITS_ALL_PIXEL, x: 5, y: 5 },
      end: { anchor: ANCHOR_TOP_LEFT, units: UNITS_ALL_PIXEL, x: 10, y: 50 }
    },
    borderColor: { r: 250, g: 30, b: 60, a: 1.0 },
    borderWidth: 3.0,
    index: 0,
  }
];

function main() {
  const root = document.getElementById('noka-root');
  if (!root) {
    console.error(`Missing an element with 'noka-root' id.`);
    return;
  }

  entitiesMap.set(ROOT_ENTITY_ID, {
    entity: { id: ROOT_ENTITY_ID },
    elem: root
  });

  for (const entity of entities) {
    processEntity(entity);
  }
}

addEventListener('DOMContentLoaded', () => {
  main();
});

/**
 * @type Map<EntityId, {entity: Entity, elem: HTMLElement}>
 */
const entitiesMap = new Map();

/**
 * @param {Entity} entity 
 * @returns {void}
 */
function processEntity(entity) {
  const prev = entitiesMap.get(entity.id);

  if (!prev) {
    if (!entity.parent) {
      console.warn(`Entity '${entity.id}' was created without parent.`);
    }
    if (entity.index !== undefined) {
      console.warn(`Entity '${entity.id}' was created without index.`);
    }
  }

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

    if (newElem) {
      elem = newElem;
    } else {
      elem = document.createElement('div');
      elem.style.flex = '1';
    }
    elem.style.position = 'relative';
  }

  if (entity.index !== undefined && entity.index !== prev?.entity.index) {
    const parent = getParent(entity, prev?.entity);
    if (parent) {
      let numPlaceholderChildren = entity.index - parent.elem.childElementCount;
      if (numPlaceholderChildren < 0) {
        parent.elem.children[entity.index].replaceWith(elem);
      } else {
        while (numPlaceholderChildren > 0) {
          const placeholder = document.createElement('div');
          if (/** @type {CustomWindow} */(window).NOKA_DEBUG) {
            placeholder.style.backgroundColor = 'rgb(255, 0, 255)';
            placeholder.style.flex = '1';
          }
          parent.elem.appendChild(placeholder);
          numPlaceholderChildren--;
        }
        parent.elem.appendChild(elem);
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
    // const parentDisplay = elem.parentElement?.style.display;
    // if (parentDisplay === 'flex' || parentDisplay === 'grid') {
    //   // Add a dummy container element so that the layoyut can be applied without flexbox limitations.
    //   const container = document.createElement('div');
    //   elem.replaceWith(container);
    //   container.appendChild(elem);
    //   // elem.style.position = 'absolute';
    // }

    elem.style.flex = '';
    const { start, end } = entity.rectangle;
    const bothBottom = anchorIsBottom(start.anchor) && anchorIsBottom(end.anchor);
    const bothTop = anchorIsTop(start.anchor) && anchorIsTop(end.anchor);
    const bothLeft = anchorIsLeft(start.anchor) && anchorIsLeft(end.anchor);
    const bothRight = anchorIsRight(start.anchor) && anchorIsRight(end.anchor);

    const startYField = anchorIsBottom(start.anchor) ? 'bottom' : 'top';
    const endYField = bothBottom || bothTop ? 'height' : anchorIsBottom(start.anchor) ? 'top' : 'bottom';
    const startXField = anchorIsRight(start.anchor) ? 'right' : 'left';
    const endXField = bothRight || bothLeft ? 'width' : anchorIsRight(start.anchor) ? 'left' : 'right';

    setRectanglePosition(elem, start, startYField, startXField);
    setRectanglePosition(elem, end, endYField, endXField);
  }


  if (entity.fontFamily && entity.fontFamily !== prev?.entity.fontFamily) {
    elem.style.fontFamily = entity.fontFamily;
  }
  if (entity.fontSize && entity.fontSize !== prev?.entity.fontSize) {
    elem.style.fontSize = entity.fontSize;
  }
  if (entity.borderWidth && entity.borderWidth !== prev?.entity.borderWidth) {
    elem.style.borderWidth = `${entity.borderWidth}px`;
    elem.style.borderStyle = 'solid';
  }
  if (entity.borderColor && entity.borderColor !== prev?.entity.borderColor) {
    const { r, g, b, a } = entity.borderColor;
    elem.style.borderColor = `rgb(${r},${g},${b},${a})`;
  }

  if (prev) {
    Object.assign(prev.entity, entity);
  } else {
    entitiesMap.set(entity.id, { entity, elem });
  }
}

/**
 * @param {Anchor} anchor
 * @returns {boolean}
 */
function anchorIsBottom(anchor) {
  return anchor === ANCHOR_BOTTOM_LEFT || anchor === ANCHOR_BOTTOM_RIGHT;
}

/**
 * @param {Anchor} anchor
 * @returns {boolean}
 */
function anchorIsTop(anchor) {
  return anchor === ANCHOR_TOP_LEFT || anchor === ANCHOR_TOP_RIGHT;
}

/**
 * @param {Anchor} anchor
 * @returns {boolean}
 */
function anchorIsRight(anchor) {
  return anchor === ANCHOR_TOP_RIGHT || anchor === ANCHOR_BOTTOM_RIGHT;
}

/**
 * @param {Anchor} anchor
 * @returns {boolean}
 */
function anchorIsLeft(anchor) {
  return anchor === ANCHOR_BOTTOM_LEFT || anchor === ANCHOR_TOP_LEFT;
}

/**
 * @param {Entity} entity
 * @param {Entity|undefined} prevEntity
 * @returns {{entity: Entity, elem: HTMLElement}|undefined}
 */
function getParent(entity, prevEntity) {
  const parentId = entity.parent || prevEntity?.parent;
  return parentId ? entitiesMap.get(parentId) : undefined;
}

/**
 * @param {HTMLElement} elem
 * @param {Point} point
 * @param {string} yField
 * @param {string} xField
 * @returns {void}
 */
function setRectanglePosition(elem, point, yField, xField) {
  switch (point.units) {
    case UNITS_ALL_PERCENTAGE:
      elem.style[yField] = `${point.y}%`;
      elem.style[xField] = `${point.x}%`;
      break;
    case UNITS_ALL_PIXEL:
      elem.style[yField] = `${point.y}px`;
      elem.style[xField] = `${point.x}px`;
      break;
    case UNITS_X_PERCENTAGE_AND_Y_PIXEL:
      elem.style[yField] = `${point.y}px`;
      elem.style[xField] = `${point.x}%`;
      break;
    case UNITS_X_PIXEL_AND_Y_PERCENTAGE:
      elem.style[yField] = `${point.y}%`;
      elem.style[xField] = `${point.x}px`;
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
