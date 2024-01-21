const appState = {
  currentPage: window.location.pathname,
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

//Fetches popular movies using the fetchData function
const getPopularMovies = async () => {
  const endpoint = "/movie/popular?language=en-US&page=1";
  const data = await fetchData(endpoint);
  showPopularMovies(data.results);
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
    cardLinkImage.alt = movie.original_title;

    const cardBody = document.createElement("div");
    cardBody.classList.add("card-body");

    const cardTitle = document.createElement("h5");
    cardTitle.classList.add("card-title");
    cardTitle.textContent = movie.original_title;

    const cardText = document.createElement("p");
    cardText.classList.add("card-text");

    const small = document.createElement("small");
    small.classList.add("text-muted");
    small.textContent = `Released: ${movie.release_date}`;

    cardText.appendChild(small);
    cardBody.appendChild(cardText);
    cardBody.appendChild(cardTitle);
    cardLink.appendChild(cardLinkImage);
    moviesCard.appendChild(cardLink);
    moviesCard.appendChild(cardBody);
    document.getElementById("popular-movies").appendChild(moviesCard);
  });
};

//Fetches popular shows using the fetchData function
const getPopularShows = async () => {
  const endpoint = "/tv/popular?language=en-US&page=1";
  const data = await fetchData(endpoint);
  showPopularShows(data.results);
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
    cardBody.appendChild(cardText);
    cardBody.appendChild(cardTitle);
    cardLink.appendChild(cardLinkImage);
    tvCard.appendChild(cardLink);
    tvCard.appendChild(cardBody);
    document.getElementById("popular-shows").appendChild(tvCard);
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

//Initialize app
function init() {
  // creating a router to know which functions to run on which page
  switch (appState.currentPage) {
    case "/":
    case "/index.html":
      getPopularMovies();
      break;
    case "/shows.html":
      getPopularShows();
      break;
    case "/movie-details.html":
      console.log("movie details page");
      break;
    case "/search.html":
      console.log("search page");
      break;
    case "/tv-details.html":
      console.log("tv details page");
      break;
  }

  highlightActiveLink();
}

document.addEventListener("DOMContentLoaded", init);
