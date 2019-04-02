import React, { Component } from 'react';
import './App.css';
import {Store} from './store';
import {Provider} from 'react-redux';

import AdminUpload from './components/upload';

class App extends Component {
  render() {
    return (
		<Provider store={Store}>
		<AdminUpload  filetype='image' />
		</Provider>
    );
  }
}

export default App;
