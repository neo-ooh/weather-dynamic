import React              from 'react';
import { useTranslation } from 'react-i18next';

/**
 *
 * @param {Record} weatherData
 * @return {JSX.Element}
 * @constructor
 */
const Today = ({ weatherData }) => {
  const { t } = useTranslation('weather');

  return (
    <div className="bottom-part today">
      <div className={ 'temperature ' +
      (weatherData.TemperatureC <= 0 ? 'bellow-zero ' : ' ') +
      (weatherData.TemperatureC.length > 2 ? 'shrink ' : ' ') }>
        { weatherData.TemperatureC }°
      </div>
      <div className="details">
        <div className="detail-line feels-like">
            <span className="detail-name">
              { t('feelsLike') }
            </span>
          <span className="detail-value">
              { weatherData.FeelsLikeC }°
            </span>
        </div>
        <div className="detail-separator"/>
        <div className="detail-line wind">
            <span className="detail-name">
              { t('wind') }
            </span>
          <span className="detail-value">
              { weatherData.WindSpeedKMH } km/h
            </span>
        </div>
        <div className="detail-separator"/>
        <div className="detail-line min-max">
          <div className="temperature-line max">
              <span className="detail-name">
              { t('max') }
              </span>
            <span className="detail-value">
                { weatherData.TemperatureCMax }°
              </span>
          </div>
          <div className="temperature-line min">
              <span className="detail-name">
              { t('min') }
              </span>
            <span className="detail-value">
                { weatherData.TemperatureCMin }°
              </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Today;
