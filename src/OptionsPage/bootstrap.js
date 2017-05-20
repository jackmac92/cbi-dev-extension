import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Store } from 'react-chrome-redux';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import muiTheme from '../cbiMuiTheme';
import Options from './index';
import '../App/app.css';
import injectTapEventPlugin from 'react-tap-event-plugin';

const store = new Store({
  portName: 'CBINSIGHTS'
});

injectTapEventPlugin();

const App = () => (
  <div>
    <AppBar
      title="CB Insights Extension Preferences"
      iconStyleLeft={{ display: 'none' }}
    />
    <Options />
  </div>
);

setTimeout(() => {
  render(
    <MuiThemeProvider muiTheme={muiTheme}>
      <Provider store={store}>
        <App />
      </Provider>
    </MuiThemeProvider>,
    document.getElementById('root'),
    () => console.log('Options Page Loaded')
  );
}, 1000);
