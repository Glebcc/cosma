import { FaCode, FaGraduationCap, FaArrowRight, FaServer, FaDatabase } from 'react-icons/fa';

const jobs = [
  {
    id: 1,
    title: 'SENIOR SOFTWARE ENGINEER',
    type: 'FULL-TIME',
    location: 'BERLIN',
    department: 'SYSTEMS',
    icon: <FaServer />,
    description: 'Architect scalable distributed systems for real-time orbital data processing.'
  },
  {
    id: 2,
    title: 'SOFTWARE ENGINEER (FRONTEND)',
    type: 'FULL-TIME',
    location: 'REMOTE',
    department: 'PRODUCT',
    icon: <FaCode />,
    description: 'Build mission-critical dashboards and visualization tools for satellite operators.'
  },
  {
    id: 3,
    title: 'WERKSTUDENT: SOFTWARE ENGINEERING',
    type: 'PART-TIME',
    location: 'BERLIN / REMOTE',
    department: 'ENGINEERING',
    icon: <FaGraduationCap />,
    description: 'Support our core team in developing and testing new features for the COSMA platform.'
  },
  {
    id: 4,
    title: 'WERKSTUDENT: DATA SCIENCE',
    type: 'PART-TIME',
    location: 'BERLIN',
    department: 'ANALYTICS',
    icon: <FaDatabase />,
    description: 'Assist in analyzing large datasets of orbital debris and improving collision probability models.'
  }
];

const CareerPage = () => {
  return (
    <div className="panel" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="panel-header">
        <span>OPEN POSITIONS</span>
        <span className="text-mono text-accent">JOIN COSMA</span>
      </div>
      <div className="panel-content" style={{ padding: '30px', overflowY: 'auto' }}>
        <div style={{ marginBottom: '40px' }}>
          <h2 className="text-mono" style={{ fontSize: '2rem', marginBottom: '10px' }}>MISSION CONTROL NEEDS YOU</h2>
          <p style={{ maxWidth: '600px', color: 'var(--color-text-muted)', lineHeight: '1.6' }}>
            We are building the operating system for the new space age. Join us in solving the hardest problems in orbital mechanics and distributed systems to ensure a sustainable future in space.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {jobs.map(job => (
            <div key={job.id} className="career-card" style={{ 
              border: '1px solid rgba(0,0,0,0.1)', 
              padding: '25px', 
              display: 'flex', 
              flexDirection: 'column',
              justifyContent: 'space-between',
              background: '#fff',
              transition: 'all 0.2s ease'
            }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                  <div style={{ fontSize: '1.5rem', color: 'var(--color-accent)' }}>{job.icon}</div>
                  <span className="text-mono" style={{ fontSize: '0.7rem', border: '1px solid #000', padding: '4px 8px' }}>{job.type}</span>
                </div>
                <h3 className="text-mono" style={{ fontSize: '1.1rem', marginBottom: '5px', fontWeight: 'bold' }}>{job.title}</h3>
                <div className="text-mono" style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '15px' }}>
                  {job.department} // {job.location}
                </div>
                <p style={{ fontSize: '0.9rem', color: '#444', marginBottom: '25px', lineHeight: '1.5' }}>
                  {job.description}
                </p>
              </div>
              <button className="btn-action" style={{ background: 'transparent', border: '1px solid #000', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                APPLY <FaArrowRight />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CareerPage;