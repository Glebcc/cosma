import Widget from '../components/Widget';
import styles from './ThreatAssessment.module.css';

const mockThreats = [
  { id: 1, objectA: 'COSMA-01', objectB: 'DEBRIS (IRIDIUM 33)', probability: 'High', timeToCca: '1h 15m' },
  { id: 2, objectA: 'STARLINK-33255', objectB: 'ONEWEB-1842', probability: 'Medium', timeToCca: '3h 45m' },
  { id: 3, objectA: 'ISS', objectB: 'DEBRIS (FENGYUN 1C)', probability: 'Low', timeToCca: '8h 02m' },
  { id: 4, objectA: 'COSMOS 2574', objectB: 'DEBRIS (COSMOS 2251)', probability: 'Medium', timeToCca: '1d 2h' },
];

const ThreatAssessment = () => {
  const getProbabilityClass = (prob: string) => {
    switch (prob) {
      case 'High': return styles.high;
      case 'Medium': return styles.medium;
      case 'Low': return styles.low;
      default: return '';
    }
  };

  return (
    <Widget title="Threat Assessment">
      <div className={styles.threatList}>
        {mockThreats.map(threat => (
          <div key={threat.id} className={styles.threatItem}>
            <div className={`${styles.probability} ${getProbabilityClass(threat.probability)}`}>
              {threat.probability}
            </div>
            <div className={styles.threatInfo}>
              <span className={styles.objects}>{threat.objectA} ↔ {threat.objectB}</span>
              <span className={styles.time}>TCA: {threat.timeToCca}</span>
            </div>
          </div>
        ))}
      </div>
    </Widget>
  );
};

export default ThreatAssessment;
