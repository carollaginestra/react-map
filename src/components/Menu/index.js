import React, { Component } from "react";
import PropTypes from "prop-types";

class Menu extends Component {
    static propTypes = {
        restaurant: PropTypes.object.isRequired,
        listOpen: PropTypes.bool.isRequired
    };

    showInfo = () => {
        // force marker click
        window.google.maps.event.trigger(this.props.restaurant.marker, "click");
    };

    render() {
        const { restaurant, listOpen } = this.props;

        return (
        <li className="restaurant">
            <div
            onClick={this.showInfo}
            onKeyPress={this.showInfo}
            role="button"
            tabIndex={listOpen ? "0" : "-1"}
            className="restaurant-item"
            >
            {restaurant.name}
            </div>
        </li>
        );
    }
}

export default Menu;