let page = 1;
let openedFilmPage = 1;
let container;
let totalPages;
let favorites = [];
let films = [];
let apiKey = 'ebea8cfca72fdff8d2624ad7bbf78e4c';
const month = {
  '01': 'Jan',
  '02': 'Feb',
  '03': 'Mar',
  '04': 'Apr',
  '05': 'May',
  '06': 'Jun',
  '07': 'Jul',
  '08': 'Aug',
  '09': 'Sep',
  '10': 'Oct',
  '11': 'Nov',
  '12': 'Dec',
}

document.addEventListener('DOMContentLoaded', function () {
  addMainSections();
  makeReqest();
  clearMain();
  returnToMain();
  getFromLocalStorage();
});

const favoritesFilms = () => {
  getFromLocalStorage();

  const favoritesFilmsBlock = document.createElement('div');
  favoritesFilmsBlock.classList.add('favorites-films-block');

  const myFavorites = document.createElement('section');
  myFavorites.classList.add('my-favorites');
  myFavorites.innerText = 'My Favorites';

  const favoriteContent = document.createElement('section');
  favoriteContent.classList.add('favorite-content');

  favoritesFilmsBlock.append(myFavorites);
  favoritesFilmsBlock.append(favoriteContent);

  let main = document.getElementsByTagName('main');

  main[0].append(favoritesFilmsBlock);

  const allFavoritesFilms = favorites.map((item, index) => {
    return fetch(`https://api.themoviedb.org/3/movie/${item}?api_key=${apiKey}&language=en-US`, {
      method: 'GET',
    })
      .then((response) => {
        return response.json();
      })
  })

  Promise.all(
    allFavoritesFilms
  )
    .then((response) => {

      response.forEach((film, index) => {
        const favoriteFilms = localStorage.getItem('favorites') ? JSON.parse(localStorage.getItem('favorites')) : [];
        let isInFavorite = favoriteFilms.includes(response.id);

        const favoriteFilmBlock = document.createElement('div');
        favoriteFilmBlock.classList.add('favorite-film-block');

        const createPoster = buildImageElement(film);
        createPoster.classList.add('image-poster');

        const descriptionBlock = document.createElement('div');
        descriptionBlock.classList.add('description-block');

        const topContentBlock = document.createElement('div');
        topContentBlock.classList.add('top-content-block');

        const filmTitle = document.createElement('span');
        filmTitle.innerText = film.original_title;
        filmTitle.classList.add('film-title');

        const buttonAddToFavorite = document.createElement('button');
        buttonAddToFavorite.classList.add('button-add-to-favorite');
        buttonAddToFavorite.innerText = 'Unfavorite';
        buttonAddToFavorite.onclick = () => {

            favorites = favorites.filter((item) => {
              return +item !== +film.id;
            })
          localStorage.setItem('favorites', JSON.stringify(favorites));
          favoriteFilmBlock.remove();

          }

        const filmDescription = document.createElement('span');
        filmDescription.innerText = film.overview;
        filmDescription.classList.add('film-description');

        const buttonRemove = document.createElement('button');
        buttonRemove.setAttribute('value', 'remove from favorite');
        buttonRemove.onclick = () => {
          favoriteFilmBlock.remove();
        }

        topContentBlock.append(filmTitle);
        topContentBlock.append(buttonAddToFavorite);

        favoriteFilmBlock.append(createPoster);
        favoriteFilmBlock.append(descriptionBlock);

        descriptionBlock.append(topContentBlock);
        descriptionBlock.append(filmDescription);
        favoriteContent.append(favoriteFilmBlock);
      })
    })
}

const addMainSections = () => {
  const lastRealises = document.createElement('section');
  lastRealises.classList.add('font');
  lastRealises.innerText = 'Last Realises';

  const mainContent = document.createElement('section');
  mainContent.setAttribute('id', 'content');

  const dropDownButton = document.createElement('section');
  dropDownButton.classList.add('film');

  const pagination = document.createElement('div');
  pagination.classList.add('pagination');
  pagination.setAttribute('id', 'pagination');

  const poster = document.createElement('div');
  poster.classList.add('poster');
  poster.setAttribute('id', 'container');

  mainContent.append(poster);
  mainContent.append(pagination);

  let main = document.getElementsByTagName('main');

  main[0].append(lastRealises);
  main[0].append(mainContent);
  main[0].append(dropDownButton);
}

