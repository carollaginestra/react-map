import { CLIENT_ID, CLIENT_SECRET } from "./credentials";

// url and params
const url = "https://api.foursquare.com/v2/venues/";
const v = "20181215";
const radius = "900";
const category =  {
  food: '4d4b7105d754a06374d81259',
};

const categoryId = Object.keys(category).map(cat => category[cat]);

export const getLocation = mapCenter => {
  const requestURL = `${url}search?ll=${mapCenter.lat},${
    mapCenter.lng
  }&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&v=${v}&categoryId=${categoryId}&radius=${radius}&limit=30`;
  return fetch(requestURL)
    .then(response => {
      if (!response.ok) {
        throw response;
      } else return response.json();
    })
    .then(data => {
      const restaurant = data.response.venues;
      const theBest = restaurant.filter(
        restaurant =>
          restaurant.location.address &&
          restaurant.location.city &&
          restaurant.location.city === "Umuarama"
      );

      return theBest;
    });
};

export const getDetails = id => {

  const ID = id;

  const requestURL = `${url}${ID}?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&v=${v}`;
  return fetch(requestURL).then(response => {
    if (!response.ok) {
      throw response;
    } else return response.json();
  });
};