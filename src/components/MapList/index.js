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
    menuOpen: PropTypes.bool.isRequired
  };

  state = {
    search: "",
    allRestaurants: [],
    filteredRestaurant: null,
    apiReturned: false,
    apiError: false,
  };

  componentDidMount() {
    getLocation(this.props.mapCenter)
      .then(restaurant => {
        this.setState({
          allRestaurants: restaurant,
          filteredRestaurant: restaurant,
          apiReturned: true
        });
        if (restaurant) this.addMarkers(restaurant);
      })
      .catch(error => this.setState({ apiError: true }));
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

            if (self.props.menuOpen) {
              toggleList();
            }
          });
      });
    });

    map.fitBounds(bounds);
  }


  filter = event => {
    const { allRestaurants } = this.state;
    const { infowindow } = this.props;
    const search = event.target.value.toLowerCase();

    // show current value
    this.setState({ search: search });

    // close infoWindow when filter runs
    infowindow.close();

    // filter list markers by name of location
    const filteredRestaurant = allRestaurants.filter(restaurant => {
      const match = restaurant.name.toLowerCase().indexOf(search) > -1;
      restaurant.marker.setVisible(match);
      return match;
    });

    // sort array before updating state
    filteredRestaurant.sort(this.sortName);

    this.setState({ filteredRestaurant: filteredRestaurant });
  };

  showInfo = restaurant => {
    window.google.maps.event.trigger(restaurant.marker, "click");
  };

  render() {
    const { apiReturned, filteredRestaurant, search} = this.state;
    const { menuOpen } = this.props;

    // API fail
    if (this.state.apiError) {
      return <div className="center-item"> Foursquare API request failed. Please try again later.</div>;

      // API successfully
    } else if (apiReturned && filteredRestaurant) {
      return (
        <div className="list-view">

          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={this.filter}
            className="search"
            role="search"
            aria-label="text filter"
            tabIndex={menuOpen ? "0" : "-1"}
          />
          <hr/>

          {apiReturned && filteredRestaurant.length > 0 ? (
            <ul className="restaurants-list">
              {filteredRestaurant.map((restaurant, id) => (
                <Menu key={restaurant.id} restaurant={restaurant} menuOpen={menuOpen} />
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