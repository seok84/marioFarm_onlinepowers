/**
 * SEO Plugin
 *
 * Page에서 Seo 값을 조회한다.
 *
 * @param app
 * @param inject
 */

export default ({ app }, inject) => {
  // Inject $hello(msg) in Vue, context and store.
  inject('seo', async (path, axios) => {
    const seo = await axios.$get('/api/seo?u=' + encodeURIComponent(path));

    let metaData = [];

    if (seo !== null && seo.indexFlag) {
      metaData.push({ hid: 'keywords', name: 'keywords', content: seo.keywords});
      metaData.push({ hid: 'description', name: 'description', content: seo.description });

      const og = seo.openGraph;

      if (og != null) {
        metaData.push({ hid: 'og:url', name: 'og:url', property: 'og:url', content: og.url });
        metaData.push({ hid: 'og:title', name: 'og:title', property: 'og:title', content: og.title });
        metaData.push({ hid: 'og:description', name: 'og:description', property: 'og:description', content: og.description });
        metaData.push({ hid: 'og:image', name: 'og:image', property: 'og:image', content: og.image });
      }
    } else {
      metaData.push({ hid: 'robots', name: 'robots', content: 'noindex,noarchive'});
    }

    return {
      title: seo.title,
      meta: metaData
    }
  })
}