// Libraries
import React from 'react';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';

// Files
import { weatherAPI } from 'weather/App/util/weatherAPI';

export default class Details extends React.Component {
    componentDidMount() {
        Permissions.askAsync(Permissions.LOCATION)
            .then(({ status }) => {
                if (status !== 'granted') throw new Error('Permission to access location was denied');

                return Location.getCurrentPositionAsync();
            })
            .then(position => {
                console.log('position', position);
                this.getCurrentWeather({ coords: position.coords });
                this.getForecast({ coords: position.coords });
            })
            .catch(err => {
                console.log('error on locations ', err);
            });
    }

    getCurrentWeather = ({ zipcode, coords }) => {
        return weatherAPI('/weather', { zipcode, coords })
            .then(res => {
                console.log('current response ', res);
            })
            .catch(err => {
                console.log('current error ', err);
            });
    }

    getForecast = ({ zipcode, coords }) => {
        return weatherAPI('/forecast', { zipcode, coords })
            .then(res => {
                console.log('forecast response ', res);
            })
            .catch(err => {
                console.log('forecast error ', err);
            });
    }

    render() {
        return null;
    }
}