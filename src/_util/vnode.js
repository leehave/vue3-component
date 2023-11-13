import {
  Comment,
  Fragment,
  Text,
  createTextVNode,
  isVNode,
} from 'vue'

const TEMPLATE = 'template'

export const isFragment = (node) => node.type === Fragment

export const isText = (node) => node.type === Text

export const isComment = (node) => node.type === Comment

export const isTemplate = (node) => node.type === TEMPLATE

/**
 * determine if the element is a valid element type rather than fragments and comment e.g. <template> v-if
 * @param node {VNode} node to be tested
 */
export const isValidElementNode = (node) =>
  !(isFragment(node) || isComment(node))

export function getFirstValidNode(vNodes) {
  const slotContent = flatten(vNodes)
  // vue will normalize the slot, so slot must be an array
  if (slotContent.length === 1) {
    return slotContent[0]
  } else {
    console.warn('getFirstSlotVNode', `vNodes should have exactly one child`)
    return null
  }
}

export function getSlot(
  slots,
  slotName = 'default',
  props = undefined
) {
  const slot = slots[slotName]
  if (slot === undefined) {
    console.warn('getSlot', `slot[${slotName}] is empty.`)
    return null
  }
  return slot(props)
}

// o(n) flatten
export function flatten(
  vNodes,
  result = [],
  key
) {
  vNodes.forEach((vNode) => {
    if (vNode === null) return
    if (typeof vNode !== 'object') {
      if (typeof vNode === 'string' || typeof vNode === 'number') {
        result.push(createTextVNode(String(vNode)))
      }
      return
    }
    if (Array.isArray(vNode)) {
      flatten(vNode, result)
      return
    }
    if (vNode.type === Fragment) {
      if (vNode.children === null) return
      const currentKey = key ? `${key}_${String(vNode.key)}` : String(vNode.key)
      if (Array.isArray(vNode.children)) {
        vNode.children.forEach((node, index) => {
          if (isVNode(node)) {
            if (node.key === undefined || node.key === null) {
              node.key = `${currentKey}_${index}`
            }
          }
        })
        flatten(vNode.children, result, currentKey)
      }
    }
    // rawSlot
    else if (vNode.type !== Comment) {
      result.push(vNode)
    }
  })
  return result
}
