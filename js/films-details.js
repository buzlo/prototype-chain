import romanize from "./romanize.js";

export function render(data) {
  const $container = document.createElement('div'),
    $toEpisodesBtn = document.createElement('a'),
    $title = document.createElement('h1'),
    $descr = document.createElement('p'),
    [filmIndex] = data.url.split('/').slice(-2),
    episodeIndex = romanize(data.episode_id),
    additionalData = data.additionalData;

  $container.classList.add(
    'container',
    'py-4',
  );

  $container.style.maxWidth = '700px';

  $toEpisodesBtn.classList.add('btn', 'btn-primary', 'mb-2');
  $toEpisodesBtn.href = '/';
  $toEpisodesBtn.textContent = 'Back To Episodes';
  $toEpisodesBtn.addEventListener('click', async (event) => {
    event.preventDefault();
    history.pushState(null, '', $toEpisodesBtn.href);
    const initPage = await import('./main.js');
    initPage.default();
  })

  $title.textContent = `${filmIndex}. Episode ${episodeIndex}: ${data.title}`;
  $descr.textContent = data.opening_crawl;

  $container.append($toEpisodesBtn, $title, $descr);

  for (const key in additionalData) {
    const $section = document.createElement('section'),
    $propTitle = createPropTitle(key),
    $propList = createPropList(additionalData[key]);

    $section.append($propTitle, $propList);
    $container.append($section);
  }

  return $container;
}

function createPropTitle(propKey) {
  const $propTitle = document.createElement('h2');
  $propTitle.textContent = propKey && propKey[0].toUpperCase() + propKey.slice(1);
  return $propTitle;
}

function createPropList(propValue) {
  const $propList = document.createElement('ul');

  for (const item of propValue) {
    const $li = document.createElement('li');
    $li.textContent = item.name;
    $propList.append($li);
  }

  return $propList;
}
