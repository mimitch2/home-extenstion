import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import 'App.scss';
import { Hue, Sonos } from 'components';

const App = () => {
    const [hueData, setHueData] = useState([]);
    // const [sonosData, setSonosData] = useState([]);

    const getHueData = async() => {
        // eslint-disable-next-line no-undef
        const info = await fetch(`${process.env.REACT_APP_HUE_ENDPOINT}/lights`);

        const response = await info.json();
        const lights = _.values(response);

        setHueData(lights);
    };

    useEffect(() => {
        getHueData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    return (
        <div className="App">
            <Hue lights={hueData} getHueData={getHueData} />
            {/* <Sonos /> */}
        </div>
    );
};

export default App;
