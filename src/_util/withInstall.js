import { noop } from './utils'

export function withInstall(main, extra, directives) {
  const _main = main
  _main.install = (app) => {
    for (const comp of [main, ...Object.values(extra ?? {})]) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      app.component(comp.name, comp)
    }
    if (directives) {
      for (const directive of directives) {
        app.directive(directive.name, directive)
      }
    }
  }
  if (extra) {
    for (const [key, comp] of Object.entries(extra)) {
      _main[key] = comp
    }
  }
  return _main
}

export function withNoopInstall(component) {
  const _main = component
  _main.install = noop

  return _main
}
