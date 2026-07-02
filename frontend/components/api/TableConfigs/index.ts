import EventsConfig from './EventsConfig';
import ProfilesConfig from './ProfilesConfig';
import TeamsConfig from './TeamsConfig';
import { AnyConfig } from './types';

export const tableConfigs: Record<string, AnyConfig | undefined> = {
  teams: TeamsConfig,
  events: EventsConfig,
  profiles: ProfilesConfig,
};
