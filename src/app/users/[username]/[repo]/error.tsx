"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-32 text-center">
      <AlertTriangle className="text-muted-foreground size-10" />
      <h1 className="mt-4 text-xl font-semibold">Something went wrong</h1>
      <p className="text-muted-foreground mt-2 text-sm">
        {error.message.includes("rate limit")
          ? "GitHub's API rate limit was hit. Please try again in a minute."
          : "We couldn't load this repository. Please try again."}
      </p>
      <Button className="mt-6" onClick={() => reset()}>
        Try again
      </Button>
    </div>
  );
}
