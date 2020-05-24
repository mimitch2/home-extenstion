/* eslint-disable react/button-has-type */
/* eslint-disable no-undef */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

const Hue = ({ lights, getHueData }) => {
    const [showPicker, setShowPicker] = useState(false);
    const [hueValue, setHueValue] = useState(35000);
    const [brightness, setBrightness] = useState(200);
    const [light, setLight] = useState(1);
    const [isOn, setIsOn] = useState([]);

    const lightSwitch = async({ lt }) => {
        // console.log('lightSwitch -> lt', lt);
        const thisLight = _.find(lights, (lght) => { return lights.indexOf(lght) === lt - 1; });
        // console.log('lightSwitch -> thisLight', thisLight);

        setIsOn(_.filter(isOn, (bulb) => { return bulb !== lt; }));

        try {
            await fetch(`${process.env.REACT_APP_HUE_ENDPOINT}/lights/${lt}/state`, {
                method: 'PUT',
                body: JSON.stringify({
                    on: !thisLight.state.on,
                }),
            });

            getHueData();
        } catch (error) {
            console.log(error);
        }
    };

    const colorPicker = ({ lt }) => {
        setShowPicker(!showPicker);
        setLight(lt);
        setHueValue(lights[lt - 1].state.hue);
        setBrightness(lights[lt - 1].state.bri);
    };

    const changeColor = (e) => {
        const hue = Math.floor(e.target.value);
        setHueValue(hue);

        fetch(`${process.env.REACT_APP_HUE_ENDPOINT}/lights/${light}/state`, {
            method: 'PUT',
            body: JSON.stringify({
                hue,
            }),
        });
    };

    const changeBrightness = (e) => {
        const value = _.toNumber(e.target.value);
        setBrightness(value);
        fetch(`${process.env.REACT_APP_HUE_ENDPOINT}/lights/${light}/state`, {
            method: 'PUT',
            body: JSON.stringify({
                bri: brightness,
            }),
        });
    };


    return (
        <div>
            {_.map(lights, (lt, idx) => {
                return (
                    <div
                        className="color-picker-title"
                        key={lt.name}
                    >
                        <button
                            onClick={() => {
                                lightSwitch({ lt: idx + 1 });
                            }}
                        >CLICK
                        </button>
                        <span onClick={() => { colorPicker({ lt: idx + 1 }); }}>
                            {lt.name}
                        </span>
                    </div>
                );
            })}

            {
                showPicker
            && <div className="color-picker-div">
                <div className="color-picker-wrapper">
                    <div className="brightness-slider-wrapper">
                        <input
                            type="range"
                            min="0"
                            max="65535"
                            className="slider hue"
                            onChange={changeColor}
                            value={hueValue}
                        />
                    </div>
                    <div className="brightness-slider-wrapper">
                        <input
                            type="range"
                            min="0"
                            max="254"
                            className="slider brightness"
                            onChange={changeBrightness}
                            value={brightness}
                        />
                    </div>

                </div>
               </div>
            }
        </div>
    );
};

Hue.propTypes = {
    lights: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    getHueData: PropTypes.func.isRequired,
};

export default Hue;
