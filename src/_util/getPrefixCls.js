const prefixCls = 'fe'

export default function getPrefixCls(suffixCls) {
  return suffixCls ? `${prefixCls}-${suffixCls}` : prefixCls
}
