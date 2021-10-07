import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

export const ControlContext = createContext();

export const ControlProvider = ({ children }) => {
  const CONFIG = {
    LOCAL_PREFIX: "jpWeatherData@",
    URL: {
      API: {
        COUNTRY: "http://api.worldbank.org/v2/country/br?format=json",
        PRECIPITATION: "http://climatedataapi.worldbank.org/climateweb/rest/v1/country/cru/pr/year/bra",
        TEMPERATURE: "http://climatedataapi.worldbank.org/climateweb/rest/v1/country/cru/tas/year/bra",
      },
    },
  };
  const [weatherData, setWeatherData] = useState({
    temperature: undefined,
    precipitation: undefined,
  });

  const getData = async (apiName) => {
    const { API } = CONFIG.URL;
    apiName = apiName.toUpperCase();

    try {
      const response = await axios.get(`${API[apiName]}`);

      if (response.status === 200) {
        return response.data;
      }

      console.log(response);
    }
    catch (err) {
      console.log(err);
    }
  }

  const updateWeatherData = async () => {
    try {
      const _weatherData = { ...weatherData };
      _weatherData.temperature = await getData('TEMPERATURE');
      _weatherData.precipitation = await getData('PRECIPITATION');

      // organizeData(_weatherData, 'temperature', temperatureData);
      // organizeData(_weatherData, 'precipitation', precipitationData);
      setWeatherData(_weatherData);
      // updateRevision();
    }
    catch (err) {
      console.log(err);
    }
  }

  useEffect(()=>{
    updateWeatherData()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const values = {
    CONFIG,
    getData,
    weatherData,
  };

  return (
    <ControlContext.Provider value={values}>
      {children}
    </ControlContext.Provider>
  );
}


export const useControl = () => {
  const content = useContext(ControlContext);

  if (!content) {
    console.log("This must be within a Provider");
  }

  return content;
}