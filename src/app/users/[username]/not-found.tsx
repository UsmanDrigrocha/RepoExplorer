import Link from "next/link";
import { UserX } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-32 text-center">
      <UserX className="text-muted-foreground size-10" />
      <h1 className="mt-4 text-xl font-semibold">User not found</h1>
      <p className="text-muted-foreground mt-2 text-sm">
        We couldn&apos;t find a GitHub user with that username.
      </p>
      <Button render={<Link href="/" />} className="mt-6">
        Back to search
      </Button>
    </div>
  );
}
