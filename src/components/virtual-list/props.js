import { COMMON_PROPS } from "../scrollbar/const";

export const virtualProps = {
  dataKey: {
    type: [String, Function],
    required: true,
  },
  dataSources: {
    type: Array,
    required: true,
    default: () => [],
  },
  keeps: {
    type: Number,
    default: 30,
  },
  extraProps: {
    type: Object,
  },
  estimateSize: {
    type: Number,
    default: 50,
  },
  observeResize: {
    type: Boolean,
    default: true,
  },
  direction: {
    type: String,
    default: "vertical", // the other value is horizontal
  },
  start: {
    type: Number,
    default: 0,
  },
  offset: {
    type: Number,
    default: 0,
  },
  topThreshold: {
    type: Number,
    default: 0,
  },
  bottomThreshold: {
    type: Number,
    default: 0,
  },
  pageMode: {
    type: Boolean,
    default: false,
  },
  wrapTag: {
    type: String,
    default: "div",
  },
  wrapClass: {
    type: String,
    default: "",
  },
  wrapStyle: {
    type: Object,
  },
  renderItemList: {
    type: Function,
  },
  ...COMMON_PROPS,
};

export const itemProps = {
  index: {
    type: Number,
  },
  horizontal: {
    type: Boolean,
  },
  source: {
    type: [Object, String, Number],
  },
  uniqueKey: {
    type: [String, Number],
  },
  observeResize: {
    type: Boolean,
    default: true,
  },
};
