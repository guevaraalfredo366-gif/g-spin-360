'use client';

import { useState } from 'react';
import EventModal from './EventModal';
import LicenseExpiredModal from './LicenseExpiredModal';

export default function CreateEventButton({ expired }: { expired: boolean }) {
  const [showExpired, setShowExpired] = useState(false);
  const [showModal,   setShowModal]   = useState(false);

  const handleClick = () => {
    if (expired) { setShowExpired(true); return; }
    setShowModal(true);
  };

  return (
    <>
      <button
        onClick={handleClick}
        style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          padding: '8px 14px', borderRadius: '10px', fontSize: '12px', fontWeight: 700,
          background: '#9D7CFF', color: '#ffffff', border: 'none', cursor: 'pointer',
        }}
      >
        + Crear evento
      </button>

      {showExpired && <LicenseExpiredModal onClose={() => setShowExpired(false)} />}
      {showModal   && <EventModal mode="create" onClose={() => setShowModal(false)} />}
    </>
  );
}
