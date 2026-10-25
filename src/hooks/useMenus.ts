'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

export type MenuNode = {
  id: string;
  label: string;
  url: string;
  ordre: number;
  openInNewTab: boolean;
  parentId: string | null;
  children?: MenuNode[];
};

export type MenuLocation = 'header' | 'footer' | 'footer-secondary';

export function useMenus(location: MenuLocation) {
  const [items, setItems] = useState<MenuNode[] | null>(null);

  useEffect(() => {
    let active = true;
    api
      .get(`/menus/${location.replace('-', '_')}`)
      .then((res) => {
        if (active) setItems(Array.isArray(res.data) ? res.data : []);
      })
      .catch(() => {
        if (active) setItems([]);
      });
    return () => {
      active = false;
    };
  }, [location]);

  return items;
}
