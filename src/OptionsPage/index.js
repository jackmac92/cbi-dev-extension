import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { APPLY_PREFERENCES } from '../constants';
import PrefForm from './preferencesForm';
import styles from '../App/styles.css';

@connect(
  ({ preferences, collections }) => ({ preferences, collections: collections.collections }),
  dispatch => ({
    setOptions(prefs) {
      dispatch({ type: APPLY_PREFERENCES, prefs });
    }
  })
)
export default class Options extends Component {
  static propTypes = {
    setOptions: PropTypes.func,
    preferences: PropTypes.object,
    collections: PropTypes.array
  }

  render() {
    const { preferences, collections, setOptions } = this.props;
    const panelStyle = {
      padding: '3.3em',
      minWidth: '350px'
    };
    return (
      <div className={styles.contentWrapper} style={panelStyle}>
        <PrefForm
          collections={collections}
          initialValues={preferences}
          savePreferences={setOptions}
        />
      </div>
    );
  }
}
