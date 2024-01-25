const appState = {
  currentPage: window.location.pathname,
  search: {
    query: "",
    type: "",
    page: 1,
    totalPages: 1,
    totalResults: 0,
  },
};

//fetches data from the movies database api
const fetchData = async (endpoint) => {
  const URL = "https://api.themoviedb.org/3";
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2Mzg1ZTk4ZDM4YzQ3NGUyOWM2NmZlZDIwYzgxODU5YSIsInN1YiI6IjY1YWIyYzZmMzU3YzAwMDBjNWQ2ZmM4OSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.D9c8uU_ytJoamwubLnsGvf6Jzuyvxdz6tGEI4bhYV3A",
    },
  };

  try {
    showLoading();
    const response = await fetch(`${URL}${endpoint}`, options);
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    const data = await response.json();
    hideLoading();
    return data;
  } catch (error) {
    alert("Error: " + error);
  }
};

//Fetches popular movies using the fetchData function
const getPopularMovies = async () => {
  const endpoint = "/movie/popular?language=en-US&page=1";
  const data = await fetchData(endpoint);
  showPopularMovies(data.results);
};

//Fetches popular shows using the fetchData function
const getPopularShows = async () => {
  const endpoint = "/tv/popular?language=en-US&page=1";
  const data = await fetchData(endpoint);
  showPopularShows(data.results);
};

//Fetches details of a particular movie using the fetchData function
const getMovieDetails = async () => {
  const href = window.location.href;
  const movieID = href.slice(44);
  const endpoint1 = `/movie/${movieID}?language=en-US`;
  const endpoint2 = `/movie/${movieID}/credits?language=en-US`;
  const movie = await fetchData(endpoint1);
  const credits = await fetchData(endpoint2);
  showMovieDetails(credits, movie);
};

//Fetches details of a particular tv show using the fetchData function
const getTvDetails = async () => {
  const href = window.location.href;
  const showID = href.slice(41);
  const endpoint1 = `/tv/${showID}?language=en-US`;
  const endpoint2 = `/tv/${showID}/credits?language=en-US`;
  const movie = await fetchData(endpoint1);
  const credits = await fetchData(endpoint2);
  showTvDetails(credits, movie);
};

//Fetches now playing movies using the fetchData function
const getNowPlaying = async () => {
  const endpoint = "/movie/now_playing?language=en-US&page=1";
  const data = await fetchData(endpoint);
  showNowPlaying(data.results);
};

const getSearchResults = async () => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  appState.search.type = urlParams.get("type");
  appState.search.query = urlParams.get("search-term");

  if (appState.search.query === "" || appState.search.query === null) {
    hideLoading();
    showAlert("Please enter a movie or tv show", "error");
    return;
  } else {
    const endpoint = `/search/${appState.search.type}?query=${appState.search.query}&include_adult=false&language=en-US&page=${appState.search.page}`;
    // destructuring bcos the return object has a result, page, total_pages & total_reults value
    const { results, page, total_results, total_pages } = await fetchData(
      endpoint
    );
    appState.search.page = page;
    appState.search.totalPages = total_pages;
    appState.search.totalResults = total_results;
    showSearchResults(results);
    document.getElementById("search-term").value = "";
  }
};

//Adds popular movies to the DOM
const showPopularMovies = (movies) => {
  //creating the card item for each movie in the list of movies
  movies.forEach((movie) => {
    const moviesCard = document.createElement("div");
    moviesCard.classList.add("card");

    const cardLink = document.createElement("a");
    cardLink.href = `movie-details.html?id=${movie.id}`;

    const cardLinkImage = document.createElement("img");
    cardLinkImage.src = movie.poster_path
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : "/images/no-image.jpg";
    cardLinkImage.classList.add("card-img-top");
    cardLinkImage.alt = movie.title;

    const cardBody = document.createElement("div");
    cardBody.classList.add("card-body");

    const cardTitle = document.createElement("h5");
    cardTitle.classList.add("card-title");
    cardTitle.textContent = movie.title;

    const cardText = document.createElement("p");
    cardText.classList.add("card-text");

    const small = document.createElement("small");
    small.classList.add("text-muted");
    small.textContent = `Release: ${movie.release_date}`;

    cardText.appendChild(small);
    cardBody.append(cardTitle, cardText);
    cardLink.appendChild(cardLinkImage);
    moviesCard.append(cardLink, cardBody);
    document.getElementById("popular-movies").appendChild(moviesCard);
  });
};

