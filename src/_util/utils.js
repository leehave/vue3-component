import { isFinite, isNull, isString, isUndefined } from 'lodash-es';

import { nextTick } from 'vue';

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const noop = () => {};
export const noopInNoop = () => noop;
export const defaultContainer = () => document.body;

export async function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

export function asyncExpect(fn, timeout) {
    return new Promise((resolve) => {
        if (typeof timeout === 'number') {
            setTimeout(() => {
                fn();
                resolve();
            }, timeout);
        } else {
            nextTick(() => {
                fn();
                resolve();
            });
        }
    });
}

// in order to test transitions, we need to use
// await rAF() after firing transition events.
export const rAF = async () => {
    return new Promise((resolve) => {
        requestAnimationFrame(() => {
            requestAnimationFrame(async () => {
                resolve(null);
                await nextTick();
            });
        });
    });
};

export const hasOwn = (val, key) =>
    Object.hasOwnProperty.call(val, key);

export const requestAnimationFrame = (() => {
    const hackRAF = function (func) {
        return setTimeout(() => {
            func?.();
        }, 10);
    };
    if (typeof window !== 'undefined') {
        return window.requestAnimationFrame || hackRAF;
    }
    return hackRAF;
})();

export const isFirefox = () => !!window.navigator.userAgent.match(/firefox/i);

export const extractPropsDefaultValue = (props) => {
    const defaultValue = {};
    Object.keys(props).forEach((key) => {
        if (props[key].default) {
            defaultValue[key] = props[key].default;
        }
    });
    return defaultValue;
};

// 10px => 10
export const depx = (value) => {
    if (isString(value) && value.endsWith('px')) {
        const formatValue = value.slice(0, value.length - 2);
        if (isFinite(Number(formatValue))) {
            return Number(formatValue);
        }
    }
    if (isFinite(Number(value))) {
        return Number(value);
    }

    console.warn('[depx] 转换失败，原始值为：', value);
    if (isUndefined(value) || isNull(value)) return undefined;
    return value;
};

// 10 => 10px
export const pxfy = (value) => {
    if (isFinite(value)) {
        return `${value}px`;
    }
    if (isFinite(Number(value))) {
        return `${Number(value)}px`;
    }

    if (isUndefined(value) || isNull(value)) return undefined;
    return value;
};

export function getParentNode(node) {
    // document type
    if (node.nodeType === 9) {
        return null;
    }
    return node.parentNode;
}

export function getScrollParent(
    node,
) {
    if (node == null) return null;

    const parentNode = getParentNode(node);

    if (parentNode === null) {
        return null;
    }

    // Document
    if (parentNode.nodeType === 9) {
        return document;
    }

    // Element
    if (parentNode.nodeType === 1) {
        // Firefox want us to check `-x` and `-y` variations as well
        const { overflow, overflowX, overflowY } = getComputedStyle(
            parentNode,
        );
        if (/(auto|scroll|overlay)/.test(overflow + overflowY + overflowX)) {
            return parentNode;
        }
    }

    return getScrollParent(parentNode);
}

// 比Array.concat快
export function concat(arr, arr2) {
    const arrLength = arr.length;
    const arr2Length = arr2.length;
    arr.length = arrLength + arr2Length;
    for (let i = 0; i < arr2Length; i++) {
        arr[arrLength + i] = arr2[i];
    }
    return arr;
}