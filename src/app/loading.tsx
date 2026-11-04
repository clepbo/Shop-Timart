import { Loader } from "@/components/layout/Loader";

export default function Loading() {
  return (
    <div className="grid min-h-[70vh] place-items-center">
      <Loader />
    </div>
  );
}
