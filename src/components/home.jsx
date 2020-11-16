import React, { Component } from "react";
import "../App.css";
import { FaSearch } from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";
import SecondComponent from "./SecondComponent";
import WeatherReport from "./WeatherReport";
import { confirmAlert } from "react-confirm-alert";
import { API_KEY, GEO_API_KEY, countryChoices} from "../constants";
import Autosuggest from 'react-autosuggest';
import Autocomplete from 'react-autocomplete';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete'; 
import "react-confirm-alert/src/react-confirm-alert.css";


const getSuggestions = value => {
  const inputValue = value.trim().toLowerCase();
  const inputLength = inputValue.length;

  return inputLength === 0 ? [] : countryChoices.filter(lang =>
    lang.name.toLowerCase().slice(0, inputLength) === inputValue
  );
};

const getSuggestionValue = suggestion => suggestion.name;

// Use your imagination to render suggestions.




class Home extends Component {
  state = {
    weekArr: [
      { id: 1, day: "Sun", maxTemp: 28, minTemp: 19, status: "Sunny" },
      { id: 2, day: "Mon", maxTemp: 23, minTemp: 14, status: "Sunny" },
      { id: 3, day: "Tue", maxTemp: 27, minTemp: 19, status: "Sunny" },
      { id: 4, day: "Wed", maxTemp: 30, minTemp: 26, status: "Cloudy" },
      { id: 5, day: "Thu", maxTemp: 22, minTemp: 11, status: "Sunny" },
      { id: 6, day: "Fri", maxTemp: 27, minTemp: 17, status: "Rainfall" },
      { id: 7, day: "Sat", maxTemp: 21, minTemp: 12, status: "Sunny" }
    ],
    geoLocCity: '',
    weatherUpdate: null,
    value: '',
    suggestions: [],
    setMarginTop: false,
    count: 24,
    activeDay: new Date().getDay()
  };


/** experimental */
  onChange = (event, { newValue }) => {
    this.setState({
      value: newValue
    });
  };

   renderSuggestion = suggestion => {
    this.setState({
      setMarginTop: true
    })
    return(
      <p style={{
        borderBottom: '1px solid black',
        display: 'flex',
       flexDirection: 'column', 
      //height: 65,
      width: '425%' ,
      background: 'white',
       }}>
      {suggestion.name}
      </p>
  )};

  // Autosuggest will call this function every time you need to update suggestions.
  // You already implemented this logic above, so just use it.
  onSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: getSuggestions(value)
    });
  };

  // Autosuggest will call this function every time you need to clear suggestions.
  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  renderInputComponent = inputProps => (
    <div style={{ background: '#ffff',}}>
      <input
             
              style={{ height: 40, border: 'none', width: '300%' }}
              placeholder={"Search for a location"}
              onMouseOut={() => {
                this.setState({ 
                  setMarginTop: false
                })
              }}
              onMouseLeave={() => {
                this.setState({ 
                  setMarginTop: false
                })
              }}
              onMouseUp={() => {
                this.setState({ 
                  setMarginTop: false
                })
              }}
              onMouseDown={() => {
                this.setState({ 
                  setMarginTop: false
                })
              }}
              onChange={e =>
                this.setState({
                  geoLocCity: e.target.value
                })
              }
              {...inputProps}
            /> 
      {/* <div>custom stuff</div> */}
    </div>
  );

  /** experimental */

  getUserLocation = () => {
    fetch(`https://geolocation-db.com/json/${GEO_API_KEY}`)
      .then(response => response.json())
      .then(responseData => {
        this.setState({
          value: responseData.city
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

  handleClick = (activeIndex, keyVal) => {
    if (activeIndex === keyVal) {
      this.setState({
        count: 24
      })
    } else if (activeIndex + 1 === keyVal) {
      this.setState({
        count: 48
      })
    }
    this.setState({
      activeDay: keyVal
    })
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.value !== this.state.value || prevState.count !== this.state.count) {
      let city = this.state.value;
      fetch(
        `http://pro.openweathermap.org/data/2.5/forecast/hourly?q=${city}&cnt=${this.state.count}&appid=${API_KEY}`
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
    let { value, suggestions } = this.state;
    const inputProps = {
      placeholder: 'Enter a city',
      value,
      onChange: this.onChange
    };


    return (
      <div style={styles.mainStyle}>
        <div style={styles.boxStyle}>
          <div style={{ display: 'flex', 
         width: "25%",
         justifyContent: 'space-between',
          flexDirection: 'row', }}>
          <MdLocationOn size="2em" />
           <Autosuggest
          suggestions={suggestions}
          onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
          onSuggestionsClearRequested={this.onSuggestionsClearRequested}
          getSuggestionValue={getSuggestionValue}
          renderSuggestion={this.renderSuggestion}
          renderInputComponent={this.renderInputComponent}
          inputProps={inputProps}
        />
          </div>
          <FaSearch size="2em" />
        </div>
        {!this.state.setMarginTop ? (
        <div style={{
    display: "flex",
    marginTop: this.state.setMarginTop ? "50%" : "4%",
    flexDirection: "row",
    flexGrow: 1,
    width: "100%"
  }}>
          {this.state.weekArr.map((item, index) => {
            return (
              <SecondComponent
                keyVal={index}
                data={item}
                activeDay={this.state.activeDay}
                onClick={this.handleClick}
                activeIndex={activeIndex}
              />
            );
          })}
        </div>) : null}
        {!this.state.setMarginTop ? (
        <WeatherReport
          data={this.state.weekArr[activeIndex]}
          getWeatherUpdate={this.getWeatherUpdate}
          weatherUpdate={this.state.weatherUpdate}
        /> ) : null}
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
