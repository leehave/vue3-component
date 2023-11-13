import * as components from './components'

export const install = function (app) {
  Object.keys(components).forEach((key) => {
    const comp = components[key]
    if (/^(F[A-Z])/.test(key) && comp.install) {
      app.use(comp)
    }
  })
  return app
}
