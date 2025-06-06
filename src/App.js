import { useState, useEffect } from 'react';
import styles from './App.module.scss';

function App() {
  const [medicines, setMedicines] = useState([]);
  const [name, setName] = useState('');
  const [time, setTime] = useState('');
  const [dosage, setDosage] = useState('');
  const [strictMode, setStrictMode] = useState(false);
  const [alarmPlaying, setAlarmPlaying] = useState(false);

  // Alarm sesi efekti
  useEffect(() => {
    if (alarmPlaying) {
      const timer = setTimeout(() => setAlarmPlaying(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [alarmPlaying]);

  const addMedicine = (e) => {
    e.preventDefault();
    setMedicines([...medicines, { 
      id: Date.now(), 
      name, 
      time, 
      dosage,
      taken: false 
    }]);
    resetForm();
  };

  const resetForm = () => {
    setName('');
    setTime('');
    setDosage('');
  };

  const deleteMedicine = (id) => {
    setMedicines(medicines.filter(med => med.id !== id));
  };

  const toggleTaken = (id) => {
    setMedicines(medicines.map(med => 
      med.id === id ? { ...med, taken: !med.taken } : med
    ));
  };

  const checkAlarms = () => {
    const now = new Date();
    const currentTime = now.toTimeString().substring(0, 5);
    
    medicines.forEach(med => {
      if (med.time === currentTime && !med.taken && strictMode) {
        setAlarmPlaying(true);
        // Gerçek uygulamada bildirim API'si kullanılabilir
        alert(`🚨 ${med.name} not yet! (${med.dosage})`);
      }
    });
  };

  // Her dakika kontrol yap
  useEffect(() => {
    const interval = setInterval(checkAlarms, 60000);
    return () => clearInterval(interval);
  }, [medicines, strictMode]);

  return (
    <div className={styles.app}>
      <h1 className={styles.title}>💊 Smart Medication Reminder</h1>
      
      <div className={styles.strictModeToggle}>
        <label>
          <input 
            type="checkbox" 
            checked={strictMode} 
            onChange={() => setStrictMode(!strictMode)} 
          />
          Strict Mode {strictMode ? '🔔' : '🔕'}
        </label>
        {alarmPlaying && <div className={styles.alarmIndicator}>ALARM ÇALIYOR!</div>}
      </div>

      <form onSubmit={addMedicine} className={styles.form}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Medicine is taken"
          required
        />
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          required
        />
        <input
          type="text"
          value={dosage}
          onChange={(e) => setDosage(e.target.value)}
          placeholder="Doz (örn: 1 tablet)"
          required
        />
        <button type="submit">Add</button>
      </form>

      <div className={styles.medicineList}>
        {medicines.map(medicine => (
          <div 
            key={medicine.id} 
            className={`${styles.medicineCard} ${medicine.taken ? styles.taken : ''}`}
          >
            <div>
              <h3>{medicine.name}</h3>
              <p>⏰ {medicine.time}</p>
              <p>💊 {medicine.dosage}</p>
            </div>
            <div className={styles.actions}>
              <button 
                onClick={() => toggleTaken(medicine.id)}
                className={styles.takenBtn}
              >
                {medicine.taken ? '✓ Medicine is taken' : 'not yet'}
              </button>
              <button 
                onClick={() => deleteMedicine(medicine.id)}
                className={styles.deleteBtn}
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;