const makeReqest = () => {
  openedFilmPage = page;
  fetch(`https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}&language=en-US&page=${page}`, {
    method: 'GET',
  })
    .then((response) => {
      return response.json();
    })
    .then((response) => {
      totalPages = response.total_pages;
      films = response.results;
      drawFilms(response);
      drawPagination();
    })
    .catch((e) => {
      console.log(e);
    })
};

const findIndex = (id) => {
  return films.findIndex((elemnt) => {
    return elemnt.id === id;
  })
}

const loadFilmFromNextPage = (newOpenedFilmPage) => {
  openedFilmPage = newOpenedFilmPage;
  fetch(`https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}&language=en-US&page=${openedFilmPage}`, {
    method: 'GET',
  })
    .then((response) => {
      return response.json();
    })
    .then((response) => {
      films = [...films, ...response.results];

      const firstId = response.results[0].id;
      handleClick(firstId);
    })
    .catch((e) => {
      console.log(e);
    })
}

const goToNextFilm = (id) => {
  const index = findIndex(id);
  if(index === -1) {
    return;
  } else if (index === films.length - 1) {
    const newOpenedFilmPage = openedFilmPage === totalPages ? 1 : openedFilmPage + 1;
    loadFilmFromNextPage(newOpenedFilmPage);
    return;
  }

  const film = films[index + 1];
  handleClick(film.id);
}

