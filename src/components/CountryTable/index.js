//https://www.google.com/maps/@-15.7801,-47.9292,12z
import styles from './styles.module.css';

export default function CountryTable(props) {
  const { countryData } = props;

  return (
    <>
      {countryData && (
        <div className={styles.table}>
          <div className={styles.head}>
            <p>Country</p>
            <p>Capital</p>
            <p>Region</p>
            <p>Income level</p>
          </div>

          <div className={styles.values}>
            <p>{`${countryData.name} (${countryData.id})`}</p>
            <p>
              <a href={`https://www.google.com/maps/@${countryData.latitude},${countryData.longitude},11z`} target="_blank" rel="noreferrer">{countryData.capitalCity}</a>
            </p>
            <p>{`${countryData.region.value} (${countryData.region.id})`}</p>
            <p>{`${countryData.incomeLevel.value} (${countryData.incomeLevel.id})`}</p>
          </div>
        </div>
      )}
    </>
  );
}