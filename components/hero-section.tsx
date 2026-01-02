import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HeroHeader } from "./header";
import Image from "next/image";

export default function HeroSection() {
  return (
    <main className="overflow-hidden bg-muted/50">
      <section>
        <div className="relative py-24">
          <div className="max-w-5xl px-6 mx-auto">
            <div>
              <h1 className="max-w-2xl mt-8 font-sans text-5xl font-bold text-balance lg:text-6xl">
                A faster, smarter Mintlify alternative
              </h1>
              <p className="max-w-2xl my-6 text-2xl text-foreground text-balance font-inter">
                Create beautiful, AI-powered documentation without the hassle.
              </p>

              <div className="flex flex-col items-center gap-3 *:w-full sm:flex-row sm:*:w-fit">
                <Button asChild size="lg">
                  <Link href="#link">
                    <span className="text-nowrap">Start Building</span>
                  </Link>
                </Button>
                <Button key={2} asChild size="lg" variant="outline">
                  <Link href="/api-reference">
                    <span className="text-nowrap">Request a demo</span>
                  </Link>
                </Button>
              </div>
            </div>

            <div className="mt-8"></div>

            <div className="relative mt-16 -mr-56 sm:mr-0">
              <div className="bg-background rounded-(--radius) relative mx-auto overflow-hidden border border-transparent shadow-lg shadow-black/10 ring-1 ring-black/10">
                <Image
                  src="https://adventurous-porcupine-420.convex.cloud/api/storage/f8742436-3730-4591-93c8-49f44a7fd0b8"
                  alt="app screen"
                  width="2880"
                  height="1842"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
