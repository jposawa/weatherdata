import { useEffect, useState } from 'react';
import { CountryTable, Graphic } from './components';
import { useControl } from './hooks/control';
import styles from './styles.module.css';

export default function App() {
  const {getData} = useControl();
  const [countryData, setCountryData] = useState();
  
  useEffect(()=>{
    getData('COUNTRY').then(response => {
      const [data] = response[1];
      console.log(data);

      if(data){
        setCountryData({...data});
      }
    }).catch(err => {
      console.log(err);
    });
  },[]);

  return (
    <>
    <header className={styles.header}>
      <h1>Brazil Weather Data</h1>
      <p>Historical data of temperature and precipitation over the years</p>
    </header>
    <main className={styles.main}>
      <div className={styles.countryContainer}>
        <CountryTable
          countryData={countryData}
        />
      </div>
      <div className={styles.graphicContainer}>
        <Graphic
          title='Weather data over years'
          showTemperature={true}
          showPrecipitation={true}
        />
      </div>
    </main>
    </>
  );
}