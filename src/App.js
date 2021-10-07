import { useEffect, useState } from 'react';
import { CountryTable, Graphic } from './components';
import { useControl } from './hooks/control';
import styles from './styles.module.css';

export default function App() {
  const { getData } = useControl();
  const [countryData, setCountryData] = useState();
  const [plotMode, setPlotMode] = useState('lines');

  useEffect(() => {
    getData('COUNTRY').then(response => {
      const [data] = response[1];
      // console.log(data);

      if (data) {
        setCountryData({ ...data });
      }
    }).catch(err => {
      console.log(err);
    });
  }, []);

  return (
    <div className={styles.pageContainer}>
      <header className={styles.header}>
        <h1>Brazil Weather Data</h1>
        <p>Brazilian historical data of temperature and precipitation over the years</p>
      </header>

      <main className={styles.main}>
        <div className={styles.countryContainer}>
          <CountryTable
            countryData={countryData}
          />
        </div>
        
        <div className={styles.graphicContainer}>
          <Graphic
            title='Brazilian weather data over years'
            width={window.innerWidth*0.7}
            height={window.innerHeight*0.7}
            showTemperature={true}
            showPrecipitation={true}
            mode={plotMode}
          />
        </div>
      </main>
    </div>
  );
}