import React, {Component} from 'react';
import {TouchableOpacity} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Setting from '../common/setting';

export default class BaseItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isFavorite: this.props.item.isFavorite,
        };
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        const isFavorite = nextProps.item.isFavorite;
        if (isFavorite !== prevState.isFavorite) {
            return {
                isFavorite: isFavorite,
            };
        } else {
            return null;
        }
    }

    setFavoriteState(isFavorite) {
        this.props.item.isFavorite = isFavorite;
        this.setState({
            isFavorite: isFavorite,
        });
    }

    onFavorite() {
        this.setFavoriteState(!this.state.isFavorite);
        this.props.onFavorite(this.props.item.item, !this.state.isFavorite);
    }

    onItemClick() {
        this.props.onSelect((isFavorite) => {
            this.setFavoriteState(isFavorite);
        });
    }

    renderFavoriteButton() {
        return (
            <TouchableOpacity
                onPress={() => this.onFavorite()}
                style={{padding: 6}}
                underlayColor={'transparent'}>
                <FontAwesome
                    name={this.state.isFavorite ? 'star' : 'star-o'}
                    size={26}
                    style={{color: Setting.THEME_COLOR}}
                />
            </TouchableOpacity>
        );
    }
}
