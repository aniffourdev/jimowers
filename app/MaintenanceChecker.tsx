'use client'; // Mark this component as a Client Component

import { useState, useEffect } from 'react';

interface MaintenanceCheckerProps {
  children: React.ReactNode;
}

export default function MaintenanceChecker({ children }: MaintenanceCheckerProps) {
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkMaintenanceMode() {
      try {
        const response = await fetch('https://jimowers.infy.uk/wp-json/myplugin/v1/maintenance-mode');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setMaintenanceMode(data.maintenance_mode);
      } catch (error) {
        console.error('Error checking maintenance mode:', error);
      } finally {
        setLoading(false);
      }
    }

    checkMaintenanceMode();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  const maintenanceModeStyles = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f0f0f0',
    fontFamily: 'Arial, sans-serif',
  };

  return maintenanceMode ? (
    <div style={maintenanceModeStyles}>
      <div>
        <h1>Website Under Maintenance</h1>
        <p style={{ textAlign: 'center' }}>Please check back later.</p>
      </div>
    </div>
  ) : (
    <>{children}</>
  );
}