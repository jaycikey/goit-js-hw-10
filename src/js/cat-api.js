import axios from "axios";

const baseUrl = "https://api.thecatapi.com/v1/images/search?breed_ids=";

export function fetchCatByBreed(breedId, apiKey) {
  const url = `${baseUrl}${breedId}`;

  return axios
    .get(url, {
      headers: {
        "x-api-key": apiKey,
      },
    })
    .then((response) => {
      const catData = response.data[0];
      return {
        imageUrl: catData.url,
        breedName: catData.breeds[0].name,
        description: catData.breeds[0].description,
        temperament: catData.breeds[0].temperament,
      };
    })
    .catch((err) => {
      console.error("Error fetching cat data:", err);
      throw err;
    });
}
