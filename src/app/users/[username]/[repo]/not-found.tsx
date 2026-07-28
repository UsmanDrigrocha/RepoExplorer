import Link from "next/link";
import { FolderX } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-32 text-center">
      <FolderX className="text-muted-foreground size-10" />
      <h1 className="mt-4 text-xl font-semibold">Repository not found</h1>
      <p className="text-muted-foreground mt-2 text-sm">
        This repository doesn&apos;t exist or isn&apos;t public.
      </p>
      <Button render={<Link href="/" />} className="mt-6">
        Back to search
      </Button>
    </div>
  );
}
