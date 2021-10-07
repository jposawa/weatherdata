import { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';
import { useControl } from '../../hooks/control';
// import styles from './styles.module.css';

export default function Graphic(props) {
  const {
    width,
    height,
    title,
    showTemperature,
    showPrecipitation,
    mode,
  } = props;
  const { weatherData } = useControl();
  const [visibleData, setVisibleData] = useState([]);
  const [revision, setRevision] = useState(0);
  const [layout, setLayout] = useState({
    width,
    height,
    title,
    yaxis: {},
    yaxis2: {},
  });

  const organizeData = (typeName, data) => {
    const dataObject = {
      x: [],
      y: [],
      name: typeName,
      type: 'scatter',
      mode: mode ? mode : "lines",
    };

    data.forEach(value => {
      dataObject.x.push(value.year);
      dataObject.y.push(value.data.toFixed(2));
    });

    return { ...dataObject };
  }

  useEffect(() => {
    const _layout = { ...layout };
    let _visibleData;

    if (weatherData && weatherData.temperature && weatherData.precipitation) {
      _layout.xaxis = {
        range: [1901, 2021],
      };
      _layout.shapes = [{
        name: "Ano mais frio",
        type: 'rect',
        x0: '1982',
        y0: 0,
        x1: '1984',
        y1: 1,
        yref: 'paper',
        fillcolor: '#369',
        opacity: 0.5,
        line: {
          width: 1,
          color:'#369',
        }
      }, {
        name: "Ano mais quente",
        type: 'rect',
        x0: '2019',
        y0: 0,
        x1: '2021',
        y1: 1,
        yref: 'paper',
        fillcolor: '#c33',
        opacity: 0.5,
        line: {
          width: 1,
          color:'#c33',
        }
      }];

      _layout.traces = [{
        x0: '1982',
        y0: 0,
        x1: '1984',
        y1: 1,
        yref: 'paper',
        opacity: 0,
        text: 'Ano mais frio na terra',
      }];

      _layout.legend ={
        x:0,
        y:1,
        xanchor:'left',
        yanchor:'bottom',
      };

      if (showTemperature && showPrecipitation) {
        _layout.yaxis = {
          title: 'Precipitation (mm)',
          ticklen: 4,
        };
        _layout.yaxis2 = {
          title: 'Temperature (ºC)',
          overlaying: 'y',
          side: 'right',
          ticklen: 4,
        };

        const temperatureData = organizeData('Temperature', weatherData.temperature);

        temperatureData.yaxis = 'y2';

        _visibleData = [organizeData('Precipitation', weatherData.precipitation), temperatureData];
      }
      else if (showTemperature) {
        _layout.yaxis = {
          title: 'Temperature',
          marker: {
            color: '#ff7f0e',
          },
        }

        _visibleData = [organizeData('Temperature', weatherData.temperature)];
      }
      else if (showPrecipitation) {
        _layout.yaxis = {
          title: 'Precipitation',
        }

        _visibleData = [organizeData('Precipitation', weatherData.precipitation)];
      }
      _layout.datarevision = revision + 1;

      setRevision(_layout.datarevision);
      setLayout(_layout);
      setVisibleData(_visibleData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showTemperature, showPrecipitation, weatherData]);

  // console.log(visibleData);
  return (
    <>
      <Plot
        data={revision > 0 ? visibleData : []}
        layout={layout}
        revision={revision}
      />
    </>
  );
}