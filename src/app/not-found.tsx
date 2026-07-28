import Link from "next/link";
import { Compass } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-32 text-center">
      <Compass className="text-muted-foreground size-10" />
      <h1 className="mt-4 text-xl font-semibold">Page not found</h1>
      <p className="text-muted-foreground mt-2 text-sm">
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Button render={<Link href="/" />} className="mt-6">
        Back home
      </Button>
    </div>
  );
}
