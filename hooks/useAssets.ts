'use client';

import { useState, useEffect } from 'react';

export interface Asset {
  id:          string;
  label:       string;
  desc?:       string;
  publicId:    string;
  durationSec: number | null;
  order:       number;
}

export interface AssetMap {
  frame: Asset[];
  music: Asset[];
  intro: Asset[];
  outro: Asset[];
}

const NONE: Record<string, Asset> = {
  frame: { id: '_none', label: 'Sin marco',  publicId: '__none__', durationSec: null, order: 0 },
  music: { id: '_none', label: 'Sin música', publicId: '__none__', durationSec: null, order: 0 },
  intro: { id: '_none', label: 'Sin intro',  publicId: '__none__', durationSec: null, order: 0 },
  outro: { id: '_none', label: 'Sin outro',  publicId: '__none__', durationSec: null, order: 0 },
};

const INITIAL: AssetMap = {
  frame: [NONE.frame],
  music: [NONE.music],
  intro: [NONE.intro],
  outro: [NONE.outro],
};

/**
 * Fetches asset list from /api/assets (server-side Cloudinary Admin API proxy).
 * Assets are loaded from Cloudinary folders — no Firestore collection required.
 * Prepends "Sin xxx" sentinel row to each category for the no-asset selection.
 */
export function useAssets(): { assets: AssetMap; loading: boolean } {
  const [assets,  setAssets]  = useState<AssetMap>(INITIAL);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/assets')
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled) {
          setAssets({
            frame: [NONE.frame, ...(data.frame ?? [])],
            music: [NONE.music, ...(data.music ?? [])],
            intro: [NONE.intro, ...(data.intro ?? [])],
            outro: [NONE.outro, ...(data.outro ?? [])],
          });
          setLoading(false);
        }
      })
      .catch(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  return { assets, loading };
}
