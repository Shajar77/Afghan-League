const activeVariant = import.meta.env.VITE_SITE_VARIANT || 'main';

const configPresets = {
  main: {
    SHOW_ABOUT: true,
    SHOW_TEAMS: true,
    SHOW_FIXTURES: true,
    SHOW_POINTS_TABLE: true,
    SHOW_MOMENTS: true,
    SHOW_LAUNCH_EVENT: true,
    SHOW_NEWS: true,
    SHOW_GALLERY: true,
    SHOW_PARTNERSHIPS: true,
    SHOW_CONTACT: true,
    SHOW_REGISTRATION: true,
    SHOW_TEAM_LOGOS: true,
    SHOW_MATCH_TICKER: true,
    SHOW_HIGHLIGHTS: true,
    SHOW_MORE_ABOUT_APL: true,
    SHOW_LEAGUE_FAQ: true,
    SHOW_MEDIA_KIT: true,
  },
  variant: {
    SHOW_ABOUT: true,
    SHOW_TEAMS: false,
    SHOW_FIXTURES: false,
    SHOW_POINTS_TABLE: false,
    SHOW_MOMENTS: true,
    SHOW_LAUNCH_EVENT: true,
    SHOW_NEWS: true,
    SHOW_GALLERY: false,
    SHOW_PARTNERSHIPS: true,
    SHOW_CONTACT: true,
    SHOW_REGISTRATION: true,
    SHOW_TEAM_LOGOS: false,
    SHOW_MATCH_TICKER: false,
    SHOW_HIGHLIGHTS: false,
    SHOW_MORE_ABOUT_APL: false,
    SHOW_LEAGUE_FAQ: false,
    SHOW_MEDIA_KIT: false,
  }
};

export const FEATURES = configPresets[activeVariant as 'main' | 'variant'] || configPresets.main;
