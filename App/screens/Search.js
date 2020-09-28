// Libraries
import React from 'react';
import { FlatList, Text, View } from 'react-native';

// Files
import { SearchBar } from 'weather/App/components/SearchBar';
import { SearchItem } from 'weather/App/components/List';
import { getRecentSearch } from 'weather/App/util/recentSearch';

export default class Search extends React.Component {
    state = {
        query: '',
        recentSearch: []
    };

    componentDidMount() {
        getRecentSearch().then(recentSearch => {
            this.setState({ recentSearch });
        })
    }

    render() {
        return (
            <FlatList
                data={this.state.recentSearch}
                renderItem={({item}) => (
                    <SearchItem
                        name={item.name}
                        onPress={() => this.props.navigation.navigate('Details', {
                            lat: item.lat,
                            lon: item.lon
                        })}
                    />
                )}
                keyExtractor={item => item.id.toString()}
                ListHeaderComponent={(
                    <View>
                        <SearchBar
                            onSearch={() => {
                                this.props.navigation.navigate('Details', {
                                    zipcode: this.state.query,
                                })
                            }}
                            searchButtonEnabled={this.state.query.length >= 5}
                            placeholder="Zipcode"
                            onChangeText={query => this.setState({ query })}
                        />
                        <Text style={{
                            marginHorizontal: 10,
                            fontSize: 16,
                            color: '#aaa',
                            marginTop: 10,
                            marginBottom: 5
                        }}>
                            Recents
                        </Text>
                    </View>
                )}
            />
        )
    }
}