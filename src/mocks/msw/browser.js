import { setupWorker } from "msw/browser";
import { homeHandlers } from "./handlers/home.handlers";
import { propertiesHandlers } from "./handlers/properties.handlers";
import { profileHandlers } from "./handlers/profile.handlers";
import { precheckHandlers } from "./handlers/precheck.handlers";
import { notificationsHandlers } from "./handlers/notifications.handlers";
import { authHandlers } from "./handlers/auth.handlers"; // ✅ add

export const worker = setupWorker(
  ...homeHandlers,
  ...propertiesHandlers,
  ...profileHandlers,
  ...precheckHandlers,
  ...notificationsHandlers,
  ...authHandlers // ✅ add
);