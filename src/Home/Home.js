import React, { Component } from 'react'
import request from 'superagent';
import './Home.css'

const URL = 'https://desolate-bayou-65072.herokuapp.com'
export default class Home extends Component {

    state = {
        signUpEmail: '',
        signUpPassword: '',
        loginEmail: '',
        loginPassword: '',
        loading: false,
    }

    handleSignupSubmit = async (e) => {
        e.preventDefault();

        this.setState({ loading: true })
        const user = await request
            .post(`${URL}/auth/signup`)
            .send({
                email: this.state.signUpEmail,
                password: this.state.signUpPassword
            });

        localStorage.setItem('USERNAME', user.email);

        this.props.handleTokenChange(user.body.token);
        this.props.handleUsernameChange(user.body.email);

        this.setState({ loading: false })

        this.props.history.push('/map')
    }

    handleLoginSubmit = async (e) => {
        e.preventDefault();

        this.setState({ loading: true })
        try {
            const user = await request
                .post(`${URL}/auth/signin`)
                .send({
                    email: this.state.loginEmail,
                    password: this.state.loginPassword
                });

            this.setState({ loading: false })
            localStorage.setItem('USERNAME', user.email);

            this.props.handleTokenChange(user.body.token);
            this.props.handleUsernameChange(user.body.email);

            this.props.history.push('/map')
        }

        catch (e) {
            alert("Sorry, it looks like you've entered an invalid username/password. Please try again, or if this is your first time use the Sign-up instead.")
            this.setState({ loading: false })
        }
    }


    render() {
        return (
            <>
                <section className="home">
                    <div className="home-image">
                        <img className="map-example" src="map.png" alt="map-example" />
                    </div>

                    <div className="username-password">
                        <div>
                            <h3>Log In</h3>
                            <form className="login-form" onSubmit={this.handleLoginSubmit}>
                                <label className="login-user">
                                    Username: <input onChange={(e) => this.setState({ loginEmail: e.target.value })} value={this.state.loginEmail} type="email" />
                                </label>
                                <label className="login-pass">
                                    Password: <input onChange={(e) => this.setState({ loginPassword: e.target.value })} value={this.state.loginPassword} type="password" />
                                </label>
                                {
                                    this.state.loading
                                        ? 'Loadddiiinnnnnggggggg'
                                        : <button>Log in!</button>
                                }
                            </form>
                        </div>
                        <div>
                            <h3>Sign Up</h3>
                            <form className="signup-form" onSubmit={this.handleSignupSubmit}>
                                <label className="signup-user">
                                    Username: <input onChange={(e) => this.setState({ signUpEmail: e.target.value })} value={this.state.signUpEmail} type="email" />
                                </label>
                                <label className="signup-pass">
                                    Password: <input onChange={(e) => this.setState({ signUpPassword: e.target.value })} value={this.state.signUpPassword} type="password" />
                                </label>
                                {
                                    this.state.loading
                                        ? 'Loadddiiinnnnnggggggg'
                                        : <button>Sign Up!</button>
                                }
                            </form>
                        </div>
                    </div>

                </section>
            </>
        )
    }
}
