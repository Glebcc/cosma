import { useState } from 'react';
import styles from './GroundStationStatus.module.css';
import { FaCircle } from 'react-icons/fa';

type StationStatus = 'Online' | 'Offline' | 'Maintenance';

interface Station {
  name: string;
  location: string;
  status: StationStatus;
  contact: string | null;
}

// This will come from a data file later
const mockStations: Station[] = [
  { name: 'Goonhilly', location: 'UK', status: 'Online', contact: 'NAVSTAR 82' },
  { name: 'Svalbard', location: 'Norway', status: 'Online', contact: 'ONEWEB-1842' },
  { name: 'Troll', location: 'Antarctica', status: 'Offline', contact: null },
  { name: 'Hartebeesthoek', location: 'South Africa', status: 'Online', contact: 'ISS' },
  { name: 'Weilheim', location: 'Germany', status: 'Maintenance', contact: null },
  { name: 'Kourou', location: 'French Guiana', status: 'Online', contact: 'STARLINK-33255' },
];

const statusColors = {
  Online: '#1affab',
  Offline: '#ff8a8a',
  Maintenance: '#ffd966',
};

const GroundStationStatus = () => {
  const [stations, setStations] = useState(mockStations);

  const toggleStatus = (index: number) => {
    const newStations = [...stations];
    const currentStatus = newStations[index].status;
    // Cycle status: Online -> Offline -> Maintenance -> Online
    if (currentStatus === 'Online') newStations[index].status = 'Offline';
    else if (currentStatus === 'Offline') newStations[index].status = 'Maintenance';
    else newStations[index].status = 'Online';
    setStations(newStations);
  };

  return (
    <div className="panel" style={{ height: '100%' }}>
      <div className="panel-header">
        <span>GROUND STATIONS</span>
        <span className="text-mono text-accent">NETWORK</span>
      </div>
      <div className="panel-content">
        <ul className={styles.stationList}>
          {stations.map((station, index) => (
            <li key={station.name} className={styles.stationItem} onClick={() => toggleStatus(index)} style={{ cursor: 'pointer' }}>
              <div className={styles.stationInfo}>
                <span className={`${styles.stationName} text-mono`}>{station.name.toUpperCase()}</span>
                <span className={`${styles.stationLocation} text-mono`}>{station.location.toUpperCase()}</span>
              </div>
              <div className={styles.stationStatus}>
                <span className="text-mono" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <FaCircle 
                    size="0.6em" 
                    color={statusColors[station.status]} 
                    className={styles.statusIcon} 
                  /> 
                  {station.status.toUpperCase()}
                </span>
                {station.contact && (
                  <span className={`${styles.contact} text-mono`}>LINK: {station.contact}</span>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default GroundStationStatus;