//Adds popular shows to the DOM
const showPopularShows = (tvShows) => {
  //creating the card item for each show in the list of shows
  tvShows.forEach((tvShow) => {
    const tvCard = document.createElement("div");
    tvCard.classList.add("card");

    const cardLink = document.createElement("a");
    cardLink.href = `tv-details.html?id=${tvShow.id}`;

    const cardLinkImage = document.createElement("img");
    cardLinkImage.src = tvShow.poster_path
      ? `https://image.tmdb.org/t/p/w500${tvShow.poster_path}`
      : "/images/no-image.jpg";
    cardLinkImage.classList.add("card-img-top");
    cardLinkImage.alt = tvShow.original_title;

    const cardBody = document.createElement("div");
    cardBody.classList.add("card-body");

    const cardTitle = document.createElement("h5");
    cardTitle.classList.add("card-title");
    cardTitle.textContent = tvShow.name;

    const cardText = document.createElement("p");
    cardText.classList.add("card-text");

    const small = document.createElement("small");
    small.classList.add("text-muted");
    small.textContent = `First Aired: ${tvShow.first_air_date}`;

    cardText.appendChild(small);
    cardBody.append(cardTitle, cardText);
    cardLink.appendChild(cardLinkImage);
    tvCard.append(cardLink, cardBody);
    document.getElementById("popular-shows").appendChild(tvCard);
  });
};

//Adds movie details to the DOM
const showMovieDetails = (credits, movie) => {
  displayBackgroundImage("movie", movie.backdrop_path);
  //creating the elements to show on th DOM
  const detailsTop = document.querySelector(".details-top");
  const detailsBottom = document.querySelector(".details-bottom");

  const imgDiv = document.createElement("div");
  const img = document.createElement("img");
  img.src = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "/images/no-img.jpg";
  img.classList.add("card-img-top");
  img.alt = movie.title;
  imgDiv.appendChild(img);

  const bodyDiv = document.createElement("div");
  const movieTitle = document.createElement("h2");
  movieTitle.textContent = movie.title;
  const rating = document.createElement("h5");
  rating.textContent = `IMDB: ${movie.vote_average.toFixed(1)}`;
  rating.id = "rating";
  const releaseDate = document.createElement("h4");
  releaseDate.classList.add("text-muted");
  releaseDate.textContent = `Released ${movie.release_date}`;
  const summary = document.createElement("p");
  summary.textContent = movie.overview;
  const genres = document.createElement("h5");
  genres.textContent = "Genres";
  const genreList = document.createElement("ul");
  movie.genres.forEach((genre) => {
    //create li for each genre
    const genreItem = document.createElement("li");
    genreItem.textContent = genre.name;
    genreList.appendChild(genreItem); //and append to ul of genres
  });
  const creditsH4 = document.createElement("h4");
  creditsH4.textContent = "Starring ";
  creditsH4.style.paddingTop = "20px";
  const castName = document.createElement("div");
  castName.classList.add("list-group");
  const topCast = mostPopularCast(credits.cast);
  topCast.forEach((cast) => {
    castName.textContent += `${cast.name}, `;
  });
  const movieHomepage = document.createElement("a");
  movieHomepage.classList.add("btn");
  movieHomepage.textContent = "Visit Movie Homepage";
  movieHomepage.href = movie.homepage;
  movieHomepage.target = "_blank";

  bodyDiv.append(
    movieTitle,
    rating,
    releaseDate,
    summary,
    genres,
    genreList,
    creditsH4,
    castName,
    movieHomepage
  );

  detailsTop.append(imgDiv, bodyDiv);

  //Movie info
  const movieInfoH2 = document.createElement("h2");
  movieInfoH2.textContent = "Movie Info";
  const movieInfoList = document.createElement("ul");
  movieInfoList.innerHTML = `
  <li><span class="text-secondary">Budget:</span> $${formatNumber(
    movie.budget
  )}</li>
  <li><span class="text-secondary">Revenue:</span> $${formatNumber(
    movie.revenue
  )}</li>
  <li><span class="text-secondary">Runtime:</span> ${movie.runtime} mins</li>
  <li><span class="text-secondary">Status:</span> ${movie.status}</li>`;
  const productionH4 = document.createElement("h4");
  productionH4.textContent = "Production Companies";
  const productionCompanies = document.createElement("div");
  productionCompanies.classList.add("list-group");
  movie.production_companies.forEach((company) => {
    productionCompanies.textContent += `${company.name}, `;
  });

  detailsBottom.append(
    movieInfoH2,
    movieInfoList,
    productionH4,
    productionCompanies
  );
};

