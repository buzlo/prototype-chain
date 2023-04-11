export default function() {
  const cssPromises = {};

  const $appContainer = document.getElementById('app'),
    searchParams = new URLSearchParams(location.search),
    filmIndex = searchParams.get('filmIndex');

  if (filmIndex) {
    getRenderData(
      './films-details.js',
      `https://swapi.dev/api/films/${filmIndex}`,
      'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css',
    )
      .then(renderData => {
        getAdditionalData(renderData.data, ['planets', 'species'])
          .then(additionalData => {
            renderData.data = { ...renderData.data, additionalData };
            renderPage(renderData)
          })
      })
  } else {
    getRenderData(
      './films-list.js',
      'https://swapi.dev/api/films',
      'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css',
    ).then(renderData => {
      renderPage(renderData)
    });
  }

  function loadResource(src) {
    // JS модуль
    if (src.endsWith('.js')) {
      return import(src);
    }

    // CSS файл
    if (src.endsWith('.css')) {
      if (!cssPromises[src]) {
        const $link = document.createElement('link');
        $link.rel = 'stylesheet';
        $link.href = src;
        cssPromises[src] = new Promise(resolve => {
          $link.addEventListener('load', () => resolve());
        });
        document.head.append($link);
      }

      return cssPromises[src];
    }

    // Данные сервера
    return fetch(src).then(res => res.json());
  }

  async function getRenderData(moduleName, apiURL, css) {
    const [pageModule, data] = await Promise.all([moduleName, apiURL, css]
      .map(src => loadResource(src)));
    return { pageModule, data };
  }

  function renderPage({ pageModule, data }) {
    $appContainer.innerHTML = '';
    $appContainer.append(pageModule.render(data));
  }

  async function getAdditionalData(data, dataKeysArr = []) {
    const additionalData = {};
    await Promise.all(dataKeysArr.map(dataKey => {
      const srcArr = data[dataKey];
      return getPropArr(srcArr)
        .then(propArr => {
          additionalData[dataKey] = propArr
        });
    }))
    return additionalData;

    async function getPropArr(srcArr) {
      return Promise.all(srcArr.map(src => loadResource(src)));
    }
  }
}
