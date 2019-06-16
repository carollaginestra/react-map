import noImage from "../images/no-image.png";
import fsButton from "../images/foursquare-button.png";

  // set up fallbacks in case data is incomplete
export const restaurantData = (marker, data) => {
  const restaurant = data.response.venue;

  const {
    canonicalUrl,
    bestPhoto,
    contact,
    location,
    categories,
    attributes,
  } = restaurant; // destructuring

  marker.url = canonicalUrl ? canonicalUrl : "https://foursquare.com/";
  marker.photo = bestPhoto
    ? `${bestPhoto.prefix}width100${bestPhoto.suffix}` // ES6 template literals
    : noImage;
  marker.phone =
    contact && contact.formattedPhone ? contact.formattedPhone : "";
  marker.address = location.address;
  marker.category = categories.length > 0 ? categories[0].name : "";
  marker.price =
    attributes.groups[0].summary && attributes.groups[0].type === "price"
      ? attributes.groups[0].summary
      : "";
  return marker;
};


// build infowindow content
export const infoRestaurant = marker => {
  marker.restaurantContent = `<div class="restaurant">
                      <img class="restaurant-photo" src=${marker.photo} alt="${marker.title}">
                      <div class="restaurant-description">
                        <h2 class="restaurant-title">${marker.title}</h2>
                        <p class="restaurant-data">${marker.category}</p>
                        <p class="restaurant-price">${marker.price}</p>
                        <p class="restaurant-contact">${marker.address}</p>
                        <a class="restaurant-phone" href="tel:${marker.phone}">${marker.phone}</a>
                      </div>
                    </div>
                    <a class="restaurant-link" href="${marker.url}" target="_blank">
                      <span>Foursaque</span>
                      <img class="fs-link" src="${fsButton}">
                    </a>`;
  return marker;
};

export const errorRestaurant = marker => {
  marker.restaurantContent = `<div class="venue-error"  role="alert">
        <p>Oops! There was an error loading <strong>"${marker.title}"</strong>.</p>
      </div>`;
  return marker;
};
