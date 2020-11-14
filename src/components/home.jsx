import React, { Component } from "react";
import "../App.css";
import { FaSearch } from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";
import SecondComponent from "./SecondComponent";
import WeatherReport from "./WeatherReport";
import { confirmAlert } from "react-confirm-alert";
import { API_KEY, GEO_API_KEY } from "../constants";
import "react-confirm-alert/src/react-confirm-alert.css";

class Home extends Component {
  state = {
    weekArr: [
      { id: 1, day: "Sun", maxTemp: 28, minTemp: 19, status: "Sunny" },
      { id: 2, day: "Mon", maxTemp: 23, minTemp: 14, status: "Cloudy" },
      { id: 3, day: "Tue", maxTemp: 27, minTemp: 19, status: "Sunny" },
      { id: 4, day: "Wed", maxTemp: 30, minTemp: 26, status: "Sunny" },
      { id: 5, day: "Thu", maxTemp: 22, minTemp: 11, status: "Sunny" },
      { id: 6, day: "Fri", maxTemp: 27, minTemp: 17, status: "Rainfall" },
      { id: 7, day: "Sat", maxTemp: 21, minTemp: 12, status: "Sunny" }
    ],
    geoLocCity: '',
    weatherUpdate: null,
  };

  getUserLocation = () => {
    fetch(`https://geolocation-db.com/json/${GEO_API_KEY}`)
      .then(response => response.json())
      .then(responseData => {
        this.setState({
          geoLocCity: responseData.city
        });
      });
  };
  

  getWeatherUpdate = (maxTemp, minTemp) => {
    let {weekArr} = this.state;
    let activeIndex = new Date().getDay();
    weekArr[activeIndex].maxTemp = maxTemp;
    weekArr[activeIndex].minTemp = minTemp;
    this.setState({
        weekArr: weekArr
    })
  };

  componentDidMount() {
    confirmAlert({
      title: "Weather App wants to know your location",
      message: "",
      buttons: [
        {
          label: "Yes",
          onClick: this.getUserLocation
        },
        {
          label: "No"
        }
      ]
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.geoLocCity !== this.state.geoLocCity) {
      let city = this.state.geoLocCity;
      //let city = 'Chennai';
      fetch(
        `http://pro.openweathermap.org/data/2.5/forecast/hourly?q=${city}&cnt=24&appid=${API_KEY}`
      )
        .then(response => response.json())
        .then(responseData => {
          this.setState({
            weatherUpdate: responseData
          });
        });
    }
  }

  render() {
    let activeIndex = new Date().getDay();
    return (
      <div style={styles.mainStyle}>
        <div style={styles.boxStyle}>
          <MdLocationOn size="2em" />
          <input
            type="search"
            className="search"
            style={{ width: "90%", border: "none" }}
            placeholder={"Search for a location"}
            onChange={e =>
              this.setState({
                geoLocCity: e.target.value
              })
            }
            value={this.state.geoLocCity}
          />
          {/* </div> */}
          <FaSearch size="2em" />
        </div>
        <div style={styles.secondDiv}>
          {this.state.weekArr.map((item, index) => {
            return (
              <SecondComponent
                keyVal={index}
                data={item}
                activeIndex={activeIndex}
              />
            );
          })}
        </div>
        <WeatherReport
          data={this.state.weekArr[activeIndex]}
          getWeatherUpdate={this.getWeatherUpdate}
          weatherUpdate={this.state.weatherUpdate}
        />
      </div>
    );
  }
}

const styles = {
  mainStyle: {
    display: "flex",
    alignItems: "center",
    margin: "1.6%",
    marginLeft: "20%",
    marginRight: "20%",
    flexDirection: "column"
  },
  boxStyle: {
    display: "flex",
    flexDirection: "row",
    height: 80,
    borderRadius: 8,
    padding: "1.6%",
    justifyContent: "space-between",
    boxShadow: "1px 4px 6px 1px #9E9E9E",
    width: "100%"
  },
  secondDiv: {
    display: "flex",
    marginTop: "4%",
    flexDirection: "row",
    flexGrow: 1,
    width: "100%"
  }
};

export default Home;
