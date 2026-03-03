import { PROPERTIES_FIXTURE } from "./properties";

export const HOME_FIXTURE = {
  sections: {
    newThisWeek: PROPERTIES_FIXTURE.slice(0, 4),
    nearby: PROPERTIES_FIXTURE.slice(4, 8),
    forYou: PROPERTIES_FIXTURE.slice(8, 12),
  },
};