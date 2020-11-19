import React, {Component} from 'react';
import {TouchableOpacity} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Setting from '../common/setting';

export default class BaseItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isFavorite: this.props.isFavorite,
        };
    }

    renderFavoriteButton() {
        return (
            <TouchableOpacity
                style={{padding: 6}}
                underlayColor={'transparent'}>
                <FontAwesome
                    name={'star-o'}
                    size={26}
                    style={{color: Setting.THEME_COLOR}}
                />
            </TouchableOpacity>
        );
    }
}
