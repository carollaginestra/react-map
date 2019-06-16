import React, { Component } from "react";
import PropTypes from "prop-types";
import { getLocation, getDetails } from "../../utils/foursquareAPI";
import {
  restaurantData,
  infoRestaurant,
  errorRestaurant
} from "../../utils/helpers";
import Menu from "../Menu";
import Loader from '../Loader'
import markerIcon from "../../images/marker.png";

class MapList extends Component {
  static propTypes = {
    map: PropTypes.object.isRequired,
    infowindow: PropTypes.object.isRequired,
    bounds: PropTypes.object.isRequired,
    mapCenter: PropTypes.object.isRequired,
    toggleList: PropTypes.func.isRequired,
    listOpen: PropTypes.bool.isRequired
  };

  state = {
    query: "",
    allRestaurant: [],
    filteredRestaurant: null,
    apiReturned: false
  };

  componentDidMount() {
    getLocation(this.props.mapCenter)
      .then(restaurant => {
        this.setState({
          allRestaurant: restaurant,
          filteredRestaurant: restaurant,
          apiReturned: true
        });
        if (restaurant) this.addMarkers(restaurant);
      })
      .catch(error => this.setState({ apiReturned: false }));
  }

  addMarkers(restaurant) {
    const { map, bounds, infowindow, toggleList } = this.props;
    const self = this;

    restaurant.forEach(location => {
      const position = {
        lat: location.location.lat,
        lng: location.location.lng
      };

      location.marker = new window.google.maps.Marker({
        position,
        map,
        title: location.name,
        id: location.id,
        icon: markerIcon
      });

      bounds.extend(position);

      location.marker.addListener("click", function() {
        const marker = this;

        // bounce marker
        marker.setAnimation(window.google.maps.Animation.BOUNCE);
        setTimeout(() => marker.setAnimation(null), 2100);

        // get venue details and display in infowindow
        getDetails(marker.id)
          .then(data => {
            restaurantData(marker, data);
            infoRestaurant(marker);
          })
          .catch(() => errorRestaurant(marker))
          .finally(() => {
            infowindow.setContent(marker.restaurantContent);
            infowindow.open(map, marker);

            if (self.props.listOpen) {
              toggleList();
            }
          });
      });
    });

    map.fitBounds(bounds);
  }

  showInfo = restaurant => {
    window.google.maps.event.trigger(restaurant.marker, "click");
  };

  render() {
    const { apiReturned, filteredRestaurant} = this.state;
    const { listOpen } = this.props;

    // API fail
    if (apiReturned && !filteredRestaurant) {
      return <div> Foursquare API request failed. Please try again later.</div>;

      // API successfully
    } else if (apiReturned && filteredRestaurant) {
      return (
        <div className="list-view">

          {apiReturned && filteredRestaurant.length > 0 ? (
            <ul className="restaurants-list">
              {filteredRestaurant.map((restaurant, id) => (
                <Menu key={restaurant.id} restaurant={restaurant} listOpen={listOpen} />
              ))}
            </ul>
          ) : (
            <p id="filter-error" className="empty-input">
              0 results
            </p>
          )}
        </div>
      );
    } else {
      return (
        <Loader />
      );
    }
  }
}

export default MapList;