import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import queryString from 'query-string';
import Login from './Login';
import Signup from './Signup';
import './Login.css';

class Auth extends Component {
    constructor() {
        super();
        this.state = {
            activeForm: "login",
        };
        this.activeFormToggler = this.activeFormToggler.bind(this);
    }

    componentWillMount() {
        const { next } = queryString.parse(this.props.location.search);
        if (next) {
            console.log(next);
            this.setState({ next });
        }
    }

    activeFormToggler() {
        if (this.state.activeForm === "login") {
            this.setState({ activeForm: "signup" });
        }
        else if (this.state.activeForm === "signup") {
            this.setState({ activeForm: "login" });
        }
    }

    render() {
        if (this.props.auth.isAuthenticated) {
            if (this.state.next) {
                return (<Redirect to={`${this.state.next}`} />);
            }
            else {
                return (<Redirect to="/" />);
            }
        }

        if (this.state.activeForm === "login") {
            return (<Login toggler={this.activeFormToggler} />);
        }
        else if (this.state.activeForm === "signup") {
            return (<Signup toggler={this.activeFormToggler} />);
        }
    }
}

const mapStateToProps = state => ({
    auth: state.auth
})

Auth.propTypes = {
    auth: PropTypes.object.isRequired
};

export default connect(mapStateToProps)(Auth);
