import "@/lib/routes";

import { nextHandlers } from "@agentcash/router/next";

import { router } from "@/lib/router";

export const { GET, POST, PUT, PATCH, DELETE } = nextHandlers(router);
