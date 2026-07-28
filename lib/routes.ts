import {
  demoJoinUrl,
  demoPrice,
  getOverflowRoomUrl,
  overflowPrice,
} from "@/lib/config";
import { createDemoAdmission, demoAdmissionSchema } from "@/lib/demo";
import { createOverflowAccess, overflowAccessSchema } from "@/lib/overflow";
import { router } from "@/lib/router";

const overflowRoomUrl = getOverflowRoomUrl();

if (overflowRoomUrl) {
  router
    .route({ path: "overflow", method: "GET" })
    .paid(overflowPrice)
    .description("Unlock a private virtual-overflow prototype room")
    .output(overflowAccessSchema)
    .handler(async ({ payment }) => {
      if (!payment) throw new Error("Verified payment context is required");

      return createOverflowAccess(payment, overflowRoomUrl);
    });
} else {
  router
    .route({ path: "overflow", method: "GET" })
    .unprotected()
    .handler(async () =>
      Response.json(
        { error: "Virtual overflow room is not configured" },
        { status: 503 },
      ),
    );
}

router
  .route({ path: "demo", method: "GET" })
  .paid(demoPrice)
  .description("Pay once for virtual admission to Agentic Commerce Demo Day")
  .output(demoAdmissionSchema)
  .handler(async ({ payment }) => {
    if (!payment) {
      throw new Error("Verified payment context is required for admission");
    }

    return createDemoAdmission(payment, demoJoinUrl);
  });
