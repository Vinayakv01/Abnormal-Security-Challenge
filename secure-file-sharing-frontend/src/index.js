import React from 'react';
import ReactDOM from 'react-dom/client'; // Import the correct ReactDOM version
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store'; // Import your Redux store
import App from './App';
import './index.css';

// Create a root element to render the app
ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}> {/* Pass the store as a prop */}
    <Router>
      <App />
    </Router>
  </Provider>
);
