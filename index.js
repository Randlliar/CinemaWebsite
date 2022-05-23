let page = 1;
let container;
let totalPages;
let favorites = [];
let apiKey = 'ebea8cfca72fdff8d2624ad7bbf78e4c';
const month = {
  '01' : 'Jan',
  '02' : 'Feb',
  '03' : 'Mar',
  '04' : 'Apr',
  '05' : 'May',
  '06' : 'Jun',
  '07' : 'Jul',
  '08' : 'Aug',
  '09' : 'Sep',
  '10' : 'Oct',
  '11' : 'Nov',
  '12' : 'Dec',
}

const section = document.getElementById('section');
section.innerHTML = '';

document.addEventListener('DOMContentLoaded', function () {
  makeReqest();
  getFromLocalStorage();
});

const makeReqest = () => {
  fetch(`https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}&language=en-US&page=${page}`, {
    method: 'GET',
  })
    .then((response) => {
      return response.json();
    })
    .then((response) => {
      totalPages = response.total_pages;
      drawFilms(response);
      drawPagination();
    })
    .catch((e) => {
      console.log(e);
    })
};

const handleClick = (film) => {
  console.log(film);
  fetch(`https://api.themoviedb.org/3/movie/${film.id}/videos?api_key=${apiKey}`, {
    method: 'GET',
  })
    .then((response) => {
      return response.json();
    })
    .then((response) => {
      console.log(response);

      const wrapper = document.createElement('div');
      wrapper.classList.add('modal-wrapper');

      const favoriteFilms = localStorage.getItem('favorites')  ? JSON.parse(localStorage.getItem('favorites')) : [];
      let isInFavorite = favoriteFilms.includes(film.id);
      console.log(isInFavorite);


      const wrapperBackground = document.createElement('div');

      wrapperBackground.style.backgroundImage = `url(${`https://image.tmdb.org/t/p/w500/${film.poster_path}`})`;
      wrapperBackground.style.backgroundRepeat = 'no-repeat';
      wrapperBackground.style.backgroundSize = 'cover';
      wrapperBackground.style.filter = 'blur(8px)';
      wrapperBackground.classList.add('modal-background');
      wrapperBackground.style.backgroundPosition = 'center';

      const div = document.createElement('div');
      div.classList.add('div');

      const closeButton = document.createElement('img');
      closeButton.setAttribute('src', '/images/close.png')
      closeButton.classList.add('close-button');
      closeButton.onclick = () => {
        wrapper.remove();
      }

      const info = document.createElement('div');
      info.classList.add('info');

      const divContainer = document.createElement('div');
      divContainer.classList.add('divContainer');

      const movieData = document.createElement('div');
      movieData.classList.add('movieData');


      const img = buildImageElement(film);
      img.classList.add('image-poster');


      const topDescription = document.createElement('div');
      topDescription.classList.add('top-description');

      const title = document.createElement('span');
      title.classList.add('title');
      title.innerText = `${film.original_title}(${film.release_date.split('-')[0]})`;

      const titleMobile = document.createElement('span');
      titleMobile.classList.add('titleMobile');
      titleMobile.innerText = `${film.original_title}(${film.release_date.split('-')[0]})`;

      const score = document.createElement('span');
      score.classList.add('score');
      score.innerText = `Score: ${film.vote_average}`;


      const rating = document.createElement('span');
      rating.classList.add('rating');
      rating.innerText = `Raiting: ${film.adult ? 'R' : 'G'}`;

      const dateParts = film.release_date.split('-');


      const release = document.createElement('span');
      release.classList.add('release');
      release.innerText = `Release Date: ${month[dateParts[1]]} ${+dateParts[2]}, ${dateParts[0]}`;


      const description = document.createElement('span');
      description.classList.add('description');
      description.innerText = film.overview;

      const descriptionMobile = document.createElement('span');
      descriptionMobile.classList.add('description-mobile');
      descriptionMobile.innerText = film.overview;

      const imgWrapper = document.createElement('div');
      imgWrapper.classList.add('imgWrapper');

      const addToFavorites = document.createElement('span');
      addToFavorites.classList.add('add-to-favourite');
      addToFavorites.innerText = isInFavorite ? 'In favorite' : 'Add to favorite';
      addToFavorites.onclick = () => {
        let favoriteFilms = localStorage.getItem('favorites')  ? JSON.parse(localStorage.getItem('favorites')) : [];
        if (isInFavorite) {
          favoriteFilms = favoriteFilms.filter((item) => {
            return +item !== +film.id;
          })
        }
        else {
          favoriteFilms.push(film.id);
        }
        localStorage.setItem('favorites', JSON.stringify(favoriteFilms));
        isInFavorite = !isInFavorite;
        addToFavorites.innerText = isInFavorite ? 'In favorite' : 'Add to favorite';
        addToFavoritesMobile.setAttribute('src' , isInFavorite ? '/images/star.png' : '/images/close.png'); //добавить в 2 поля
      }

      const addToFavoritesMobile = document.createElement('img');
      addToFavoritesMobile.setAttribute('src' , isInFavorite ? '/images/star.png' : '/images/close.png');
      addToFavoritesMobile.classList.add('add-to-favourite-mobile');
      addToFavoritesMobile.onclick = () => {
        let favoriteFilms = localStorage.getItem('favorites')  ? JSON.parse(localStorage.getItem('favorites')) : [];
        if (isInFavorite) {
          favoriteFilms = favoriteFilms.filter((item) => {
            return +item !== +film.id;
          })
        }
        else {
          favoriteFilms.push(film.id);
        }
        localStorage.setItem('favorites', JSON.stringify(favoriteFilms));
        isInFavorite = !isInFavorite;
        addToFavoritesMobile.setAttribute('src' , isInFavorite ? '/images/star.png' : '/images/close.png'); //добавить в 2 поля
        addToFavorites.innerText = isInFavorite ? 'In favorite' : 'Add to favorite';
      }

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


      wrapper.append(wrapperBackground);
      wrapper.append(div);
      wrapper.append(closeButton);


      document.body.append(wrapper);


    })
    .catch((e) => {
      console.log(e);
    })
}

