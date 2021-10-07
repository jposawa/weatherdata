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
  const { weatherData } = useControl();
  const [visibleData, setVisibleData] = useState([]);
  const [revision, setRevision] = useState(0);
  const [layout, setLayout] = useState({
    width,
    height,
    title,
    yaxis: {},
    yaxis2: {},
    xaxis: {
      range: [1901, 2021],
    },
    shapes: [{
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
        color: '#369',
      }
    }, {
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
        color: '#c33',
      }
    }],
    legend:{
      x:0,
      y:1,
      xanchor:'left',
      yanchor:'bottom',
    },
    revision:0,
  });

  const organizeData = (typeName, data) => {
    const dataObject = {
      x: [],
      y: [],
      name: typeName,
      type: 'scatter',
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
          title: 'Temperature (ºC)',
        }

        _visibleData = [organizeData('Temperature', weatherData.temperature)];
        _visibleData[0].line = {
          color: '#ff7f0e',
        };
      }
      else if (showPrecipitation) {
        _layout.yaxis = {
          title: 'Precipitation (mm)',
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

  return (
    <>
      <Plot
        data={revision > 0 ? visibleData : []}
        layout={layout}
        revision={revision}
      />

      <div className={styles.secondaryLegend}>
        <dl>
          <span>
            <dt className={styles.hot} />
            <dd>Earth's hottest year</dd>
          </span>

          <span>
            <dt className={styles.cold} />
            <dd>Earth's coldest year</dd>
          </span>
        </dl>
      </div>
    </>
  );
}