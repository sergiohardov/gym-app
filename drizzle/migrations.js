// This file is required for Expo/React Native SQLite migrations - https://orm.drizzle.team/quick-sqlite/expo

import journal from './meta/_journal.json';
import m0000 from './0000_black_catseye.sql';
import m0001 from './0001_fixed_millenium_guard.sql';
import m0002 from './0002_tidy_texas_twister.sql';
import m0003 from './0003_wide_proteus.sql';
import m0004 from './0004_redundant_marvel_apes.sql';
import m0005 from './0005_opposite_valeria_richards.sql';
import m0006 from './0006_bouncy_loners.sql';

  export default {
    journal,
    migrations: {
      m0000,
m0001,
m0002,
m0003,
m0004,
m0005,
m0006
    }
  }
  