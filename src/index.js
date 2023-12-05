import axios from "axios";
import Notiflix from "notiflix";
import SlimSelect from 'slim-select';

// API key
const apiKey = "live_AUEqyR9Z4J8sYX4ztYRfaVO2gv4yvxtiq71WRP4nw2lFi8LhnAFTq5iNV82yDYrJ";

// Елементи DOM
const breedSelect = document.querySelector("#breed-select");
const loader = document.querySelector(".loader");
const error = document.querySelector(".error");
const catInfo = document.querySelector(".cat-info");
const catImage = document.querySelector(".cat-image");
const catName = document.querySelector(".cat-name");
const catDescription = document.querySelector(".cat-description");
const catTemperament = document.querySelector(".cat-temperament");

// Ініціалізація SlimSelect
const select = new SlimSelect({
  select: '#breed-select',
  placeholder: 'Choose a Breed'
});

// Функція для отримання порід і заповнення SlimSelect
function fetchBreeds() {
  loader.style.display = "block";
  error.textContent = "";
  catInfo.style.display = "none";
  catImage.src = "";

  axios.get("https://api.thecatapi.com/v1/breeds", {
    headers: {
      "x-api-key": apiKey,
    },
  })
  .then((response) => {
    loader.style.display = "none";
    const breedOptions = response.data.map((breed) => ({
      text: breed.name,
      value: breed.id
    }));
    select.setData(breedOptions); // Встановлюємо дані для SlimSelect
  })
  .catch((err) => {
    loader.style.display = "none";
    error.textContent = "Oops! Something went wrong!";
    Notiflix.Notify.failure("Oops! Something went wrong!");
  });
}

// Функція отримання інформації про кота за ідентифікатором породи
function fetchCatByBreed(breedId) {
  loader.style.display = "block";
  error.textContent = "";
  catInfo.style.display = "none";
  catImage.src = "";

  axios.get(`https://api.thecatapi.com/v1/images/search?breed_ids=${breedId}`, {
    headers: {
      "x-api-key": apiKey,
    },
  })
  .then((response) => {
    loader.style.display = "none";
    catInfo.style.display = "block";
    const catData = response.data[0];
    catImage.src = catData.url;
    catName.textContent = `Breed: ${catData.breeds[0].name}`;
    catDescription.textContent = `Description: ${catData.breeds[0].description}`;
    catTemperament.textContent = `Temperament: ${catData.breeds[0].temperament}`;
  })
  .catch((err) => {
    loader.style.display = "none";
    error.textContent = "Oops! Something went wrong!";
    Notiflix.Notify.failure("Oops! Something went wrong!");
  });
}

// Слухач подій для зміни вибору породи
breedSelect.addEventListener("change", (event) => {
  const selectedBreedId = event.target.value;
  if (selectedBreedId) {
    fetchCatByBreed(selectedBreedId);
  }
});

// Ініціалізуйте додаток, вибравши породи
fetchBreeds();
