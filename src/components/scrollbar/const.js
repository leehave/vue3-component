export const PROVIDE_KEY = Symbol("scrollbar");
export const CONTAINER_PROVIDE_KEY = Symbol("scrollbar-container");

export const BAR_MAP = {
  vertical: {
    offset: "offsetHeight",
    scroll: "scrollTop",
    scrollSize: "scrollHeight",
    size: "height",
    key: "vertical",
    axis: "Y",
    client: "clientY",
    direction: "top",
  },
  horizontal: {
    offset: "offsetWidth",
    scroll: "scrollLeft",
    scrollSize: "scrollWidth",
    size: "width",
    key: "horizontal",
    axis: "X",
    client: "clientX",
    direction: "left",
  },
};

export const COMMON_PROPS = {
  shadow: {
    type: [Boolean, Object],
    default: false,
  },
  height: {
    type: [Number, String],
  },
  maxHeight: {
    type: [Number, String],
  },
  native: {
    type: Boolean,
    default: false,
  },
  always: {
    type: Boolean,
    default: false,
  },
  minSize: {
    type: Number,
    default: 20,
  },
};

export const scrollbarProps = {
  containerClass: [Array, Object, String],
  containerStyle: [String, Array, Object],
  contentStyle: [String, Array, Object],
  horizontalRatioStyle: [String, Array, Object],
  verticalRatioStyle: [String, Array, Object],
  shadowStyle: [String, Array, Object],
  thumbStyle: [String, Array, Object],
  noresize: Boolean,
  ...COMMON_PROPS,
};
