// Libraries
import React from 'react';
import { FlatList, Text, View } from 'react-native';

// Files
import { SearchBar } from 'weather/App/components/SearchBar';
import { SearchItem } from 'weather/App/components/List';

export default class Search extends React.Component {
    state = {
        query: '',

    };

    render() {
        return (
            <FlatList
                data={[{ id: 1, name: 'Morrisville' }, { id: 2, name: 'Raleigh' }]}
                renderItem={({item}) => (
                    <SearchItem
                        name={item.name}
                        onPress={() => this.props.navigation.navigate('Details')}
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