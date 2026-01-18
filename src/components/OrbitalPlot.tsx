import Widget from '../components/Widget';
import styles from './OrbitalPlot.module.css';

const OrbitalPlot = () => {
  return (
    <Widget title="Orbital Visualization">
      <div className={styles.plotContainer}>
        <div className={styles.placeholderText}>3D Orbital Plot Disabled in Prototype</div>
        {/* Mock satellites */}
        <div className={`${styles.satellite} ${styles.sat1}`}></div>
        <div className={`${styles.satellite} ${styles.sat2}`}></div>
        <div className={`${styles.satellite} ${styles.sat3}`}></div>
        <div className={`${styles.satellite} ${styles.sat4}`}></div>
      </div>
    </Widget>
  );
};

export default OrbitalPlot;
