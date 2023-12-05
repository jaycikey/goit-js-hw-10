import axios from "axios";
import Notiflix from "notiflix";
import SlimSelect from 'slim-select';
import "slim-select/dist/slimselect.css";
import { fetchCatByBreed } from "./cat-api";

// API key і URL
const apiKey = "live_AUEqyR9Z4J8sYX4ztYRfaVO2gv4yvxtiq71WRP4nw2lFi8LhnAFTq5iNV82yDYrJ";
const breedsUrl = "https://api.thecatapi.com/v1/breeds";

// Елементи DOM
const domElements = {
  breedSelect: document.querySelector("#breed-select"),
  breedSelectdiv: document.querySelector(".select-container"),
  loader: document.querySelector(".loader"),
  error: document.querySelector(".error"),
  catInfo: document.querySelector(".cat-info"),
  catImage: document.querySelector(".cat-image"),
  catName: document.querySelector(".cat-name"),
  catDescription: document.querySelector(".cat-description"),
  catTemperament: document.querySelector(".cat-temperament"),
};

// Ініціалізація SlimSelect
const select = new SlimSelect({
  select: '#breed-select',
  placeholder: 'Choose a Breed'
});

// Змінна для відстеження першого вибору
let isFirstSelection = false;

function toggleLoader(show) {
  domElements.loader.style.display = show ? "block" : "none";
}

async function fetchBreeds() {
  try {
    toggleLoader(true);
    clearError();
    hideCatInfo();

    const response = await axios.get(breedsUrl, {
      headers: { "x-api-key": apiKey },
    });

    domElements.breedSelectdiv.style.display = "block";
    const breedOptions = response.data.map(breed => ({
      text: breed.name,
      value: breed.id
    }));
    select.setData(breedOptions);
  } catch (err) {
    displayError("Oops! Something went wrong!");
  } finally {
    toggleLoader(false);
  }
}

function hideCatInfo() {
  domElements.catInfo.style.display = "none";
  domElements.catImage.src = "";
}

function displayError(message) {
  domElements.error.textContent = message;
  Notiflix.Notify.failure(message);
}

function clearError() {
  domElements.error.textContent = "";
}

async function handleBreedSelection(event) {
  if (!isFirstSelection) {
    isFirstSelection = true;
    return;
  }

  const selectedBreedId = event.target.value;
  if (!selectedBreedId) return;

  try {
    toggleLoader(true);
    hideCatInfo();
    
    const catData = await fetchCatByBreed(selectedBreedId, apiKey);
    displayCatInfo(catData);
  } catch (err) {
    displayError("Oops! Something went wrong!");
  } finally {
    toggleLoader(false);
  }
}

function displayCatInfo(catData) {
  domElements.catInfo.style.display = "block";
  domElements.catImage.src = catData.imageUrl;
  domElements.catName.textContent = `Breed: ${catData.breedName}`;
  domElements.catDescription.textContent = `Description: ${catData.description}`;
  domElements.catTemperament.textContent = `Temperament: ${catData.temperament}`;
}

domElements.breedSelect.addEventListener("change", handleBreedSelection);

fetchBreeds();
