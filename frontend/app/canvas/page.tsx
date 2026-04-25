import { Suspense } from "react";
import { SkeletonLayout } from "@/components/overlays/SkeletonLayout";
import { CanvasClient } from "./CanvasClient";

export default function CanvasPage() {
  return (
    <Suspense fallback={<SkeletonLayout />}>
      <CanvasClient />
    </Suspense>
  );
}