const handleClick = (id) => {
  fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&language=en-US`, {
    method: 'GET',
  })
    .then((response) => {
      return response.json();
    })
    .then((response) => {
      const previousModal = document.getElementsByClassName('modal-wrapper');

      const wrapper = document.createElement('div');
      wrapper.classList.add('modal-wrapper');

      const favoriteFilms = localStorage.getItem('favorites') ? JSON.parse(localStorage.getItem('favorites')) : [];
      let isInFavorite = favoriteFilms.includes(response.id);

      const wrapperBackground = document.createElement('div');

      wrapperBackground.style.backgroundImage = `url(${`https://image.tmdb.org/t/p/w500/${response.poster_path}`})`;
      wrapperBackground.style.backgroundRepeat = 'no-repeat';
      wrapperBackground.style.backgroundSize = 'cover';
      wrapperBackground.style.filter = 'blur(8px)';
      wrapperBackground.classList.add('modal-background');
      wrapperBackground.style.backgroundPosition = 'center';

      const div = document.createElement('div');
      div.classList.add('div');

      const sad = document.createElement('div');
      sad.classList.add('sad');

      const closeButton = document.createElement('img');
      closeButton.setAttribute('src', 'images/close_button.png')
      closeButton.classList.add('close-button');
      closeButton.onclick = () => {
        wrapper.remove();
      }

      const nextMovie = document.createElement('img');
      nextMovie.setAttribute('src', 'images/next_film.png')
      nextMovie.classList.add('next-movie');
      nextMovie.onclick = () => {
        goToNextFilm(response.id);
        console.log(response);
      }

      const info = document.createElement('div');
      info.classList.add('info');

      const divContainer = document.createElement('div');
      divContainer.classList.add('divContainer');

      const movieData = document.createElement('div');
      movieData.classList.add('movieData');

      const img = buildImageElement(response);
      img.classList.add('image-poster');

      const topDescription = document.createElement('div');
      topDescription.classList.add('top-description');

      const title = document.createElement('span');
      title.classList.add('title');
      title.innerText = `${response.original_title}(${response.release_date.split('-')[0]})`;

      const titleMobile = document.createElement('span');
      titleMobile.classList.add('titleMobile');
      titleMobile.innerText = `${response.original_title}(${response.release_date.split('-')[0]})`;

      const score = document.createElement('span');
      score.classList.add('score');
      score.innerText = `Score: ${response.vote_average}`;

      const rating = document.createElement('span');
      rating.classList.add('rating');
      rating.innerText = `Raiting: ${response.adult ? 'R' : 'G'}`;

      const dateParts = response.release_date.split('-');

      const release = document.createElement('span');
      release.classList.add('release');
      release.innerText = `Release Date: ${month[dateParts[1]]} ${+dateParts[2]}, ${dateParts[0]}`;

      const description = document.createElement('span');
      description.classList.add('description');
      description.innerText = response.overview;

      const descriptionMobile = document.createElement('span');
      descriptionMobile.classList.add('description-mobile');
      descriptionMobile.innerText = response.overview;

      const imgWrapper = document.createElement('div');
      imgWrapper.classList.add('imgWrapper');

      const addToFavorites = document.createElement('button');
      addToFavorites.classList.add('add-to-favourite');
      addToFavorites.innerText = isInFavorite ? 'In favorite' : 'Add to favorite';
      addToFavorites.onclick = () => {
        let favoriteFilms = localStorage.getItem('favorites') ? JSON.parse(localStorage.getItem('favorites')) : [];
        if (isInFavorite) {
          favoriteFilms = favoriteFilms.filter((item) => {
            return +item !== +response.id;
          })
        } else {
          favoriteFilms.push(response.id);
        }
        localStorage.setItem('favorites', JSON.stringify(favoriteFilms));
        isInFavorite = !isInFavorite;
        addToFavorites.innerText = isInFavorite ? 'In favorite' : 'Add to favorite';
        addToFavoritesMobile.setAttribute('src', isInFavorite ? 'images/add_to_favorite.png' : 'images/favorites.png');
      }

      const addToFavoritesMobile = document.createElement('img');
      addToFavoritesMobile.setAttribute('src', isInFavorite ? 'images/favorites.png' : 'images/add_to_favorite.png');
      addToFavoritesMobile.classList.add('add-to-favourite-mobile');
      addToFavoritesMobile.onclick = () => {
        let favoriteFilms = localStorage.getItem('favorites') ? JSON.parse(localStorage.getItem('favorites')) : [];
        if (isInFavorite) {
          favoriteFilms = favoriteFilms.filter((item) => {
            return +item !== +response.id;
          })
        } else {
          favoriteFilms.push(response.id);
        }
        localStorage.setItem('favorites', JSON.stringify(favoriteFilms));
        isInFavorite = !isInFavorite;
        addToFavoritesMobile.setAttribute('src', isInFavorite ? 'images/favorites.png' : 'images/add_to_favorite.png');
        addToFavorites.innerText = isInFavorite ? 'In favorite' : 'Add to favorite';
      }

      buttonsContainer = document.createElement('div');
      buttonsContainer.classList.add('buttons-container');

      div.append(img);

      movieData.append(score);
      movieData.append(rating);
      movieData.append(release);

      topDescription.append(title);
      topDescription.append(movieData);

      imgWrapper.append(addToFavorites);
      imgWrapper.append(addToFavoritesMobile);

      info.append(imgWrapper);
      info.append(topDescription);
      info.append(description);

      divContainer.append(img);
      divContainer.append(info);


      div.append(divContainer);
      div.append(titleMobile);
      div.append(descriptionMobile);

      buttonsContainer.append(closeButton);
      buttonsContainer.append(nextMovie);


      // div.append(closeButton);
      wrapper.append(wrapperBackground);
      wrapper.append(buttonsContainer);

      wrapper.append(div);
      // wrapper.append(buttonsContainer);

      let main = document.getElementsByTagName('main');

      main[0].append(wrapper);

      if(previousModal && previousModal.length > 1) {
        previousModal[0].remove();
      }

    })
    .catch((e) => {
      console.log(e);
    })
}

const buildImageElement = (film) => {
  const img = document.createElement('img');
  img.setAttribute('src', `https://image.tmdb.org/t/p/w500/${film.poster_path}`);

  return img;
}

const clearMain = () => {
  const favoritesSelected = document.getElementById('favoritesSelected');
  favoritesSelected.onchange = (favoriteFilm) => {
    console.log(favoriteFilm);
    if (favoriteFilm.target.value === 'favoriteFilm') {
      const main = document.getElementsByTagName('main');
      main[0].innerHTML = '';
      favoritesFilms();
    }
    else {
      const main = document.getElementsByTagName('main');
      main[0].innerHTML = '';
      addMainSections();
      makeReqest();
    }
  }
}

const drawFilms = (films) => {
  container = document.getElementById('container');
  container.innerHTML = '';

  films.results.forEach((film, index) => {
    const div = document.createElement('div');
    div.classList.add('image');
    div.setAttribute('title', film.original_title);

    const img = buildImageElement(film);

    div.append(img);

    div.onclick = () => {
      handleClick(film.id);
    }

    container.append(div);
  })
}

