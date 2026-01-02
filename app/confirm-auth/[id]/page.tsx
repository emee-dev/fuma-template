"use client";

import { useState, use } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { GalleryVerticalEnd, Loader2, CheckCircle } from "lucide-react";

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<any>;
};

export default function ConfirmLoginPage(props: PageProps) {
  const sessionId = use(props.params).id;

  const [isLoading, setLoading] = useState(false);
  const [isConfirmed, setConfirmed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Simulate setting a session cookie via your API
  const handleConfirmLogin = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/persist-session", {
        method: "POST",
        // From Path Params
        body: JSON.stringify({ sessionId }),
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) throw new Error("Failed to confirm login");

      setConfirmed(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-6 p-6 bg-muted min-h-svh md:p-10">
      <div className="flex flex-col w-full max-w-sm gap-6">
        <a href="#" className="flex items-center self-center gap-2 font-medium">
          <div className="flex items-center justify-center rounded-md bg-primary text-primary-foreground size-6">
            <GalleryVerticalEnd className="size-4" />
          </div>
          Fuma Studio
        </a>
        {/* <ConfirmationPage sessionId={sessionId} /> */}

        <div className={"flex flex-col gap-6"}>
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-xl">Confirm your login</CardTitle>
              <CardDescription>
                Click below to confirm login and continue to your workspace.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center gap-4">
                {isConfirmed ? (
                  <Button disabled className="w-full">
                    <CheckCircle className="mr-2 size-4" />
                    Login Confirmed
                  </Button>
                ) : (
                  <Button
                    className="w-full"
                    disabled={isLoading}
                    onClick={handleConfirmLogin}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 size-4 animate-spin" />
                        Confirming...
                      </>
                    ) : (
                      "Confirm Login"
                    )}
                  </Button>
                )}
                {error && (
                  <p className="text-sm text-center text-red-500">{error}</p>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
            By confirming, you agree to our <a href="#">Terms of Service</a> and{" "}
            <a href="#">Privacy Policy</a>.
          </div>
        </div>
      </div>
    </div>
  );
}