//Adds tv show details to the DOM
const showTvDetails = (credits, tvShow) => {
  displayBackgroundImage("tv", tvShow.backdrop_path);
  //creating the elements to show on th DOM
  const detailsTop = document.querySelector(".details-top");
  const detailsBottom = document.querySelector(".details-bottom");

  const imgDiv = document.createElement("div");
  const img = document.createElement("img");
  img.src = tvShow.poster_path
    ? `https://image.tmdb.org/t/p/w500${tvShow.poster_path}`
    : "/images/no-img.jpg";
  img.classList.add("card-img-top");
  img.alt = tvShow.name;
  imgDiv.appendChild(img);

  const bodyDiv = document.createElement("div");
  const tvShowTitle = document.createElement("h2");
  tvShowTitle.textContent = tvShow.name;
  const rating = document.createElement("h5");
  rating.textContent = `IMDB: ${tvShow.vote_average.toFixed(1)}`;
  rating.id = "rating";
  const releaseDate = document.createElement("h4");
  releaseDate.classList.add("text-muted");
  releaseDate.textContent = `First Aired ${tvShow.first_air_date}`;
  const summary = document.createElement("p");
  summary.textContent = tvShow.overview;
  const genres = document.createElement("h5");
  genres.textContent = "Genres";
  const genreList = document.createElement("ul");
  tvShow.genres.forEach((genre) => {
    //create li for each genre
    const genreItem = document.createElement("li");
    genreItem.textContent = genre.name;
    genreList.appendChild(genreItem); //and append to ul of genres
  });
  const creditsH4 = document.createElement("h4");
  creditsH4.textContent = "Starring ";
  creditsH4.style.paddingTop = "20px";
  const castName = document.createElement("div");
  castName.classList.add("list-group");
  const topCast = mostPopularCast(credits.cast);
  topCast.forEach((cast) => {
    castName.textContent += `${cast.name}, `;
  });
  const tvShowHomepage = document.createElement("a");
  tvShowHomepage.classList.add("btn");
  tvShowHomepage.textContent = "Visit Show Homepage";
  tvShowHomepage.href = tvShow.homepage;
  tvShowHomepage.target = "_blank";

  bodyDiv.append(
    tvShowTitle,
    rating,
    releaseDate,
    summary,
    genres,
    genreList,
    creditsH4,
    castName,
    tvShowHomepage
  );

  detailsTop.append(imgDiv, bodyDiv);

  //tvShow info
  const tvShowInfoH2 = document.createElement("h2");
  tvShowInfoH2.textContent = "Show Info";
  const tvShowInfoList = document.createElement("ul");
  tvShowInfoList.innerHTML = `
  <li><span class="text-secondary">Number of Episodes:</span> ${tvShow.number_of_episodes}</li>
  <li><span class="text-secondary">Number of Seasons:</span> ${tvShow.number_of_seasons}</li>
  <li><span class="text-secondary">Last Episode To Air:</span> ${tvShow.last_episode_to_air.name}</li>
  <li><span class="text-secondary">Status:</span> ${tvShow.status}</li>`;
  const productionH4 = document.createElement("h4");
  productionH4.textContent = "Production Companies";
  const productionCompanies = document.createElement("div");
  productionCompanies.classList.add("list-group");
  tvShow.production_companies.forEach((company) => {
    productionCompanies.textContent += `${company.name}, `;
  });

  detailsBottom.append(
    tvShowInfoH2,
    tvShowInfoList,
    productionH4,
    productionCompanies
  );
};

const showNowPlaying = (movies) => {
  movies.forEach((movie) => {
    const moviesCard = document.createElement("div");
    moviesCard.classList.add("swiper-slide");

    const cardLink = document.createElement("a");
    cardLink.href = `movie-details.html?id=${movie.id}`;

    const cardLinkImage = document.createElement("img");
    cardLinkImage.src = movie.poster_path
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : "./images/no-image.jpg";
    cardLinkImage.alt = movie.title;

    cardLink.appendChild(cardLinkImage);

    moviesCard.append(cardLink);
    document.querySelector(".swiper-wrapper").appendChild(moviesCard);
    initializeSwiper();
  });
};

const showSearchResults = (searchResults) => {
  //clear prev page results
  document.getElementById("search-results").innerHTML = "";
  document.getElementById("search-results-heading").innerHTML = "";
  if (searchResults.length === 0) {
    showAlert("No matches found", "error");
    return;
  }
  searchResults.forEach((result) => {
    const resultCard = document.createElement("div");
    resultCard.classList.add("card");

    const cardLink = document.createElement("a");
    cardLink.href = `${appState.search.type}-details.html?id=${result.id}`;

    const cardLinkImage = document.createElement("img");
    cardLinkImage.src = result.poster_path
      ? `https://image.tmdb.org/t/p/w500${result.poster_path}`
      : "/images/no-image.jpg";
    cardLinkImage.classList.add("card-img-top");
    cardLinkImage.alt =
      appState.search.type === "movie" ? result.title : result.name;

    const cardBody = document.createElement("div");
    cardBody.classList.add("card-body");

    const cardTitle = document.createElement("h5");
    cardTitle.classList.add("card-title");
    cardTitle.textContent =
      appState.search.type === "movie" ? result.title : result.name;

    const cardText = document.createElement("p");
    cardText.classList.add("card-text");

    const small = document.createElement("small");
    small.classList.add("text-muted");
    small.textContent =
      appState.search.type === "movie"
        ? `Released: ${result.release_date}`
        : `First Aired: ${result.first_air_date}`;

    cardText.appendChild(small);
    cardBody.append(cardTitle, cardText);
    cardLink.appendChild(cardLinkImage);
    resultCard.append(cardLink, cardBody);

    document.getElementById(
      "search-results-heading"
    ).innerHTML = `<h3>Showing ${appState.search.totalResults} results for "${appState.search.query}"</h3>`;
    document.getElementById("search-results").appendChild(resultCard);
  });
  showPagination();
};

