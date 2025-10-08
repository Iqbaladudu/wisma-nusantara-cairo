import * as migration_20250720_183229 from './20250720_183229';
import * as migration_20250720_183652 from './20250720_183652';
import * as migration_20250720_184327 from './20250720_184327';
import * as migration_20250720_184537 from './20250720_184537';
import * as migration_20250720_191936 from './20250720_191936';
import * as migration_20250720_193442 from './20250720_193442';
import * as migration_20250720_193802 from './20250720_193802';
import * as migration_20250724_143637 from './20250724_143637';
import * as migration_20250724_143905 from './20250724_143905';
import * as migration_20251008_065241 from './20251008_065241';

export const migrations = [
  {
    up: migration_20250720_183229.up,
    down: migration_20250720_183229.down,
    name: '20250720_183229',
  },
  {
    up: migration_20250720_183652.up,
    down: migration_20250720_183652.down,
    name: '20250720_183652',
  },
  {
    up: migration_20250720_184327.up,
    down: migration_20250720_184327.down,
    name: '20250720_184327',
  },
  {
    up: migration_20250720_184537.up,
    down: migration_20250720_184537.down,
    name: '20250720_184537',
  },
  {
    up: migration_20250720_191936.up,
    down: migration_20250720_191936.down,
    name: '20250720_191936',
  },
  {
    up: migration_20250720_193442.up,
    down: migration_20250720_193442.down,
    name: '20250720_193442',
  },
  {
    up: migration_20250720_193802.up,
    down: migration_20250720_193802.down,
    name: '20250720_193802',
  },
  {
    up: migration_20250724_143637.up,
    down: migration_20250724_143637.down,
    name: '20250724_143637',
  },
  {
    up: migration_20250724_143905.up,
    down: migration_20250724_143905.down,
    name: '20250724_143905',
  },
  {
    up: migration_20251008_065241.up,
    down: migration_20251008_065241.down,
    name: '20251008_065241'
  },
];
