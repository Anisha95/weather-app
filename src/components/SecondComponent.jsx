import React, { Component } from 'react';
import '../App.css';
import {imageArr} from '../constants'

export default class SecondComponent extends Component {
    state = { 
        isActiveDay: false
     }

    render() {
        const {data, keyVal, activeIndex, onClick, activeDay} = this.props;
        return ( 
            <div
            class="evm"
            onClick={() => onClick(activeIndex, keyVal)}
            key={keyVal} 
            style={{
                display: 'flex',
                flexDirection: 'column',
                flex: 1,
                border: activeDay === keyVal ? "2px solid #00bfff" : "none",
                borderColor: '#00bfff'
            }
        }
            >
                <ul key={keyVal} style={{marginLeft: '15%', marginRight: '2%',  marginTop: '4%'}}>
                        <p style={{fontWeight: 'bold', fontSize: '20px'}}>{data.day}</p>
                        <div style={{display: 'flex', flexDirection: 'row',}}>
                            <p style={{marginRight: '5%', fontWeight: 'bold'}}>{data.maxTemp}&deg;</p>
                            <p>{data.minTemp}&deg;</p>
                        </div>
                        <img src={imageArr[data.status]} style={{
                                height: 40, 
                                width: 40,
                                marginBottom: '3%'
                            }}/>
                        <p>{data.status}</p>
                </ul>
                 </div>
         );
    }
}
