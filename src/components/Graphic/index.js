import { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';
import { useControl } from '../../hooks/control';
import styles from './styles.module.css';

export default function Graphic(props) {
  const {
    width,
    height,
    title,
    showTemperature,
    showPrecipitation,
  } = props;
  const { getData } = useControl();
  const [weatherData, setWeatherData] = useState({
    temperature: {
      x: [],
      y: [],
      type: 'scatter',
    },
    precipitation: {
      x: [],
      y: [],
      type: 'scatter',
    }
  });
  const [visibleData, setVisibleData] = useState([]);
  const [layout, setLayout] = useState({
    title,
    width,
    height,
    yaxis: {},
    yaxis2: {},
  });

  const organizeData = (dataObject, typeName, data) => {
    Object.values(data).forEach(value => {
      dataObject[typeName].x.push(value.year);
      dataObject[typeName].y.push(value.data);
    });
  }

  const updateWeatherData = async () => {
    try {
      const _weatherData = { ...weatherData };
      const temperatureData = await getData('TEMPERATURE');
      const precipitationData = await getData('PRECIPITATION');

      organizeData(_weatherData, 'temperature', temperatureData);
      organizeData(_weatherData, 'precipitation', precipitationData);

      setWeatherData(_weatherData);
    }
    catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    updateWeatherData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const _layout = { ...layout };
    let _visibleData;

    if (showTemperature && showPrecipitation) {
      _layout.yaxis = {
        title: 'Precipitation',
      };
      _layout.yaxis2 = {
        title: 'Temperature',
        titlefont: {
          color: '#ff7f0e',
        },
        tickfont: {
          color: '#ff7f0e',
        },
        overlaying: 'y',
        side: 'right',
      };

      _visibleData = [weatherData.precipitation, weatherData.temperature];
    }
    else if (showTemperature) {
      _layout.yaxis = {
        title: 'Temperature',
        titlefont: {
          color: '#ff7f0e',
        },
        tickfont: {
          color: '#ff7f0e',
        },
      }

      _visibleData = [weatherData.temperature];
    }
    else if (showPrecipitation) {
      _layout.yaxis = {
        title: 'Precipitation',
      }

      _visibleData = [weatherData.precipitation];
    }

    setLayout(_layout);
    setVisibleData([..._visibleData]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showTemperature, showPrecipitation]);

  console.log(visibleData);
  return (
    <>
      {visibleData && visibleData.length > 0 && (
        <Plot
          data={visibleData}
          layout={layout}
        />
      )}
    </>
  );
}