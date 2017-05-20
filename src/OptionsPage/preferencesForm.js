import React, { Component, PropTypes } from 'react';
import { Field, reduxForm } from 'redux-form';
import { RadioButton } from 'material-ui/RadioButton';
import { RadioButtonGroup, SelectField } from 'redux-form-material-ui';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import Divider from 'material-ui/Divider';
import Subheader from 'material-ui/Subheader';
import Snackbar from 'material-ui/Snackbar';
import styles from './styles.css';

@reduxForm({ form: 'preferences' })
export default class PrefForm extends Component {
  static propTypes = {
    handleSubmit: PropTypes.func,
    savePreferences: PropTypes.func
  };
  constructor(props) {
    super(props);
    this.state = { open: false };
  }
  handleRequestClose = close => {
    this.setState({ open: close });
  };

  render() {
    const { handleSubmit, savePreferences, collections } = this.props;
    const submitAction = handleSubmit(savePreferences);
    const doSave = (...args) => {
      submitAction(...args);
      this.setState({ open: true });
      setTimeout(() => {
        this.setState({ open: false });
      }, 6000);
    };
    return (
      <form onSubmit={doSave}>
        <Subheader>Quick Goto Collections from Chrome Search Bar</Subheader>
        <Field
          className={styles.prefField}
          name="collectionsInOmnibox"
          component={RadioButtonGroup}
        >
          <RadioButton
            value={1}
            label="Yes, include collections in suggestions"
          />
          <RadioButton value={0} label="No" />
        </Field>
        <Divider />
        <Subheader>Default collection to add to</Subheader>
        <Field name="defaultCollection" component={SelectField}>
          {collections.map(({ name, id }) => (
            <MenuItem key={`dfltCltn${id}`} primaryText={name} value={id} />
          ))}
        </Field>
        <Divider />
        <Subheader>
          Identify and link to companies discussed in articles
        </Subheader>
        <Field
          className={styles.prefField}
          name="linkEntitiesOnPage"
          component={RadioButtonGroup}
        >
          <RadioButton value={1} label="Yes" />
          <RadioButton value={0} label="No" />
        </Field>
        <Divider />
        <Subheader>Extension Icon Function</Subheader>
        <Field
          className={styles.prefField}
          name="extensionIconFunction"
          component={RadioButtonGroup}
        >
          <RadioButton value="lookup" label="Quick Profile Lookup" />
          <RadioButton
            value="addToCollections"
            label="Add Current Page To Collection"
          />
        </Field>
        <Divider />
        <RaisedButton className={styles.saveBtn} type="submit" label="Save" />
        <Snackbar
          open={this.state.open}
          message="Preferences Saved"
          autoHideDuration={4000}
          onRequestClose={this.handleRequestClose}
        />
      </form>
    );
  }
}
