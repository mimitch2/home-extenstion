/* eslint-disable react/button-has-type */
/* eslint-disable no-undef */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import './hue.scss';

const Hue = ({ lights, getHueData }) => {
    const [showPicker, setShowPicker] = useState(false);
    const [hueValue, setHueValue] = useState(35000);
    const [brightness, setBrightness] = useState(200);
    const [saturation, setSaturation] = useState(0);
    const [light, setLight] = useState(1);
    const [isOn, setIsOn] = useState([]);

    const lightSwitch = async({ lt }) => {
        const thisLight = _.find(lights, (lght) => { return lights.indexOf(lght) === lt - 1; });
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
            // eslint-disable-next-line no-console
            console.log(error);
        }
    };


    const colorPicker = ({ lt }) => {
        setShowPicker(!showPicker);
        setLight(lt);
        setHueValue(lights[lt - 1].state.hue);
        setBrightness(lights[lt - 1].state.bri);
    };

    const setLightValues = ({ e, setting }) => {
        const value = Math.floor(e.target.value);

        if (setting === 'bri') {
            setBrightness(value);
        } else if (setting === 'hue') {
            setHueValue(value);
        } else {
            setSaturation(value);
        }

        fetch(`${process.env.REACT_APP_HUE_ENDPOINT}/lights/${light}/state`, {
            method: 'PUT',
            body: JSON.stringify({
                [setting]: value,
            }),
        });
    };

    return (lights
        ? (
            <div className="hue-controls-container">
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

                {showPicker
                    ? (
                        <div className="color-picker-div">
                            <div className="color-picker-wrapper">
                                <div className="slider-wrapper">
                                    <input
                                        type="range"
                                        min="1"
                                        max="65535"
                                        className="slider hue"
                                        onChange={(e) => { setLightValues({ e, setting: 'hue' }); }}
                                        value={hueValue}
                                    />
                                </div>
                                <div className="slider-wrapper">
                                    <input
                                        type="range"
                                        min="1"
                                        max="254"
                                        className="slider brightness"
                                        onChange={(e) => { setLightValues({ e, setting: 'bri' }); }}
                                        value={brightness}
                                    />
                                </div>

                                <div className="slider-wrapper">
                                    <input
                                        type="range"
                                        min="1"
                                        max="254"
                                        className="slider saturation"
                                        onChange={(e) => { setLightValues({ e, setting: 'sat' }); }}
                                        value={saturation}
                                    />
                                </div>

                            </div>
                        </div>) : null}
            </div>) : null
    );
};

Hue.propTypes = {
    lights: PropTypes.arrayOf(PropTypes.shape({
        state: PropTypes.shape({
            bri: PropTypes.number.isRequired,
            hue: PropTypes.number.isRequired,
            satu: PropTypes.number.isRequired,
        }),
    })).isRequired,
    getHueData: PropTypes.func.isRequired,
};

export default Hue;
