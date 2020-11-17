const BASE_URL = 'https://movie-list.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/v1/movies/'
const POSTER_URL = BASE_URL + '/posters/'
const movies = JSON.parse(localStorage.getItem('favoriteMovies')) || []
const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')

// function section
function renderMovieList(data) {
  let rawHTML = ''
  data.forEach((item) => {
    rawHTML += `
      <div class="col-sm-3">
        <div class="mb-2">
          <div class="card">
            <img
              src="${POSTER_URL + item.image}"
              class="card-img-top" alt="Movie Poster" />
            <div class="card-body">
              <h5 class="card-title">${item.title}</h5>
            </div>
            <div class="card-footer">
              <button class="btn btn-primary btn-show-movie" data-toggle="modal"
                data-target="#movie-modal" data-id="${item.id}">More</button>
              <button class="btn btn-danger btn-remove-favorite" data-id="${item.id}">x</button>
            </div>
          </div>
        </div>
      </div >
      `
  })
  dataPanel.innerHTML = rawHTML
}

function showMovieModal(id) {
  const modalTitle = document.querySelector('#movie-modal-title')
  const modalImage = document.querySelector('#movie-modal-image')
  const modalDate = document.querySelector('#movie-modal-date')
  const modalDescription = document.querySelector('#movie-modal-description')
  let item = movies[id - 1]
  modalTitle.innerText = item.title
  modalDate.innerText = 'Release date: ' + item.release_date
  modalDescription.innerText = item.description
  modalImage.innerHTML = `<img src="${POSTER_URL + item.image
    }" alt="movie-poster" class="img-fluid">`
}

function removeFromFavorite(id) {
  if(!movies) return

  //透過 id 找到要刪除電影的 index
  const movieIndex = movies.findIndex((movie) => movie.id === id)
  if(movieIndex === -1) return

  //刪除該筆電影
  movies.splice(movieIndex,1)

  //存回 local storage
  localStorage.setItem('favoriteMovies', JSON.stringify(movies))

  //更新頁面
  renderMovieList(movies)
}

// 主程式
renderMovieList(movies)

// 監聽事件

// 監聽 data panel
dataPanel.addEventListener('click', function onPanelClicked(event) {
  if (event.target.matches('.btn-show-movie')) {
    showMovieModal(event.target.dataset.id)
    // console.log(event.target.dataset.id)
  } else if (event.target.matches('.btn-remove-favorite')) {
    removeFromFavorite(Number(event.target.dataset.id))
  }
})