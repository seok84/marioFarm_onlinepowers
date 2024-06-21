/**
 * Layout Plugin
 *
 * Layout을 결정한다.
 *
 * @param app
 * @param inject
 */

export default ({ app }, inject) => {
  // Inject $hello(msg) in Vue, context and store.
  inject('layout', (store) => {
    return store.getters.layout === 'modal' ? 'modal' : 'default';
  })
}