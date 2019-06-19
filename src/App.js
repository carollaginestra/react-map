import React, { Component } from "react";
import scriptLoader from "react-async-script-loader";
import { MAP_KEY } from "./utils/credentials";
import { mapStyles } from "./utils/mapStyles";
import MapList from "./components/MapList";
import Loader from './components/Loader'
import Logo from "./images/logo.svg";

class App extends Component {
  state = {
    listOpen: true,
    map: {},
    infowindow: {},
    bounds: {},
    mapReady: false,
    mapCenter: { lat: -23.7580603, lng: -53.2976969 },
    mapError: false,
    width: window.innerWidth
  };

  componentDidMount() {
    window.addEventListener("resize", this.updateWidth);
  }

  componentDidUpdate({ isScriptLoadSucceed, prevState }) {
    if (isScriptLoadSucceed && !this.state.mapReady) {
      // creating the map
      const map = new window.google.maps.Map(document.getElementById("map"), {
        zoom: 15,
        center: this.state.mapCenter,
        styles: mapStyles
      });

      // set up bounds and infowindow to use later
      const bounds = new window.google.maps.LatLngBounds();
      const infowindow = new window.google.maps.InfoWindow({ maxWidth: 300 });

      if (this.state !== prevState) {
        this.setState({
          map: map,
          infowindow: infowindow,
          bounds: bounds,
          mapReady: true
        });
      }

      // alert user if map request fails
    } else if (!isScriptLoadSucceed && !this.state.mapError) {
      this.setState({ mapError: true });
    }
  }

  toggleList = () => {
    const { width, listOpen, infowindow } = this.state;

    if (width < 768) {
      // close infowindow if listview is opening
      if (!listOpen) {
        infowindow.close();
      }
      this.setState({ listOpen: !listOpen });
    }
  };

  updateWidth = () => {
    const { map, bounds } = this.state;
    this.setState({ width: window.innerWidth });
    if (map && bounds) {
      map.fitBounds(bounds);
    }
  };

  render() {
    const {
      listOpen,
      map,
      infowindow,
      bounds,
      mapReady,
      mapCenter,
      mapError
    } = this.state;

    return (
      <div className="container" role="main">

        <section>

          <button id="navbar" className="toggle-nav" onClick={this.toggleList}>
            <span className="navbar-toggler-icon"></span>
          </button>

          <nav id="restaurants-list"
            className={listOpen ? "list open" : "list"}
            role="complementary"
            tabIndex={listOpen ? "0" : "-1"}>

            <div className="text-center">
              <img src={Logo} alt="Logo" className="logo" />
            </div>

            {
            mapReady ? (
              <MapList
                map={map}
                infowindow={infowindow}
                bounds={bounds}
                mapCenter={mapCenter}
                toggleList={this.toggleList}
                listOpen={listOpen}
              />
            ) : (
              <p>
                Connection error.
              </p>
            )}
          </nav>

        </section>

        <section id="map" className="map" role="application">
          {mapError ? (
            <div id="map-error" className="error" role="alert">
              Google Maps did not load. Please try again later...
            </div>
          ) : (
            <Loader />
          )}
        </section>
      </div>
    );
  }
}

export default scriptLoader([
  `https://maps.googleapis.com/maps/api/js?key=${MAP_KEY}`
])(App);