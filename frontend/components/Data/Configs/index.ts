import EventsConfig from './Events';
import ProfilesConfig from './Profiles';
import TeamsConfig from './Teams';
import { AnyConfig } from './types';

const tableConfigs: Record<string, AnyConfig | undefined> = {
  teams: TeamsConfig,
  events: EventsConfig,
  profiles: ProfilesConfig,
};

export default tableConfigs;
