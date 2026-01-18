import styles from './SatelliteCatalog.module.css';
import { FaPlus } from 'react-icons/fa';

// This will come from a data file later
const mockSatellites = [
  { id: 'COSMA-01', norad: 58718, country: 'USA', orbit: 'LEO', status: 'Operational' },
  { id: 'COSMA-02', norad: 58719, country: 'EU', orbit: 'LEO', status: 'Operational' },
  { id: 'STARLINK-33255', norad: 58600, country: 'USA', orbit: 'VLEO', status: 'Operational' },
  { id: 'ONEWEB-1842', norad: 58284, country: 'UK', orbit: 'LEO', status: 'Operational' },
  { id: 'NAVSTAR 82 (USA-343)', norad: 55202, country: 'USA', orbit: 'MEO', status: 'Operational' },
  { id: 'ISS', norad: 25544, country: 'International', orbit: 'LEO', status: 'Operational' },
  { id: 'TIANHE-1', norad: 48274, country: 'China', orbit: 'LEO', status: 'Operational' },
  { id: 'COSMOS 2574', norad: 58699, country: 'Russia', orbit: 'SSO', status: 'Failure' },
];

const SatelliteCatalog = () => {
  return (
    <div className="panel" style={{ height: '100%' }}>
      <div className="panel-header">
        <span>SATELLITE CATALOG</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <button className="text-mono" style={{ 
            background: 'transparent', 
            border: '1px solid var(--color-accent)', 
            color: 'var(--color-accent)', 
            padding: '4px 8px', 
            cursor: 'pointer', 
            fontSize: '0.7rem', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '5px' 
          }}>
            <FaPlus size={10} /> TRACK NEW
          </button>
          <span className="text-mono text-accent">{mockSatellites.length} ASSETS</span>
        </div>
      </div>
      <div className="panel-content">
        <div className={styles.catalog}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className="text-mono">ID</th>
                <th className="text-mono">NORAD ID</th>
                <th className="text-mono">COUNTRY</th>
                <th className="text-mono">ORBIT</th>
                <th className="text-mono">STATUS</th>
              </tr>
            </thead>
            <tbody>
              {mockSatellites.map((sat) => (
                <tr key={sat.norad} className="text-mono">
                  <td>{sat.id}</td>
                  <td>{sat.norad}</td>
                  <td>{sat.country}</td>
                  <td>{sat.orbit}</td>
                  <td>
                    <span className={`${styles.status} ${styles[sat.status.toLowerCase()]}`}>
                      {sat.status.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SatelliteCatalog;
