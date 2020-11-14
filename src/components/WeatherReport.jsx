import React, { Component } from 'react';
import {imageArr, kelvinToCelcius} from '../constants'
import moment from 'moment'

export default class WeatherReport extends Component {
    state = {
        averageTemp:null,
        averagePressure:null,
        averageHumidity:null
    };
    componentDidUpdate (prevProps, prevState) {
        let {weatherUpdate, getWeatherUpdate} = this.props
        let {averagePressure, averageHumidity, averageTemp} = this.state;
        let pressureCount = 0; let humidityCount = 0;
        let degreeCount = 0;
        if (averagePressure == null && averageHumidity == null || weatherUpdate !== prevProps.weatherUpdate) {
            weatherUpdate && weatherUpdate.list && weatherUpdate.list.map((weather) => {
                humidityCount += weather.main.humidity
                pressureCount += weather.main.pressure
                degreeCount += kelvinToCelcius(weather.main.temp)
            })
            averagePressure = parseInt(pressureCount / 24);
            averageHumidity =  parseInt(humidityCount / 24);
            averageTemp =  parseInt(degreeCount / 24);
            this.setState({
                averagePressure: averagePressure,
                averageHumidity: averageHumidity,
                averageTemp: averageTemp
            })
            if (averageTemp)
                getWeatherUpdate(averageTemp + 6, averageTemp - 5);
        }
        
    }

    renderPerson = (item, index) => {
        let time = item.dt_txt.split(' ')[1].split(':')[0]
        let meridian = time >= 12 ? 'pm' : 'am';
        time  = time > 12 ? time - 12 : time;
        let celcius = kelvinToCelcius(item.main.temp);
        return(
            <div key={index} style={{display: 'flex', flexDirection: 'column', paddingRight: '5%', }}>
            <p style={{fontSize: 30}}>{parseInt(celcius)}&deg;</p>
            <p>{time} {meridian}</p>
        </div>
        );
       
    }


    render() {
        const { data, weatherUpdate} = this.props;
        const {averagePressure, averageHumidity, averageTemp} = this.state;
       
        let sunrise  = weatherUpdate && weatherUpdate.city && weatherUpdate.city.sunrise;
        let sunset  = weatherUpdate && weatherUpdate.city && weatherUpdate.city.sunset;

        sunrise = moment.unix(sunrise).format('h:mm:ss a');
        sunset = moment.unix(sunset).format('h:mm:ss a');
        let celcius = weatherUpdate  && averageTemp ? averageTemp : '23';
        
        if (weatherUpdate && weatherUpdate.cod === '200') {
        return (
            <div style={styles.mainDiv}>
        <div style={{
            display: 'flex', 
            flexDirection: 'row',
            width: '50%',
        }}>
        <h2 style={{fontWeight: 'bold', paddingTop: '2.4%', paddingRight: '2%'}}>{celcius}&deg; C</h2>
        <img src={imageArr[data.status]} 
        style={{
            height: 65, 
            width: 65,
        }}/>
        </div>
        { weatherUpdate && weatherUpdate.list ? (
        <div style={styles.scrollView}>
        {weatherUpdate.list.map((item, index) =>  this.renderPerson(item, index))}

        </div>) : null}

        <div style={styles.thirdSubview}> 
            <div style={styles.pressureView}>
              <p style={{fontWeight: 'bold', fontSize: 24}}>Pressure</p>
            <p style={{fontSize: 24}}>{averagePressure} hpa</p>
            </div>
            <div style={styles.humidityView}>
              <p style={{fontWeight: 'bold', fontSize: 24}}>Humidity</p>
            <p style={{fontSize: 24}}>{averageHumidity} %</p>
            </div>
        </div>
        
            <div style={{
                display: 'flex',
                flexDirection: 'row',
                marginTop: '2%'
            }}>
                <div style={styles.sunriseView}>
              <p style={{fontWeight: 'bold', fontSize: 24}}>Sunrise</p>
            <p style={{fontSize: 24}}>{sunrise}</p>
            </div> 
            
            <div style={styles.sunsetView}>
              <p style={{fontWeight: 'bold', fontSize: 24}}>Sunset</p>
            <p style={{fontSize: 24}}>{sunset}</p>
            </div>
           
            </div>

    </div>
        );
        } else {
            return (
                <div style={{justifyContent: 'center', marginTop: '15%'}}>
                    <h1>Searched place not found</h1>
                </div>
            );
        }
    }
}

const styles = {
    mainDiv: {
        marginTop: '4%', 
        //border: "1px solid black", 
        display: "flex",
        width: '100%',
        padding: '3%',
        boxShadow: "1px 4px 10px 1px #9E9E9E",
        flexDirection: 'column',
        borderRadius: 10,
    },
    scrollView: {
        display: 'flex', 
        flexDirection: 'row', 
        justifyContent: 'space-between',
        overflowX : 'scroll', 
    },
    thirdSubview: {
        display: 'flex', 
        flexDirection: 'row',
        marginTop: '3%',
        justifyContent: 'space-between',
    },
    pressureView: {
        display: 'flex', 
        flexDirection: 'column',
        marginRight: '2%',
        backgroundColor: '#f2f2f2',
        alignItems: 'center',
        width: '50%',
        borderRadius: 4,
    },
    humidityView: {
        display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center',
            backgroundColor: '#f2f2f2',
            marginLeft: '2%',
            borderRadius: 4,
            width: '50%',
    },
    sunriseView: {
        display: 'flex', 
            flexDirection: 'column',
            marginRight: '2%',
            alignItems: 'flex-start',
            width: '50%',
            borderRadius: 4,
    },
    sunsetView: {
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'flex-end',
        marginLeft: '2%',
        borderRadius: 4,
        width: '50%',
    }
}