import React, { Component } from 'react'
import './Detail.css';
import request from 'superagent';
import { triMetStub } from './TriMetLocationStub.js';

import { URL } from '../Home/Home.js'
export default class Detail extends Component {

    state = {
        trimetLocation: triMetStub,
        loading: true
    }

    componentDidMount = async () => {
        await this.fetchTrimetLocation();
    }

    fetchTrimetLocation = async () => {
        const { token } = this.props;

        const response = await request
            .get(`${URL}/api/trimet/detail?locid=${this.props.match.params.id}`)
            .set('Authorization', token)
        await this.setState({
            trimetLocation: JSON.parse(JSON.parse(response.text).text),
            loading: false,
        })
    }

    // nice util!
    makeThreeDigitNumber = (routeNumber) => {
        //if 3 digits add no zeros, if 2 digits add leading zero, if 1 digit add 2 leading zeros.
        const oneZero = '0';
        const twoZeros = '00';
        const threeDigitNumber = routeNumber.toString();

        if (threeDigitNumber.length === 2) {
            return oneZero.concat(threeDigitNumber);
        } else if (threeDigitNumber.length === 1) {
            return twoZeros.concat(threeDigitNumber)
        }
        return threeDigitNumber;
    }

    render() {
        const threeDigitNumber = this.makeThreeDigitNumber(this.state.trimetLocation.resultSet.arrival[0].route);
        
        return (
            <div className='detailsPage'>
                <div className='subHeader'>
                    <h2 className='subheader-details'>Trimet Details</h2>
                </div>
                {
                    this.state.loading
                        ? 'Content Loading'
                        : <>
                            <section className='details-text'>
                                <div>
                                    <h2>Route Number: <span className='orange-highlight'>{this.state.trimetLocation.resultSet.arrival[0].route}</span> At Stop "<span className='orange-highlight'>{this.state.trimetLocation.resultSet.location[0].desc}</span>"</h2>
                                </div>
                                <div>
                                    <h3>Headed in direction: <span className='orange-highlight'>{this.state.trimetLocation.resultSet.location[0].dir}</span></h3>
                                </div>
                                <div>
                                    <h4>Estimated arrival time to station/stop: <span className='orange-highlight'>{new Date(this.state.trimetLocation.resultSet.arrival[0].estimated).toLocaleTimeString('en-US')}</span></h4>
                                </div>
                            </section>
                            {/* Need digit code to be 3 digit but pull from data */}
                            <img className='busmap' src={`https://trimet.org/schedules/img/${threeDigitNumber}.png`} alt='busmap'></img>
                        </>
                }
            </div>
        )
    }
}
