<template>
  <transition :name="`${prefixCls}-fade`">
    <div
      v-show="always || visible"
      ref="barRef"
      :class="[prefixCls, `is-${barMap.key}`, cursorDown && `is-hovering`]"
      @mousedown.stop.prevent="clickTrackHandler"
    >
      <div
        ref="thumbRef"
        :class="[`${prefixCls}-thumb`]"
        :style="thumbStyle"
        @mousedown.stop.prevent="clickThumbHandler"
      ></div>
    </div>
  </transition>
</template>

<script lang="js">
import {
    computed,
    ref,
    onMounted,
    nextTick,
    defineComponent,
} from 'vue';
import { useEventListener } from '@vueuse/core';
import getPrefixCls from '../../_util/getPrefixCls';
import { BAR_MAP } from './const';

const prefixCls = getPrefixCls('scrollbar-track');

function renderThumbStyle({
    move,
    size,
    bar,
}) {
    const style = {};
    const translate = `translate${bar.axis}(${move}%)`;

    style[bar.size] = size;
    style.transform = translate;

    return style;
}

const barProps = {
    vertical: Boolean,
    size: String,
    move: Number,
    ratio: Number,
    always: Boolean,
    scrollbarRef: Array,
    containerRef: Object,
    thumbStyle: [String, Array, Object],
};

export default defineComponent({
    name: 'Bar',
    props: barProps,
    setup(props) {
        const containerRef = computed(() => props.containerRef);
        const barStore = ref({});
        const barRef = ref();
        const thumbRef = ref();

        const barMap = computed(
            () => BAR_MAP[props.vertical ? 'vertical' : 'horizontal'],
        );
        const thumbStyle = computed(() => [
            renderThumbStyle({
                size: props.size,
                move: props.move,
                bar: barMap.value,
            }),
            props.thumbStyle,
        ]);
        const offsetRatio = computed(
            () =>
                barRef.value[barMap.value.offset] ** 2 /
                containerRef.value[barMap.value.scrollSize] /
                props.ratio /
                thumbRef.value[barMap.value.offset],
        );

        const visible = ref(false);

        const cursorLeave = ref();
        const cursorDown = ref();
        // eslint-disable-next-line no-undef
        let onselectstartStore = null;
        const mouseMoveDocumentHandler = (e) => {
            if (cursorDown.value === false) return;
            const prevPage = barStore.value[barMap.value.axis];

            if (!prevPage) return;

            const offset =
                (barRef.value.getBoundingClientRect()[barMap.value.direction] -
                    e[barMap.value.client]) *
                -1;
            const thumbClickPosition =
                thumbRef.value[barMap.value.offset] - prevPage;
            const thumbPositionPercentage =
                ((offset - thumbClickPosition) * 100 * offsetRatio.value) /
                barRef.value[barMap.value.offset];
            containerRef.value[barMap.value.scroll] =
                (thumbPositionPercentage *
                    containerRef.value[barMap.value.scrollSize]) /
                100;
        };

        let docMouseMoveClose;
        const mouseUpDocumentHandler = () => {
            cursorDown.value = false;
            barStore.value[barMap.value.axis] = 0;
            docMouseMoveClose?.();
            document.onselectstart = onselectstartStore;
            if (cursorLeave.value) {
                visible.value = false;
            }
        };

        const startDrag = (e) => {
            e.stopImmediatePropagation();
            cursorDown.value = true;
            docMouseMoveClose = useEventListener(
                document,
                'mousemove',
                mouseMoveDocumentHandler,
            );
            useEventListener(document, 'mouseup', mouseUpDocumentHandler);
            onselectstartStore = document.onselectstart;
            document.onselectstart = () => false;
        };

        const mouseMoveScrollbarHandler = () => {
            cursorLeave.value = false;
            visible.value = !!props.size;
        };

        const mouseLeaveScrollbarHandler = () => {
            cursorLeave.value = true;
            visible.value = cursorDown.value;
        };
        onMounted(() => {
            nextTick(() => {
                props.scrollbarRef.forEach((item) => {
                    useEventListener(
                        item,
                        'mouseenter',
                        mouseMoveScrollbarHandler,
                    );
                    useEventListener(
                        item,
                        'mousemove',
                        mouseMoveScrollbarHandler,
                    );
                    useEventListener(
                        item,
                        'mouseleave',
                        mouseLeaveScrollbarHandler,
                    );
                });
            });
        });

        const clickTrackHandler = (e) => {
            const offset = Math.abs(
                (e.target).getBoundingClientRect()[
                    barMap.value.direction
                ] - e[barMap.value.client],
            );
            const thumbHalf = thumbRef.value[barMap.value.offset] / 2;
            const thumbPositionPercentage =
                ((offset - thumbHalf) * 100 * offsetRatio.value) /
                barRef.value[barMap.value.offset];
            containerRef.value[barMap.value.scroll] =
                (thumbPositionPercentage *
                    containerRef.value[barMap.value.scrollSize]) /
                100;
        };

        const clickThumbHandler = (e) => {
            // prevent click event of middle and right button
            e.stopPropagation();
            if (e.ctrlKey || [1, 2].includes(e.button)) {
                return;
            }
            window.getSelection().removeAllRanges();
            startDrag(e);
            barStore.value[barMap.value.axis] =
                (e.currentTarget)[barMap.value.offset] -
                (e[barMap.value.client] -
                    (e.currentTarget).getBoundingClientRect()[
                        barMap.value.direction
                    ]);
        };

        return {
            prefixCls,
            barRef,
            thumbRef,
            visible,
            cursorDown,
            barMap,
            thumbStyle,
            clickTrackHandler,
            clickThumbHandler,
        };
    },
});
</script>
