import { cloneVNode, computed, defineComponent, ref } from "vue";

import getElementFromVueInstance from "../../_util/getElementFromVueInstance";
import { getFirstValidNode } from "../../_util/vnode";
import { itemProps } from "./props";
import useResize from "../../_util/useResize";

// wrapping for item
export const VirtualListItem = defineComponent({
  name: "VirtualListItem",
  props: itemProps,
  setup(props, { attrs }) {
    const itemRef = ref();

    // tell parent current size identify by unqiue key
    const dispatchSizeChange = () => {
      const shapeKey = props.horizontal ? "offsetWidth" : "offsetHeight";
      const s = itemRef.value ? itemRef.value[shapeKey] : 0;
      attrs.onItemResized(props.uniqueKey, s);
    };

    useResize(
      itemRef,
      dispatchSizeChange,
      computed(() => !props.observeResize)
    );

    return {
      itemRef,
    };
  },
  render() {
    const { index, source, $slots } = this;
    const vNode = getFirstValidNode($slots.default?.({ index, source }) ?? []);
    if (!vNode) {
      return;
    }
    return cloneVNode(
      vNode,
      {
        ref: (el) => {
          if (el) this.itemRef = getElementFromVueInstance(el);
        },
      },
      true
    );
  },
});
