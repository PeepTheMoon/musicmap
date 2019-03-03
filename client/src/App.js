import React, { Component } from 'react';
import { Provider } from 'react-redux';
import store from './store';
import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute';
import NotFound from './components/NotFound';
import CoreGenre from './components/CoreGenre';
import Logout from './components/Logout';
import Auth from './components/Auth';
import Profile from './components/Profile';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {

    }
  }

  render() {
    return (

      <Provider store={store}>
       <>
        <Router>
          <Switch>
            <ProtectedRoute exact path='/' component={CoreGenre} />
            <Route exact path='/auth' component={Auth} />
            <Route exact path='/auth/**' component={Auth} />
            <Route exact path='/logout' component={Logout} />
            <Route path='/callback' component={CoreGenre} />
            <Route path='/spotify' component={CoreGenre} />
            <ProtectedRoute exact path='/u/profile' component={Profile} />
            <Route path='*' component={NotFound} />
          </Switch>
        </Router>

      </>
      </Provider>

    );
  }
}

export default App;
