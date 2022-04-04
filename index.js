let page = 1;

document.addEventListener('DOMContentLoaded', function () {
  initApp();
});

const initApp = () => {
  fetch(`https://api.themoviedb.org/3/movie/now_playing?api_key=ebea8cfca72fdff8d2624ad7bbf78e4c&language=en-US&page=${page}`, {
    method: 'GET',
  })
    .then((response) => {
      return response.json();
    })
    .then((response) => {
      console.log(response);
    })
    .catch((e) => {
      console.log(e);
    })
};


