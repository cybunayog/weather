// Libraries
import React from 'react';
import { ActivityIndicator, ScrollView, SafeAreaView, View } from 'react-native';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import { format } from 'date-fns';

// Files
import { weatherAPI } from 'weather/App/util/weatherAPI';
import { Container } from 'weather/App/components/Container';
import { WeatherIcon } from 'weather/App/components/WeatherIcon';
import { BasicRow } from 'weather/App/components/List';
import { H1, H2, P } from 'weather/App/components/Text';

const groupForecastByDay = list => {
    const data = {};

    list.forEach(item => {
        const [day] = item.dt_txt.split(" ");
        if (data[day]) {
            if (data[day].temp_max < item.main.temp_max) {
                data[day].temp_max = item.main.temp_max;
            }
            if (data[day].temp_min > item.main.temp_min) {
                data[day].temp_min = item.main.temp_min;
            }
        } else {
            data[day] = {
                temp_min: item.main.temp_min,
                temp_max: item.main.temp_max,
            };
        }
    });

    const formattedList = Object.keys(data).map(key => {
        return {
            day: key,
            ...data[key]
        }
    });

    return formattedList;
}
export default class Details extends React.Component {
    state = {
        currentWeather: {},
        loadingCurrentWeather: true,
        forecast: [],
        loadingForecast: true
    };

    componentDidMount() {
        Permissions.askAsync(Permissions.LOCATION)
            .then(({ status }) => {
                if (status !== 'granted') throw new Error('Permission to access location was denied');

                return Location.getCurrentPositionAsync();
            })
            .then(position => {
                // console.log('position', position);
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
                // console.log('current response ', res);
                this.props.navigation.setParams({ title: res.name });
                this.setState({
                    currentWeather: res,
                    loadingCurrentWeather: false
                });
            })
            .catch(err => {
                console.log('current error ', err);
            });
    }

    getForecast = ({ zipcode, coords }) => {
        return weatherAPI('/forecast', { zipcode, coords })
            .then(res => {
                // console.log('forecast response ', res);
                this.setState({
                    loadingForecast: false,
                    forecast: groupForecastByDay(res.list)
                })
            })
            .catch(err => {
                console.log('forecast error ', err);
            });
    }

    render() {
        if (this.state.loadingCurrentWeather || this.state.loadingForecast) {
            return (
                <Container>
                    <ActivityIndicator color="#fff" size="large" />
                </Container>
            )
        }

        const { weather, main } = this.state.currentWeather;

        return (
            <Container>
                <ScrollView>
                    <SafeAreaView>
                        <WeatherIcon icon={weather[0].icon} />
                        <H1>{`${Math.round(main.temp)}°`}</H1>
                        <BasicRow>
                            <H2>{`Humidity: ${Math.round(main.humidity)}%`}</H2>
                        </BasicRow>
                        <BasicRow>
                            <H2>{`Low: ${Math.round(main.temp_min)}°`}</H2>
                            <H2>{`High: ${Math.round(main.temp_max)}°`}</H2>
                        </BasicRow>
                        <View style={{ paddingHorizontal: 10, marginTop: 20 }}>
                            {this.state.forecast.map(day => {
                                return (
                                    <BasicRow key={day.day} style={{ justifyContent: 'space-between'}}>
                                        <P>{format(new Date(day.day), "EEEE, MMM d")}</P>
                                        <View style={{ flexDirection: "row"}}>
                                            <P style={{ fontWeight: '700', marginRight: 10 }}>
                                                {Math.round(day.temp_max)}°
                                            </P>
                                            <P>
                                                {Math.round(day.temp_min)}°
                                            </P>
                                        </View>
                                    </BasicRow>
                                )
                            })}
                        </View>
                    </SafeAreaView>
                </ScrollView>
            </Container>
        );
    }
}