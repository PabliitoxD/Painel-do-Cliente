"use client";

import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    window.location.href = '/login';
  }, []);

  return (
    <div style={{ backgroundColor: '#0B0F19', height: '100vh' }}>
      {/* Loading state or simple redirect */}
    </div>
  );
}
