const BASE_URL = 'https://movie-list.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/v1/movies/'
const POSTER_URL = BASE_URL + '/posters/'
const MOVIES_PER_PAGE = 12

const movies = []
let filteredMovies = []

const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')
const paginator = document.querySelector('#paginator')

let nowPage = 1
let mode = 'card'
const changeMode = document.querySelector('#change-mode')

// function section
function renderMoviesInCardMode(data) {
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
              <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
            </div>
          </div>
        </div>
      </div >
      `
  })
  dataPanel.innerHTML = rawHTML
}

function renderMoviesInListMode(data) {   //render list mode
  let rawHTML = ''
  data.forEach((item) => {
    rawHTML += `
      <div class="col-sm-12 mt-3 border-bottom">
        <div class="bar mb-2 d-flex justify-content-between">
          <h5>${item.title}</h5>
          <div class="bar-btn">
            <button class="btn btn-primary btn-show-movie" data-toggle="modal" data-target="#movie-modal"
              data-id="${item.id}">More</button>
            <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
          </div>
        </div>
      </div>
    `
  })
  dataPanel.innerHTML = rawHTML
}

function displayDataMode(mode, page) {  // 依照 mode 調用不同涵式渲染
  const dataToShow = getMoviesByPage(page)
  mode === 'card' ? renderMoviesInCardMode(dataToShow) : renderMoviesInListMode(dataToShow)
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

function addToFavorite(id) {
  const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []
  const movie = movies.find((movie) => movie.id === id)
  if (list.some((movie) => movie.id === id)) {
    return alert('此電影已經在收藏清單中！')
  }
  list.push(movie)
  localStorage.setItem('favoriteMovies', JSON.stringify(list))
}

function renderPaginator(amount) {
  const numberOfPages = Math.ceil(amount / MOVIES_PER_PAGE)
  let rawHTML = ''
  for (let page = 1; page <= numberOfPages; page++) {
    rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>`
  }
  paginator.innerHTML = rawHTML
}

function getMoviesByPage(page) {
  const data = filteredMovies.length ? filteredMovies : movies
  const startIndex = (page - 1) * MOVIES_PER_PAGE
  return data.slice(startIndex, startIndex + MOVIES_PER_PAGE)
}

// get API
axios
  .get(INDEX_URL)
  .then((response) => {
    movies.push(...response.data.results)
    renderPaginator(movies.length)
    displayDataMode(mode, nowPage)
    // renderMoviesInCardMode(getMoviesByPage(1))
  })
  .catch((err) => console.log(err))

// 監聽事件

// 監聽 data panel
dataPanel.addEventListener('click', function onPanelClicked(event) {
  if (event.target.matches('.btn-show-movie')) {
    showMovieModal(event.target.dataset.id)
  } else if (event.target.matches('.btn-add-favorite')) {
    addToFavorite(Number(event.target.dataset.id))
  }
})

//監聽表單提交事件
searchForm.addEventListener('submit', function onSearchFormSubmitted(event) {
  event.preventDefault()
  const keyword = searchInput.value.trim().toLowerCase()
  filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(keyword)
  )
  if (filteredMovies.length === 0) {  //錯誤處理：無符合條件的結果
    return alert(`您輸入的關鍵字：${keyword} 沒有符合條件的電影`)
  }
  nowPage = 1
  renderPaginator(filteredMovies.length)
  displayDataMode(mode, nowPage)
})

//監聽分頁器
paginator.addEventListener('click', function onPaginatorClicked(event) {
  if (event.target.tagName !== 'A') return
  nowPage = Number(event.target.dataset.page)
  displayDataMode(mode, nowPage)
})

// 監聽模式切換
changeMode.addEventListener('click', function onChangeModeClicked(event) {
  if (event.target.matches('#card-mode')) {
    mode = 'card'
  } else if (event.target.matches('#list-mode')) {
    mode = 'list'
  }
  displayDataMode(mode, nowPage)
})