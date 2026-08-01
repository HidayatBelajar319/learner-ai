import { create } from 'zustand';
import { api } from '@/lib/api';
import { makePalette, rgbTriplet, hexToRgb, isLightColor } from '@/lib/ui/palette';

export interface UiSettings {
  accent: string;
  sidebar_bg: string;
  sidebar_text: string;
  font: string;
  radius: number;
}

export interface CustomPage {
  id: string;
  title: string;
  icon: string;
  content: string;
  created_at: string;
  updated_at: string;
}

const DEFAULTS: UiSettings = {
  accent: '#4F46E5',
  sidebar_bg: '#ffffff',
  sidebar_text: '#374151',
  font: 'Inter',
  radius: 12,
};

/** Terapkan pengaturan sebagai CSS variables pada <html>. */
function applyCssVars(settings: UiSettings) {
  const root = document.documentElement;
  const palette = makePalette(settings.accent);
  const { r, g, b } = hexToRgb(settings.accent);

  root.style.setProperty('--primary', palette.DEFAULT);
  ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900'].forEach((shade) => {
    root.style.setProperty(`--primary-${shade}`, palette[shade]);
  });

  root.style.setProperty('--ui-accent', rgbTriplet(r, g, b));
  root.style.setProperty('--ui-sidebar-bg', settings.sidebar_bg);
  root.style.setProperty('--ui-sidebar-text', settings.sidebar_text);
  root.style.setProperty('--ui-sidebar-active-text', settings.accent);
  root.style.setProperty('--ui-sidebar-active-bg', isLightColor(settings.sidebar_bg) ? '#EEEEFF' : 'rgba(255,255,255,0.12)');
  root.style.setProperty('--ui-radius', `${settings.radius}px`);

  if (settings.font && settings.font !== 'Inter') {
    root.style.setProperty('font-family', `'${settings.font}', ui-sans-serif, system-ui, sans-serif`);
  } else {
    root.style.removeProperty('font-family');
  }
}

interface UiState {
  settings: UiSettings;
  pages: CustomPage[];
  loaded: boolean;
  load: (token: string | null) => Promise<void>;
  saveSettings: (token: string | null, patch: Partial<UiSettings>) => Promise<UiSettings>;
  addPage: (token: string | null, page: { title: string; icon?: string; content?: string }) => Promise<void>;
  removePage: (token: string | null, id: string) => Promise<void>;
  reset: () => void;
}

export const useUiStore = create<UiState>((set, get) => ({
  settings: { ...DEFAULTS },
  pages: [],
  loaded: false,

  load: async (token) => {
    if (!token) return;
    try {
      const [sres, pres] = await Promise.all([
        api.get<{ success: boolean; data: Partial<UiSettings> }>('/ui/settings', token),
        api.get<{ success: boolean; data: CustomPage[] }>('/ui/pages', token),
      ]);
      const settings: UiSettings = { ...DEFAULTS, ...(sres.data || {}) };
      applyCssVars(settings);
      set({ settings, pages: pres.data || [], loaded: true });
    } catch {
      set({ loaded: true });
    }
  },

  saveSettings: async (token, patch) => {
    const next: UiSettings = { ...get().settings, ...patch };
    if (token) {
      try {
        await api.put('/ui/settings', { ...patch }, token);
      } catch {
        // tetap terapkan lokal bila penyimpanan gagal
      }
    }
    applyCssVars(next);
    set({ settings: next });
    return next;
  },

  addPage: async (token, page) => {
    if (!token) return;
    await api.post<{ success: boolean; data: { id: string } }>('/ui/pages', { ...page, content: page.content || '' }, token);
    await get().load(token);
  },

  removePage: async (token, id) => {
    if (!token) return;
    await api.delete(`/ui/pages/${id}`, token);
    await get().load(token);
  },

  reset: () => set({ settings: { ...DEFAULTS }, pages: [], loaded: false }),
}));

export { DEFAULTS as UI_DEFAULTS };
