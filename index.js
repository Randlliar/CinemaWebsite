let page = 1;
let container;
let totalPages;

document.addEventListener('DOMContentLoaded', function () {
  makeReqest();
});

const makeReqest = () => {
  fetch(`https://api.themoviedb.org/3/movie/now_playing?api_key=ebea8cfca72fdff8d2624ad7bbf78e4c&language=en-US&page=${page}`, {
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

const drawFilms = (films) => {
  console.log(films);
  container = document.getElementById('container');
  container.innerHTML = '';

  films.results.forEach((film, index) => {
    const div = document.createElement('div');
    div.classList.add('image');

    const img = document.createElement('img');
    img.setAttribute('src', `https://image.tmdb.org/t/p/w500/${film.poster_path}`);

    div.append(img);

    container.append(div);
  })
}

const drawPagination = () => {
  pagination = document.getElementById('pagination');
  pagination.innerHTML = '';

  const buttonFirst = document.createElement('button');
  buttonFirst.innerText = 'First';
  buttonFirst.onclick = () => {
    page = 1;
    makeReqest();
  }

  const buttonPrev = document.createElement('button');
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
  buttonMinusTwo.innerText = page - 2;
  buttonMinusTwo.onclick = () => {
    page -= 2;
    makeReqest();
  }

  const buttonMinusOne = document.createElement('button');
  buttonMinusOne.innerText = page - 1;
  buttonMinusOne.onclick = () => {
    page--;
    makeReqest();
  }

  const buttonCurrent = document.createElement('button');
  buttonCurrent.innerText = page;

  const buttonPlusOne = document.createElement('button');
  buttonPlusOne.innerText = page + 1;
  buttonPlusOne.onclick = () => {
    page++;
    makeReqest();
  }

  const buttonPlusTwo = document.createElement('button');
  buttonPlusTwo.innerText = page + 2;
  buttonPlusTwo.onclick = () => {
    page += 2;
    makeReqest();
  }

  const buttonNext = document.createElement('button');
  buttonNext.innerText = 'Next';
  buttonNext.onclick = () => {
    page++;
    makeReqest();
  }

  const buttonLast = document.createElement('button');
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