const drawPagination = () => {
  pagination = document.getElementById('pagination');
  pagination.innerHTML = '';

  const buttonFirst = document.createElement('button');
  buttonFirst.classList.add('btn', 'btn__pagination');
  buttonFirst.innerText = 'First';
  buttonFirst.onclick = () => {
    page = 1;
    makeReqest();
  }

  const firstPage = document.createElement('button');
  firstPage.classList.add('btn', 'btn__pagination');
  firstPage.innerText = '1';
  firstPage.onclick = () => {
    page = 1;
    makeReqest();
  }

  const buttonMinusThree = document.createElement('button');
  buttonMinusThree.classList.add('btn', 'btn__pagination');
  buttonMinusThree.innerText = '...';
  buttonMinusThree.onclick = () => {
    page -= 3;
    makeReqest();
  }

  const lastPage = document.createElement('button');
  lastPage.classList.add('btn', 'btn__pagination');
  lastPage.innerText = totalPages;
  lastPage.onclick = () => {
    page = totalPages;
    makeReqest();
  }

  const buttonPlusThree = document.createElement('button');
  buttonPlusThree.classList.add('btn', 'btn__pagination');
  buttonPlusThree.innerText = '...';
  buttonPlusThree.onclick = () => {
    page += 3;
    makeReqest();
  }

  const buttonPrev = document.createElement('button');
  buttonPrev.classList.add('btn', 'btn__pagination');
  buttonPrev.innerText = 'Prev';
  buttonPrev.onclick = () => {
    page--;
    makeReqest();
  }

  if (page === 1) {
    buttonFirst.setAttribute('disabled', true);
    buttonPrev.setAttribute('disabled', true);
  }

  const buttonMinusTwo = document.createElement('button');
  buttonMinusTwo.classList.add('btn', 'btn__pagination');
  buttonMinusTwo.innerText = page - 2;
  buttonMinusTwo.onclick = () => {
    page -= 2;
    makeReqest();
  }

  const buttonMinusOne = document.createElement('button');
  buttonMinusOne.classList.add('btn');
  buttonMinusOne.innerText = page - 1;
  buttonMinusOne.onclick = () => {
    page--;
    makeReqest();
  }

  const buttonCurrent = document.createElement('button');
  buttonCurrent.innerText = page;
  buttonCurrent.classList.add('btn', 'btn__num');

  const buttonPlusOne = document.createElement('button');
  buttonPlusOne.classList.add('btn');
  buttonPlusOne.innerText = page + 1;
  buttonPlusOne.onclick = () => {
    page++;
    makeReqest();
  }

  const buttonPlusTwo = document.createElement('button');
  buttonPlusTwo.classList.add('btn', 'btn__pagination');
  buttonPlusTwo.innerText = page + 2;
  buttonPlusTwo.onclick = () => {
    page += 2;
    makeReqest();
  }

  const buttonNext = document.createElement('button');
  buttonNext.classList.add('btn', 'btn__pagination');
  buttonNext.innerText = 'Next';
  buttonNext.onclick = () => {
    page++;
    makeReqest();
  }

  const buttonLast = document.createElement('button');
  buttonLast.classList.add('btn', 'btn__pagination');
  buttonLast.innerText = 'Last';
  buttonLast.onclick = () => {
    page = totalPages;
    makeReqest();
  }

  if (page === totalPages) {
    buttonLast.setAttribute('disabled', true);
    buttonNext.setAttribute('disabled', true);
  }

  pagination.append(buttonFirst);
  pagination.append(buttonPrev);

  if (page >= 3) {
  pagination.append(firstPage);
  }
  if (page > 3) {
    pagination.append(buttonMinusThree);
  }
  if (page === totalPages) {
    pagination.append(buttonMinusTwo);
  }
  if (page !== 1) {
    pagination.append(buttonMinusOne);
  }
  pagination.append(buttonCurrent);
  if (page !== totalPages) {
    pagination.append(buttonPlusOne);
  }
  if (page === 1) {
    pagination.append(buttonPlusTwo);
  }
  if (page < totalPages - 3) {
    pagination.append(buttonPlusThree);
  }
  if (page <= totalPages - 3 ) {
    pagination.append(lastPage);
  }

  pagination.append(buttonNext);
  pagination.append(buttonLast);
}

const getFromLocalStorage = () => {
  let saved = localStorage.getItem('favorites');
  if (saved) {
    favorites = JSON.parse(saved);
  }
}

const returnToMain = () => {
  const mainWindow = document.getElementById('mainWindow');
  mainWindow.onclick = () => {
    const main = document.getElementsByTagName('main');
    main[0].innerHTML = '';
    addMainSections();
    makeReqest();
  }
}



