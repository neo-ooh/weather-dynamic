import classNames         from 'classnames';
import React              from 'react';
import { useTranslation } from 'react-i18next';

const Today = ({ weatherData }) => {
  const { t } = useTranslation('weather');

  return (
    <div className="bottom-part today">
      <div className="separator"/>
      <div className={ classNames('temperature',
        { 'bellow-zero': weatherData.TemperatureC <= 0 },
        { 'shrink': weatherData.TemperatureC.length > 2 },
      ) }>
        { weatherData.TemperatureC }°
      </div>
      <div className="details">
        <div className="detail-line feels-like">
            <span className="detail-name">
              { t('feels-like') }
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
