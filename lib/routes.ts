import { demoJoinUrl, demoPrice } from "@/lib/config";
import { createDemoAdmission, demoAdmissionSchema } from "@/lib/demo";
import { router } from "@/lib/router";

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