const buildImageElement = (film) => {
  const img = document.createElement('img');
  img.setAttribute('src', `https://image.tmdb.org/t/p/w500/${film.poster_path}`);
  // img.setAttribute('title', 'film');

  return img;
}

const drawFilms = (films) => {
  console.log(films);
  container = document.getElementById('container');
  container.innerHTML = '';

  //map
  films.results.forEach((film, index) => {
    const div = document.createElement('div');
    div.classList.add('image');
    div.setAttribute('title', film.original_title);


    const img = buildImageElement(film);

    div.append(img);

    div.onclick = () => {
      handleClick(film);
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

  const buttonPrev = document.createElement('button');
  buttonPrev.classList.add('btn', 'btn__pagination');
  buttonPrev.innerText = 'Prev';
  buttonPrev.onclick = () => {
    page--;
    makeReqest();
  }

  if(page === 1){
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

  if(page === totalPages){
    buttonLast.setAttribute('disabled', true);
    buttonNext.setAttribute('disabled', true);
  }

  pagination.append(buttonFirst);
  pagination.append(buttonPrev);
  if (page === totalPages){
    pagination.append(buttonMinusTwo);
  }
  if (page !== 1) {
    pagination.append(buttonMinusOne);
  }
  pagination.append(buttonCurrent);
  if(page !== totalPages) {
    pagination.append(buttonPlusOne);
  }
  if (page === 1) {
    pagination.append(buttonPlusTwo);
  }
  pagination.append(buttonNext);
  pagination.append(buttonLast);
}

const getFromLocalStorage = () => {
  let saved = localStorage.getItem('zalupa');
  if (saved) {
    favorites = JSON.parse(saved);
  }
}




// ??