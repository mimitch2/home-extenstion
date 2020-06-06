/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/button-has-type */
/* eslint-disable no-undef */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import './hue.scss';

const Hue = ({ allLights, getHueData }) => {
    const [showPicker, setShowPicker] = useState(false);
    const [selectedLightIdx, setSelectedLightIdx] = useState(1);
    const [bulbs, setBulbs] = useState([]);

    useEffect(() => {
        const lightsWithId = _.map(allLights, (bulb, idx) => {
            return { ...bulb, id: idx + 1 };
        });

        setBulbs(lightsWithId);
    }, [allLights]);

    const lightSwitch = async({ idx }) => {
        try {
            await fetch(`${process.env.REACT_APP_HUE_ENDPOINT}/lights/${idx + 1}/state`, {
                method: 'PUT',
                body: JSON.stringify({
                    on: !allLights[idx].state.on,
                }),
            });

            getHueData();
        } catch (error) {
            // eslint-disable-next-line no-console
            console.log(error);
        }
    };

    const toggleColorPicker = ({ idx }) => {
        if (selectedLightIdx === idx && showPicker) {
            setShowPicker(false);
        } else {
            setShowPicker(true);
        }

        setSelectedLightIdx(idx);
    };

    const setLightValues = ({ e, setting }) => {
        const value = Math.floor(e.target.value);

        const newValues = [...bulbs];
        bulbs[selectedLightIdx].state[setting] = value;

        setBulbs(newValues);


        fetch(`${process.env.REACT_APP_HUE_ENDPOINT}/lights/${selectedLightIdx + 1}/state`, {
            method: 'PUT',
            body: JSON.stringify({
                [setting]: value,
            }),
        });
    };

    const renderLights = () => {
        return _.map(allLights, (lt, idx) => {
            return (
                <div
                    className="color-picker-title"
                    key={lt.name}
                >
                    <span onClick={() => { toggleColorPicker({ idx }); }}>
                        {lt.name}
                    </span>
                    <label className="checkbox">
                        <input
                            type="checkbox"
                            onChange={() => {
                                lightSwitch({ idx });
                            }}
                            checked={`${lt.state.on ? 'checked' : ''}`}
                            name={`${lt.id}`}
                        />
                        <span className="checkbox-custom" />
                    </label>
                </div>
            );
        });
    };

    const renderColorPicker = () => {
        return (
            <div className="color-picker-div">
                <div className="color-picker-wrapper">
                    <div className="slider-wrapper">
                        <input
                            type="range"
                            min="1"
                            max="65535"
                            className="slider hue"
                            onChange={(e) => { setLightValues({ e, setting: 'hue' }); }}
                            value={bulbs[selectedLightIdx].state.hue}
                        />
                    </div>
                    <div className="slider-wrapper">
                        <input
                            type="range"
                            min="1"
                            max="254"
                            className="slider brightness"
                            onChange={(e) => { setLightValues({ e, setting: 'bri' }); }}
                            value={bulbs[selectedLightIdx].state.bri}
                        />
                    </div>

                    <div className="slider-wrapper">
                        <input
                            type="range"
                            min="1"
                            max="254"
                            className="slider saturation"
                            onChange={(e) => { setLightValues({ e, setting: 'sat' }); }}
                            value={bulbs[selectedLightIdx].state.sat}
                        />
                    </div>

                </div>
            </div>);
    };

    return (allLights
        ? (
            <div className="hue-controls-container">
                {renderLights()}
                {showPicker && renderColorPicker()}
            </div>
        ) : null
    );
};

Hue.propTypes = {
    allLights: PropTypes.arrayOf(PropTypes.shape({
        state: PropTypes.shape({
            bri: PropTypes.number.isRequired,
            hue: PropTypes.number.isRequired,
            sat: PropTypes.number.isRequired,
            on: PropTypes.bool.isRequired,
        }),
    })).isRequired,
    getHueData: PropTypes.func.isRequired,
};

export default Hue;
