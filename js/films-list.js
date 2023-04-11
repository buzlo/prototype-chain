import romanize from "./romanize.js";

export function render(data) {
  const $container = document.createElement('div');

  $container.classList.add(
    'container',
    'd-flex',
    'justify-content-between',
    'flex-wrap',
    'py-4',
  );

  for (const film of data.results) {
    const $filmCard = document.createElement('div'),
      $cardBody = document.createElement('div'),
      $title = document.createElement('h5'),
      $detailsBtn = document.createElement('a'),
      [filmIndex] = film.url.split('/').slice(-2),
      episodeIndex = romanize(film.episode_id);

    $filmCard.style.width = '370px';
    $filmCard.classList.add('card', 'my-2');
    $cardBody.classList.add('card-body');
    $title.classList.add('card-title');
    $detailsBtn.classList.add('btn', 'btn-primary');

    $filmCard.append($cardBody);
    $cardBody.append($title);
    $cardBody.append($detailsBtn);

    $title.textContent = `${filmIndex}. Episode ${episodeIndex}: ${film.title}`;
    $detailsBtn.href = `?filmIndex=${filmIndex}`;
    $detailsBtn.textContent = 'Show details';

    $detailsBtn.addEventListener('click', async (event) => {
      event.preventDefault();
      history.pushState(null, '', $detailsBtn.href);
      const initPage = await import('./main.js');
      initPage.default();
    })

    $container.append($filmCard);
  }

  return $container;
}