// ------------------------------------utility functions---------------------------------------
const initializeSwiper = () => {
  const swiper = new Swiper(".swiper", {
    slidesPerView: 4,
    spaceBetween: 30,
    freeMode: true,
    loop: true,
    autoplay: {
      delay: 4000,
      disabledOnItersction: false,
    },
    breakpoints: {
      500: {
        slidesperView: 2,
      },
      700: {
        slidesperView: 3,
      },
      1200: {
        slidesperView: 4,
      },
    },
  });
};
//Highlights the active navbar link
const highlightActiveLink = () => {
  const navLinks = document.querySelectorAll(".nav-link");
  navLinks.forEach((link) => {
    if (link.getAttribute("href") === appState.currentPage) {
      link.classList.add("active");
    }
  });
};

//Shows the loading overlay
const showLoading = () => {
  document.activeElement.blur();
  document.querySelector(".loading").classList.remove("hidden");
};

//Hides the loading overlay
const hideLoading = () => {
  document.activeElement.blur();
  document.querySelector(".loading").classList.add("hidden");
};

//Adds comas to numbers
const formatNumber = (number) => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

//Displays baground image on details pages
const displayBackgroundImage = (type, path) => {
  const backgroundDiv = document.createElement("div");
  backgroundDiv.style.backgroundImage = `url(https://image.tmdb.org/t/p/original${path})`;
  backgroundDiv.style.backgroundSize = "cover";
  backgroundDiv.style.backgroundPosition = "center";
  backgroundDiv.style.backgroundRepeat = "no-repeat";
  backgroundDiv.style.height = "750px";
  backgroundDiv.style.width = "100vw";
  backgroundDiv.style.position = "absolute";
  backgroundDiv.style.top = "75px";
  backgroundDiv.style.left = "0";
  backgroundDiv.style.zIndex = "-1";
  backgroundDiv.style.opacity = "0.1";

  if (type === "movie") {
    document.getElementById("movie-details").appendChild(backgroundDiv);
  } else {
    document.getElementById("show-details").appendChild(backgroundDiv);
  }
};

//returns list of top 5 cast with the highest popularity rating
const mostPopularCast = (arrCast) => {
  arrCast.sort((a, b) => {
    return a.popularity - b.popularity;
  });
  return arrCast.reverse().slice(0, 5);
};

//Shows an alert message
const showAlert = (message, className) => {
  const alertDiv = document.createElement("div");
  alertDiv.classList.add("alert", className);
  alertDiv.textContent = message;
  document.getElementById("alert").appendChild(alertDiv);

  setTimeout(() => alertDiv.remove(), 2000);
};

const showPagination = () => {
  //feeling lazy walahi
  document.getElementById("pagination").innerHTML = `
  <div class="pagination">
    <button class="btn btn-primary" id="prev">Prev</button>
    <button class="btn btn-primary" id="next">Next</button>
    <div class="page-counter">Page ${appState.search.page} of ${appState.search.totalPages}</div>
  </div>`;
  //disables prev button if on the first page
  if (appState.search.page === 1) {
    document.getElementById("prev").disabled = true;
  }
  //disables next button if on the last page
  if (appState.search.page === appState.search.totalPages) {
    document.getElementById("next").disabled = true;
  }
  nextPage();
  prevPage();
};

//next search page
const nextPage = () => {
  document.getElementById("next").addEventListener("click", async () => {
    appState.search.page++;
    getSearchResults();
  });
};
//Previous search page
const prevPage = () => {
  document.getElementById("prev").addEventListener("click", async () => {
    appState.search.page--;
    getSearchResults();
  });
};

//Initialize app
function init() {
  // creating a router to know which functions to run on which page
  switch (appState.currentPage) {
    case "/":
    case "/index.html":
      getPopularMovies();
      getNowPlaying();
      break;
    case "/shows.html":
      getPopularShows();
      break;
    case "/movie-details.html":
      getMovieDetails();
      break;
    case "/tv-details.html":
      getTvDetails();
      break;
    case "/search.html":
      getSearchResults();
      break;
  }

  highlightActiveLink();
}

document.addEventListener("DOMContentLoaded", init);
