import React              from 'react';
import { useTranslation } from 'react-i18next';

const Tomorrow = ({ weatherData }) => {
  const { t } = useTranslation('weather');

  return (
    <div className="bottom-part tomorrow">
      <div className="separator"/>
      <div className="forecast">
        <div className="max">
          { weatherData.TemperatureCMax }°
        </div>
        <div className="min">
          { weatherData.TemperatureCMin }°
        </div>
      </div>
      <div className="details wide centered">
        <div className="detail-line wind">
            <span className="detail-name">
              { t('wind') }
            </span>
          <span className="detail-value">
              { weatherData.WindSpeedKMH } km/h
            </span>
        </div>
        <div className="detail-separator"/>
        <div className="detail-line feels-like">
            <span className="detail-name">
              { t('pop') }
            </span>
          <span className="detail-value">
              { weatherData.POPPercentDay }%
            </span>
        </div>
      </div>
    </div>
  );
};

export default Tomorrow;
