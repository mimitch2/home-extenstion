/* eslint-disable import/prefer-default-export */
/* eslint-disable no-undef */
import { useState, useEffect } from 'react';

const useGetAccessTokens = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [tokens, setTokens] = useState(null);

    const fetchTokens = async() => {
        try {
            const response = await fetch(
                `https://api.ecobee.com/token?grant_type=refresh_token&code=".concat(${process.env.REACT_APP_ECOBEE_REFRESH_TOKEN}).concat("&client_id=").concat(${process.env.REACT_APP_API_KEY})`,
            );
        } catch (error) {
            console.log('GetTokens -> error', error);
        }
    };

    useEffect(() => {
        fetchTokens();
    }, []);
};

export { useGetAccessTokens };
