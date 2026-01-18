import { useState, useEffect } from 'react';
import './index.css';
import { FaShieldAlt, FaSatelliteDish, FaRocket, FaExclamationTriangle, FaSatellite, FaUserAstronaut, FaArrowRight, FaExclamationCircle, FaInfoCircle, FaMeteor, FaTimes, FaCrosshairs, FaCheck } from 'react-icons/fa';
import GroundStationStatus from './components/GroundStationStatus';
import SatelliteCatalog from './components/SatelliteCatalog';
import CareerPage from './components/CareerPage';

// Mock Data Types
interface Satellite {
  id: string;
  name: string;
  orbit: string;
  status: 'nominal' | 'warning' | 'critical';
  altitude: number;
  fuel: number; // Percentage
}

interface Alert {
  id: string;
  type: 'ASAT' | 'FRAGMENTATION' | 'CONJUNCTION';
  message: string;
  severity: 'critical' | 'high' | 'medium';
  timestamp: string;
}

interface RiskEvent {
  id: string;
  object: string;
  probability: number; // 0-1 (Y-Axis)
  impact: number; // 0-10 (X-Axis)
  color: string;
  recommendedDv: number;
}

const App = () => {
  const [time, setTime] = useState(new Date());
  const [selectedRiskId, setSelectedRiskId] = useState<string | null>('R-1'); // Default select critical for demo
  const [deltaV, setDeltaV] = useState(0);
  const [telemetryRate, setTelemetryRate] = useState(120);
  const [activeView, setActiveView] = useState('Dashboard');
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [selectedSatellite, setSelectedSatellite] = useState<Satellite | null>(null);
  const [riskViewMode, setRiskViewMode] = useState<'matrix' | 'pareto'>('matrix');
  const [secondaryCollision, setSecondaryCollision] = useState<string | null>(null);

  // Mock Data
  const satellites: Satellite[] = [
    { id: 'SAT-01', name: 'COSMA-EYE 1', orbit: 'LEO', status: 'nominal', altitude: 550, fuel: 82 },
    { id: 'SAT-02', name: 'COSMA-EYE 2', orbit: 'LEO', status: 'nominal', altitude: 552, fuel: 78 },
    { id: 'SAT-03', name: 'SENTINEL-X', orbit: 'SSO', status: 'warning', altitude: 780, fuel: 45 },
    { id: 'SAT-04', name: 'COMMS-RELAY', orbit: 'GEO', status: 'nominal', altitude: 35786, fuel: 91 },
  ];

  const alerts: Alert[] = [
    { id: 'AL-01', type: 'ASAT', message: 'KINETIC TEST DETECTED (REGION 4)', severity: 'critical', timestamp: 'T-00:02:00' },
    { id: 'AL-02', type: 'FRAGMENTATION', message: 'DEBRIS CLOUD FORMED: COSMOS-1408', severity: 'high', timestamp: 'T-00:15:30' },
    { id: 'AL-03', type: 'CONJUNCTION', message: 'HIGH PROBABILITY: SAT-03 vs DEBRIS', severity: 'medium', timestamp: 'T-04:22:10' },
  ];

  const risks: RiskEvent[] = [
    { id: 'R-1', object: 'SAT-03', probability: 0.8, impact: 9, color: '#000000', recommendedDv: 1.5 }, // High Prob, High Impact
    { id: 'R-2', object: 'SAT-01', probability: 0.2, impact: 7, color: '#000000', recommendedDv: 0.8 }, // Low Prob, High Impact
    { id: 'R-3', object: 'SAT-04', probability: 0.05, impact: 2, color: '#000000', recommendedDv: 0.2 }, // Low Prob, Low Impact
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
      setTelemetryRate(Math.floor(Math.random() * (150 - 110 + 1) + 110)); // Simulate fluctuating data rate
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Secondary Collision Simulation
  useEffect(() => {
    if (deltaV > 2.2 && deltaV < 3.8) {
      setSecondaryCollision("DEBRIS (COSMOS 1408)");
    } else {
      setSecondaryCollision(null);
    }
  }, [deltaV]);

  // Simulation Logic
  const currentRisk = risks.find(r => r.id === selectedRiskId) || risks[0];
  const riskSatellite = satellites.find(s => s.id === currentRisk?.object);
  const simulatedProb = currentRisk ? Math.max(0.001, currentRisk.probability - (deltaV * 0.15)) : 0;
  const isSafe = simulatedProb < 0.05;

  // Dynamic Orbit Visualization based on selection
  const orbitSize = riskSatellite?.orbit === 'GEO' ? 400 : riskSatellite?.orbit === 'SSO' ? 340 : 280;
  const debrisAngle = selectedRiskId === 'R-1' ? 45 : selectedRiskId === 'R-2' ? -30 : 90;

  // Pareto Graph Data Generation
  const generateParetoPoints = () => {
    const points = [];
    const width = 300;
    const height = 150;
    for (let x = 0; x <= 50; x++) { // x is deltaV * 10
      const dv = x / 10;
      const prob = currentRisk ? currentRisk.probability * Math.exp(-dv) : 0;
      const px = (x / 50) * width;
      const py = height - (prob * height); // Invert Y
      points.push(`${px},${py}`);
    }
    return points.join(' ');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar Navigation */}
      <aside style={{ 
        width: '80px', 
        borderRight: '2px solid var(--color-panel-border)', 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: '20px',
        background: 'transparent'
      }}>
        <div style={{ marginBottom: '40px', color: 'var(--color-accent)', fontWeight: 'bold', fontSize: '1.8rem', fontFamily: 'Rajdhani' }}>C</div>
        
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
        {['Dashboard', 'Orbit', 'Assets', 'Analytics', 'Karriere', 'Settings'].map((item) => (
          <div key={item} 
            onClick={() => setActiveView(item)}
            style={{ 
            writingMode: 'vertical-rl', 
            transform: 'rotate(180deg)', 
            margin: '20px 0', 
            cursor: 'pointer',
            color: activeView === item ? 'var(--color-accent)' : 'var(--color-text-muted)',
            borderLeft: activeView === item ? '2px solid var(--color-accent)' : '2px solid transparent',
            paddingLeft: '10px',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            fontSize: '0.8rem'
          }}>
            {item}
          </div>
        ))}
        </div>

        {/* Profile Area with Pre-Order */}
        <div style={{ marginBottom: '20px', width: '100%', padding: '0 10px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '0', border: '2px solid var(--color-text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)', marginBottom: '10px' }}>
            <FaUserAstronaut />
          </div>
          <div style={{ fontSize: '0.6rem', color: 'var(--color-text-muted)', textAlign: 'center' }}>CMDR. SHEPARD</div>
          <button className="btn-preorder" onClick={() => setShowSubscriptionModal(true)}>
            WEAVER PRO <FaArrowRight style={{ marginLeft: '4px', fontSize: '0.6rem' }}/>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '20px', gap: '20px' }}>
        
        {/* Header */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid var(--color-panel-border)', paddingBottom: '10px' }}>
          <div>
            <h1 className="uppercase" style={{ fontSize: '1.8rem', letterSpacing: '4px', margin: 0 }}>
              <span className="text-accent">COSMA</span> // SSA PLATFORM
            </h1>
            <div className="text-mono" style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
              SPACE SITUATIONAL AWARENESS SYSTEM v2.4
            </div>
          </div>

          {/* Status Indicators (TraCCS & Encryption) */}
          <div style={{ display: 'flex', gap: '30px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--color-accent)' }}>
              <FaShieldAlt size={18} />
              <span className="text-mono blink" style={{ fontSize: '0.9rem', letterSpacing: '1px' }}>COSMA SECURE</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--color-text-muted)' }}>
              <FaSatelliteDish size={18} />
              <span className="text-mono" style={{ fontSize: '0.9rem', letterSpacing: '1px' }}>TraCCS: ONLINE</span>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div className="text-mono text-accent" style={{ fontSize: '1.5rem' }}>
              {time.toISOString().split('T')[1].split('.')[0]} UTC
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-alert)' }}>DEFCON 4</div>
          </div>
        </header>

        {/* Dashboard Grid */}
        {activeView === 'Dashboard' ? (
          <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '2fr 1fr', 
          gridTemplateRows: '1.5fr 1fr', 
          gap: '20px', 
          flex: 1 
        }}>
          
          {/* Main View: Orbit Map */}
          <div className="panel" style={{ gridColumn: '1 / 2', gridRow: '1 / 2' }}>
            <div className="panel-header">
              <span>GLOBAL ORBIT VIEW</span>
              <span className="text-mono text-accent blink">LIVE FEED • {telemetryRate} Mb/s</span>
            </div>
            <div className="panel-content" style={{ position: 'relative', overflow: 'hidden', background: 'transparent' }}>
              
              {/* Central Earth */}
              <div style={{ 
                position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                width: '100px', height: '100px', background: 'transparent', borderRadius: '50%',
                border: '1px solid #000',
                zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <div style={{ width: '100%', height: '1px', background: 'rgba(0,0,0,0.1)' }}></div>
                <div style={{ height: '100%', width: '1px', background: 'rgba(0,0,0,0.1)', position: 'absolute' }}></div>
              </div>

              {/* Render Background Satellites */}
              {satellites.map((sat, i) => {
                if (sat.id === riskSatellite?.id) return null; // Render risk satellite separately
                const size = 180 + (i * 60);
                return (
                  <div key={sat.id} className="orbit-ring" style={{ width: `${size}px`, height: `${size}px`, border: '1px solid rgba(0,0,0,0.1)', animation: `orbit-cw ${60 + i * 20}s linear infinite` }}>
                    <div 
                      onClick={() => setSelectedSatellite(sat)}
                      style={{ position: 'absolute', top: '-6px', left: '50%', color: '#000', fontSize: '10px', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                      <FaSatellite />
                      <span style={{ fontSize: '0.5rem', opacity: 0.5 }}>{sat.name}</span>
                    </div>
                  </div>
                );
              })}

              {/* HAZARD SCENARIO */}
              {riskSatellite && (
                <>
                  {/* 1. The Threat (Debris Field) - Animated Crossing Orbit */}
                  <div style={{ 
                    position: 'absolute', top: '50%', left: '50%', 
                    width: `${orbitSize}px`, height: `${orbitSize}px`,
                    transform: `translate(-50%, -50%) rotateZ(${debrisAngle}deg) rotateX(75deg)`, // 3D Tilted Orbit
                    transformStyle: 'preserve-3d',
                    zIndex: 5,
                    transition: 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)' // Bouncy transition
                  }}>
                    {/* The Orbit Path */}
                    <div style={{ 
                      width: '100%', height: '100%', 
                      border: '1px dashed #000', 
                      borderRadius: '50%',
                    }}></div>
                    
                    {/* The Moving Object (Meteor) */}
                    <div style={{ 
                      position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', 
                      animation: 'orbit-ccw 8s linear infinite' 
                    }}>
                      <div style={{ 
                        position: 'absolute', top: '-8px', left: '50%', 
                        color: '#000', fontSize: '14px',
                        transform: 'rotateX(-75deg)' // Counter-rotate icon to face viewer
                      }}>
                        <FaMeteor />
                      </div>
                    </div>
                  </div>

                  {/* 2. Original Path (Ghost) - Shows Collision Point */}
                  <div className="orbit-ring" style={{ 
                    width: `${orbitSize}px`, height: `${orbitSize}px`, 
                    border: deltaV > 0 ? '1px dashed #000' : '1px solid #000', 
                    opacity: deltaV > 0 ? 0.4 : 1,
                    zIndex: 15,
                    transition: 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)'
                  }}>
                    {/* Collision Marker (TCA) - Intersection Point */}
                    <div style={{ 
                      position: 'absolute', top: '14.65%', right: '14.65%', transform: 'translate(50%, -50%)',
                      display: 'flex', flexDirection: 'column', alignItems: 'center',
                      zIndex: 30
                    }}>
                      <div style={{ 
                        color: '#000', fontSize: '1.5rem', 
                        animation: 'blink 0.2s infinite'
                      }}>
                        <FaCrosshairs />
                      </div>
                      <div className="text-mono" style={{ 
                        color: '#fff', fontSize: '0.7rem', 
                        background: '#000', padding: '2px 4px', marginTop: '4px',
                        border: '1px solid #000'
                      }}>
                        IMPACT ZONE
                      </div>
                    </div>
                  </div>

                  {/* 3. Active Satellite (Maneuverable) */}
                  <div className="orbit-ring" style={{ 
                    width: `${orbitSize + (deltaV * 30)}px`, // Expands based on Delta V
                    height: `${orbitSize + (deltaV * 30)}px`,
                    border: `2px solid ${deltaV > 0 ? '#000' : 'transparent'}`,
                    transition: 'all 1s cubic-bezier(0.4, 0, 0.2, 1)',
                    animation: 'orbit-cw 25s linear infinite',
                    zIndex: 20
                  }}>
                    <div 
                      onClick={() => setSelectedSatellite(riskSatellite)}
                      style={{ position: 'absolute', top: '-8px', left: '50%', transform: 'translateX(-50%)', color: '#000', fontSize: '14px', display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }}>
                      <FaSatellite />
                      <span className="text-mono" style={{ fontSize: '0.6rem', marginTop: '2px', background: '#fff', border: '1px solid #000', padding: '2px 4px' }}>{riskSatellite.name}</span>
                      {deltaV > 0 && <span className="text-mono" style={{ position: 'absolute', left: '20px', top: '0', fontSize: '0.6rem', width: '120px', color: '#000', fontWeight: 'bold' }}>ORBIT RAISING...</span>}
                    </div>
                  </div>
                </>
              )}
              <div className="text-mono" style={{ position: 'absolute', bottom: '20px', left: '20px', fontSize: '0.8rem' }}>
                FOV: 120° <br/>
                TRACKING: 14,203 OBJECTS <br/>
                <span style={{ color: 'var(--color-alert)' }}>ACTIVE HAZARDS: 2</span>
              </div>
            </div>
          </div>

          {/* Widget: Risk Matrix */}
          <div className="panel" style={{ gridColumn: '1 / 2', gridRow: '2 / 3' }}>
            <div className="panel-header">
              <span>RISK ANALYSIS</span>
              <div style={{ display: 'flex', gap: '15px', fontSize: '0.8rem' }}>
                <span 
                  onClick={() => setRiskViewMode('matrix')}
                  style={{ cursor: 'pointer', color: riskViewMode === 'matrix' ? 'var(--color-accent)' : 'var(--color-text-muted)', fontWeight: riskViewMode === 'matrix' ? 'bold' : 'normal' }}
                >MATRIX</span>
                <span 
                  onClick={() => setRiskViewMode('pareto')}
                  style={{ cursor: 'pointer', color: riskViewMode === 'pareto' ? 'var(--color-accent)' : 'var(--color-text-muted)', fontWeight: riskViewMode === 'pareto' ? 'bold' : 'normal' }}
                >PARETO</span>
              </div>
            </div>
            <div className="panel-content" style={{ display: 'flex', gap: '20px' }}>
              
              {/* Left: Matrix Plot */}
              <div style={{ flex: 2, position: 'relative', margin: '10px 0 20px 40px' }}>
              {riskViewMode === 'matrix' ? (
              <div className="risk-matrix-bg" style={{ 
                width: '100%', height: '100%', 
                border: '2px solid var(--color-panel-border)', 
                position: 'relative',
              }}>
                {/* Grid Lines (Center) */}
                <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '1px', borderTop: '1px dashed rgba(0,0,0,0.3)' }}></div>
                <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: '1px', borderLeft: '1px dashed rgba(0,0,0,0.3)' }}></div>

                {/* Axis Labels & Grid Info */}
                <div className="text-mono" style={{ position: 'absolute', left: '-35px', bottom: '-6px', fontSize: '0.6rem', color: 'var(--color-text-muted)' }}>0%</div>
                <div className="text-mono" style={{ position: 'absolute', left: '-35px', top: '50%', transform: 'translateY(-50%)', fontSize: '0.6rem', color: 'var(--color-text-muted)' }}>50%</div>
                <div className="text-mono" style={{ position: 'absolute', left: '-40px', top: '-6px', fontSize: '0.6rem', color: 'var(--color-text-muted)' }}>100%</div>
                
                <div className="text-mono" style={{ position: 'absolute', bottom: '-25px', left: '-10px', fontSize: '0.6rem', color: 'var(--color-text-muted)' }}>LOW</div>
                <div className="text-mono" style={{ position: 'absolute', bottom: '-25px', left: '50%', transform: 'translateX(-50%)', fontSize: '0.6rem', color: 'var(--color-text-muted)' }}>MED</div>
                <div className="text-mono" style={{ position: 'absolute', bottom: '-25px', right: '-10px', fontSize: '0.6rem', color: 'var(--color-text-muted)' }}>HIGH</div>

                <div className="text-mono" style={{ position: 'absolute', top: '50%', left: '-60px', transform: 'rotate(-90deg) translateX(50%)', fontSize: '0.6rem', color: 'var(--color-text-muted)', letterSpacing: '1px', fontWeight: 'bold' }}>PROBABILITY</div>
                <div className="text-mono" style={{ position: 'absolute', bottom: '-40px', left: '50%', transform: 'translateX(-50%)', fontSize: '0.6rem', color: 'var(--color-text-muted)', letterSpacing: '1px', fontWeight: 'bold' }}>IMPACT SEVERITY</div>

                <div style={{ position: 'absolute', top: 0, right: 0, width: '50%', height: '50%', background: 'rgba(0, 0, 0, 0.05)', borderLeft: '1px dashed #000', borderBottom: '1px dashed #000', pointerEvents: 'none' }}></div>
                
                {risks.map(risk => (
                  <div key={risk.id} 
                    className="risk-point" 
                    onClick={() => { setSelectedRiskId(risk.id); setDeltaV(0); }}
                    style={{ 
                      bottom: `${(risk.id === selectedRiskId ? simulatedProb : risk.probability) * 100}%`, 
                      left: `${risk.impact * 10}%`,
                      backgroundColor: risk.id === selectedRiskId ? '#000' : '#fff',
                      border: '2px solid #000',
                      width: risk.id === selectedRiskId ? '16px' : '12px',
                      height: risk.id === selectedRiskId ? '16px' : '12px',
                      boxShadow: 'none',
                      transition: 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                      zIndex: risk.id === selectedRiskId ? 10 : 1
                    }} 
                  >
                    <div className="text-mono" style={{ 
                      position: 'absolute', 
                      top: '-22px', 
                      left: '50%', 
                      transform: 'translateX(-50%)', 
                      fontSize: '0.6rem', 
                      whiteSpace: 'nowrap', 
                      color: risk.id === selectedRiskId ? '#000' : 'var(--color-text-muted)', 
                      textShadow: 'none',
                      fontWeight: risk.id === selectedRiskId ? 'bold' : 'normal',
                      background: 'transparent',
                      padding: risk.id === selectedRiskId ? '2px 4px' : '0',
                      borderRadius: '2px'
                    }}>
                      {risk.object}
                    </div>
                  </div>
                ))}
              </div>
              ) : (
                <div style={{ width: '100%', height: '100%', position: 'relative', borderLeft: '1px solid #000', borderBottom: '1px solid #000' }}>
                  {/* Pareto Graph */}
                  <svg width="100%" height="100%" viewBox="0 0 300 150" style={{ overflow: 'visible' }}>
                    {/* Threshold Line (10^-6) */}
                    <line x1="0" y1="140" x2="300" y2="140" stroke="var(--color-accent)" strokeWidth="1" strokeDasharray="4" />

                    {/* Curve */}
                    <polyline 
                      points={generateParetoPoints()} 
                      fill="none" 
                      stroke="#000" 
                      strokeWidth="1.5" 
                    />

                    {/* Current Position Marker */}
                    <circle 
                      cx={(deltaV / 5) * 300} 
                      cy={150 - (simulatedProb * 150)} 
                      r="3" 
                      fill="var(--color-accent)" 
                    />
                  </svg>
                  
                  {/* Labels */}
                  <div className="text-mono" style={{ position: 'absolute', bottom: '-18px', right: '0', fontSize: '0.6rem', color: 'var(--color-text-muted)' }}>Δv</div>
                  <div className="text-mono" style={{ position: 'absolute', top: '-10px', left: '-15px', fontSize: '0.6rem', color: 'var(--color-text-muted)' }}>Pc</div>
                </div>
              )}
              </div>

              {/* Right: Simulation Controls */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                {currentRisk ? (
                  <>
                    <div>
                      <div className="text-mono text-accent" style={{ marginBottom: '5px', fontSize: '1.1rem' }}>{currentRisk.object} EVENT</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '15px' }}>COLLISION AVOIDANCE</div>

                      {/* Warning & Recommendation System */}
                      {!isSafe && (
                        <div className="warning-box">
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-alert)', fontWeight: 'bold', fontSize: '0.8rem', marginBottom: '4px' }}>
                            <FaExclamationTriangle /> COLLISION WARNING
                          </div>
                          <div style={{ fontSize: '0.75rem', marginBottom: '8px' }}>
                            Probability exceeds safety threshold. Immediate action required.
                          </div>
                          <div className="text-mono" style={{ fontSize: '0.75rem', color: 'var(--color-accent)' }}>
                            REC: BURN {currentRisk.recommendedDv} m/s
                          </div>
                        </div>
                      )}
                      <button className="btn-action" style={{ backgroundColor: '#ff3366', color: '#fff' }} onClick={() => setDeltaV(currentRisk.recommendedDv)}>EXECUTE MANEUVER</button>

                      {/* Secondary Collision Warning */}
                      {secondaryCollision && (
                        <div className="warning-box" style={{ borderColor: 'var(--color-warning)', background: 'rgba(255, 217, 102, 0.1)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-warning)', fontWeight: 'bold', fontSize: '0.8rem', marginBottom: '4px' }}>
                            <FaExclamationTriangle /> SECONDARY CONJUNCTION
                          </div>
                          <div style={{ fontSize: '0.75rem' }}>
                            Maneuver path intersects with {secondaryCollision}.
                          </div>
                        </div>
                      )}
                      
                      {/* Satellite Live Data */}
                      {riskSatellite && (
                        <div style={{ display: 'flex', gap: '10px', marginBottom: '15px', fontSize: '0.7rem' }}>
                          <div className="panel" style={{ padding: '5px', flex: 1, alignItems: 'center', border: '1px solid #000' }}>
                            <span className="text-muted">FUEL</span>
                            <span className={riskSatellite.fuel < 20 ? 'text-alert' : 'text-accent'}>{riskSatellite.fuel}%</span>
                          </div>
                          <div className="panel" style={{ padding: '5px', flex: 1, alignItems: 'center', border: '1px solid #000' }}>
                            <span className="text-muted">ALT</span>
                            <span>{riskSatellite.altitude} km</span>
                          </div>
                        </div>
                      )}

                      <label className="text-mono" style={{ fontSize: '0.8rem' }}>THRUST (Δv): {deltaV.toFixed(1)} m/s</label>
                      <input 
                        type="range" min="0" max="5" step="0.1" 
                        value={deltaV} 
                        onChange={(e) => setDeltaV(parseFloat(e.target.value))} 
                      />
                      {isSafe && (
                        <div className="text-mono" style={{ fontSize: '0.7rem', color: 'var(--color-accent)', marginTop: '5px', textAlign: 'right' }}>
                          OPTIMAL TRAJECTORY SET
                        </div>
                      )}

                      {deltaV > 0 && (
                        <div style={{ marginTop: '15px', padding: '10px', background: 'rgba(0, 0, 0, 0.05)', borderRadius: '0' }}>
                          <div className="text-mono" style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginBottom: '5px' }}>MANEUVER IMPACT</div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '4px' }}>
                            <span>FUEL CONSUMPTION</span>
                            <span style={{ color: 'var(--color-alert)' }}>-{ (deltaV * 2.5).toFixed(1) }%</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '4px' }}>
                            <span>NEW ALTITUDE</span>
                            <span className="text-accent">{ ((riskSatellite?.altitude || 0) + (deltaV * 5)).toFixed(1) } km</span>
                          </div>
                           <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                            <span>RISK REDUCTION</span>
                            <span className="text-accent">-{ ((currentRisk.probability - simulatedProb) * 100).toFixed(1) }%</span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div style={{ background: 'rgba(0,0,0,0.05)', padding: '10px', borderRadius: '0', border: '1px solid #000' }}>
                      <div className="text-mono" style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>PROJECTED RISK</div>
                      <div className="text-mono" style={{ fontSize: '1.5rem', color: simulatedProb < 0.05 ? 'var(--color-accent)' : 'var(--color-alert)' }}>
                        {(simulatedProb * 100).toFixed(1)}%
                      </div>
                      <div style={{ fontSize: '0.7rem', marginTop: '5px', color: simulatedProb < 0.05 ? 'var(--color-accent)' : 'var(--color-alert)' }}>
                        {simulatedProb < 0.05 ? 'WITHIN SAFETY MARGINS' : 'CRITICAL THRESHOLD EXCEEDED'}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-mono" style={{ color: 'var(--color-text-muted)', textAlign: 'center', marginTop: '20px' }}>SELECT A RISK EVENT</div>
                )}
              </div>
            </div>
          </div>

          {/* Widget: Alert Center */}
          <div className="panel" style={{ gridColumn: '2 / 3', gridRow: '1 / 2', borderColor: '#000' }}>
            <div className="panel-header" style={{ color: 'var(--color-alert)' }}>
              <span>ALERT CENTER</span>
              <span className="text-mono blink">LIVE</span>
            </div>
            <div className="panel-content">
              {alerts.map(alert => (
                <div key={alert.id} style={{ 
                  marginBottom: '1rem', 
                  borderLeft: `4px solid #000`, 
                  paddingLeft: '0.8rem',
                  background: 'rgba(0, 0, 0, 0.02)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--color-text-muted)' }} className="text-mono">
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {alert.severity === 'critical' && <FaExclamationTriangle color="var(--color-alert)" />}
                      {alert.severity === 'high' && <FaExclamationCircle color="var(--color-warning)" />}
                      {alert.severity === 'medium' && <FaInfoCircle color="var(--color-accent)" />}
                      {alert.type}
                    </span>
                    <span>{alert.timestamp}</span>
                  </div>
                  <div style={{ fontWeight: '500', marginTop: '0.2rem' }}>{alert.message}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Widget: Fuel Status Monitor */}
          <div className="panel" style={{ gridColumn: '2 / 3', gridRow: '2 / 3' }}>
            <div className="panel-header">
              <span>FUEL STATUS</span>
              <span className="text-mono text-accent">+12% SAVED</span>
            </div>
            <div className="panel-content">
              <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
                <div className="text-mono" style={{ fontSize: '2rem', fontWeight: 'bold' }}>78%</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>FLEET AVERAGE</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                {satellites.slice(0, 3).map(sat => (
                  <div key={sat.id} onClick={() => setSelectedSatellite(sat)} style={{ cursor: 'pointer' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '2px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FaSatellite color="var(--color-text-muted)" />
                        {sat.name}
                      </span>
                      <span className={sat.fuel < 50 ? 'text-alert' : 'text-accent'}>{sat.fuel}%</span>
                    </div>
                    <div className="fuel-track">
                      <div className="fuel-fill" style={{ width: `${sat.fuel}%`, background: '#000' }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
        ) : activeView === 'Assets' ? (
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', height: '100%' }}>
            <SatelliteCatalog />
            <GroundStationStatus />
          </div>
        ) : activeView === 'Karriere' ? (
          <CareerPage />
        ) : (
          <div className="panel" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
            <div className="panel-header" style={{ width: '100%', position: 'absolute', top: 0 }}>
              <span>{activeView.toUpperCase()}</span>
              <span className="text-mono">MODULE</span>
            </div>
            <div className="text-mono text-accent" style={{ fontSize: '2rem', textAlign: 'center' }}>
              <FaRocket style={{ marginBottom: '20px', fontSize: '3rem' }} /><br/>
              {activeView.toUpperCase()} VIEW
            </div>
            <div className="text-mono" style={{ color: 'var(--color-text-muted)', marginTop: '20px' }}>SYSTEM MODULE UNDER CONSTRUCTION</div>
          </div>
        )}

        <footer style={{ marginTop: 'auto', borderTop: '2px solid var(--color-panel-border)', paddingTop: '15px', display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-muted)', fontSize: '0.7rem' }} className="text-mono">
          <div>© 2024 COSMA ORBITAL SYSTEMS GMBH // BERLIN</div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <span style={{ cursor: 'pointer' }}>IMPRESSUM</span>
            <span style={{ cursor: 'pointer' }}>DATENSCHUTZ</span>
            <span style={{ cursor: 'pointer' }}>AGB</span>
            <span style={{ cursor: 'pointer' }}>SYSTEM STATUS</span>
          </div>
        </footer>
      </main>

      {/* Subscription Modal */}
      {showSubscriptionModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(5px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div className="panel" style={{ width: '900px', maxHeight: '90vh', overflowY: 'auto', border: '2px solid #000', background: '#fff' }}>
            <div className="panel-header">
              <span>UPGRADE TO WEAVER</span>
              <FaTimes style={{ cursor: 'pointer', color: 'var(--color-text-muted)' }} onClick={() => setShowSubscriptionModal(false)} />
            </div>
            <div className="panel-content" style={{ display: 'flex', gap: '20px', padding: '40px' }}>
              {/* Plan 1 */}
              <div style={{ flex: 1, border: '2px solid #000', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'transparent' }}>
                <h3 className="text-mono" style={{ color: 'var(--color-text-muted)', letterSpacing: '2px' }}>STARTER</h3>
                <div className="text-mono" style={{ fontSize: '2rem', margin: '20px 0' }}>$499<span style={{ fontSize: '1rem', color: 'var(--color-text-muted)' }}>/mo</span></div>
                <ul style={{ listStyle: 'none', textAlign: 'left', width: '100%', marginBottom: '30px', color: 'var(--color-text-muted)', fontSize: '0.8rem', lineHeight: '1.8' }}>
                   <li><FaCheck style={{ color: 'var(--color-accent)', marginRight: '8px' }}/> LEO Tracking Only</li>
                   <li><FaCheck style={{ color: 'var(--color-accent)', marginRight: '8px' }}/> 24h Data Retention</li>
                   <li><FaCheck style={{ color: 'var(--color-accent)', marginRight: '8px' }}/> Email Support</li>
                </ul>
                <button className="btn-action" style={{ background: 'transparent', border: '2px solid #000', color: '#000' }}>SELECT</button>
              </div>
              {/* Plan 2 (Pro) */}
              <div style={{ flex: 1, border: '4px solid #000', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#f0f0f0', transform: 'scale(1.05)', boxShadow: 'none' }}>
                <div style={{ position: 'absolute', top: '-12px', background: '#000', color: '#fff', fontSize: '0.7rem', padding: '2px 8px', fontWeight: 'bold', borderRadius: '0' }}>RECOMMENDED</div>
                <h3 className="text-accent" style={{ letterSpacing: '2px' }}>WEAVER PRO</h3>
                <div className="text-mono" style={{ fontSize: '2.5rem', margin: '20px 0', color: '#000' }}>$1,299<span style={{ fontSize: '1rem', color: 'var(--color-text-muted)' }}>/mo</span></div>
                 <ul style={{ listStyle: 'none', textAlign: 'left', width: '100%', marginBottom: '30px', color: '#000', fontSize: '0.8rem', lineHeight: '1.8' }}>
                   <li><FaCheck style={{ color: 'var(--color-accent)', marginRight: '8px' }}/> All Orbits (LEO/GEO/HEO)</li>
                   <li><FaCheck style={{ color: 'var(--color-accent)', marginRight: '8px' }}/> Real-time Collision Avoidance</li>
                   <li><FaCheck style={{ color: 'var(--color-accent)', marginRight: '8px' }}/> Maneuver Simulation</li>
                   <li><FaCheck style={{ color: 'var(--color-accent)', marginRight: '8px' }}/> API Access</li>
                </ul>
                <button className="btn-action" style={{ background: '#000', color: '#fff' }}>UPGRADE NOW</button>
              </div>
               {/* Plan 3 */}
               <div style={{ flex: 1, border: '2px solid #000', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'transparent' }}>
                <h3 className="text-mono" style={{ color: 'var(--color-text-muted)', letterSpacing: '2px' }}>ENTERPRISE</h3>
                <div className="text-mono" style={{ fontSize: '2rem', margin: '20px 0' }}>CUSTOM</div>
                 <ul style={{ listStyle: 'none', textAlign: 'left', width: '100%', marginBottom: '30px', color: 'var(--color-text-muted)', fontSize: '0.8rem', lineHeight: '1.8' }}>
                   <li><FaCheck style={{ color: 'var(--color-accent)', marginRight: '8px' }}/> Dedicated Analyst</li>
                   <li><FaCheck style={{ color: 'var(--color-accent)', marginRight: '8px' }}/> On-Premise Deployment</li>
                   <li><FaCheck style={{ color: 'var(--color-accent)', marginRight: '8px' }}/> 24/7 Priority Support</li>
                   <li><FaCheck style={{ color: 'var(--color-accent)', marginRight: '8px' }}/> Custom Integrations</li>
                </ul>
                <button className="btn-action" style={{ background: 'transparent', border: '2px solid #000', color: '#000' }}>CONTACT</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Satellite Details Modal */}
      {selectedSatellite && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(5px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div className="panel" style={{ width: '400px', border: '2px solid #000', background: '#fff' }}>
            <div className="panel-header">
              <span>SATELLITE DIAGNOSTICS</span>
              <FaTimes style={{ cursor: 'pointer', color: 'var(--color-text-muted)' }} onClick={() => setSelectedSatellite(null)} />
            </div>
            <div className="panel-content" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
                <div style={{ fontSize: '2rem', color: 'var(--color-accent)' }}><FaSatellite /></div>
                <div>
                  <div className="text-mono" style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{selectedSatellite.name}</div>
                  <div className="text-mono" style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>ID: {selectedSatellite.id}</div>
                </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div>
                  <div className="text-mono" style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>STATUS</div>
                  <div className={`text-mono ${selectedSatellite.status === 'nominal' ? 'text-accent' : 'text-alert'}`} style={{ fontSize: '1rem' }}>
                    {selectedSatellite.status.toUpperCase()}
                  </div>
                </div>
                <div>
                  <div className="text-mono" style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>ORBIT</div>
                  <div className="text-mono" style={{ fontSize: '1rem' }}>{selectedSatellite.orbit}</div>
                </div>
                <div>
                  <div className="text-mono" style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>ALTITUDE</div>
                  <div className="text-mono" style={{ fontSize: '1rem' }}>{selectedSatellite.altitude} km</div>
                </div>
                <div>
                  <div className="text-mono" style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>FUEL</div>
                  <div className="text-mono" style={{ fontSize: '1rem' }}>{selectedSatellite.fuel}%</div>
                </div>
              </div>

              <div style={{ marginTop: '20px', paddingTop: '15px', borderTop: '1px solid rgba(0,0,0,0.1)' }}>
                 <button className="btn-action" onClick={() => setSelectedSatellite(null)}>CLOSE DIAGNOSTICS</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;