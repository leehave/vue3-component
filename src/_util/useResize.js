import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  unref,
  watch,
} from 'vue'

import { ResizeObserver } from '@juggle/resize-observer'

export default (
  triggerRef,
  callback,
  disabled,
  immediate = true
) => {
  const disabledRef = computed(() => unref(disabled))
  const handleResize = (...params) => {
    if (disabledRef.value) {
      return
    }
    if (!immediate) {
      immediate = true
      return
    }
    callback?.(...params)
  }

  const ro = new ResizeObserver(handleResize)

  let observedDom = null

  const handle = (dom) => {
    if (observedDom) {
      ro.unobserve(observedDom)
    }
    if (dom) {
      ro.observe(dom)
      observedDom = dom
    }
  }

  onMounted(() => {
    watch(
      triggerRef,
      () => {
        nextTick(() => {
          handle(triggerRef.value)
        })
      },
      {
        immediate: true,
      }
    )
  })

  onBeforeUnmount(() => {
    ro.disconnect()
  })
}
