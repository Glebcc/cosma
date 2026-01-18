import GroundStationStatus from '../components/GroundStationStatus';
import OrbitalPlot from '../components/OrbitalPlot';
import SatelliteCatalog from '../components/SatelliteCatalog';
import ThreatAssessment from '../components/ThreatAssessment';
import styles from './Dashboard.module.css';

const Dashboard = () => {
  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <h1>COSMA Dashboard</h1>
      </header>
      <aside className={styles.sidebar}>
        <h2>Navigation</h2>
        <nav>
          <ul>
            <li className={styles.active}>Dashboard</li>
            <li>Satellites</li>
            <li>Ground Stations</li>
            <li>Alerts</li>
            <li>Settings</li>
          </ul>
        </nav>
      </aside>
      <main className={styles.mainContent}>
        <div className={styles.mainGrid}>
            <div className={styles.colSpan2}>
                <SatelliteCatalog />
            </div>
            <GroundStationStatus />
            <ThreatAssessment />
            <div className={styles.colSpan3}>
                <OrbitalPlot />
            </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
