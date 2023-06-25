"use client";
import dynamic from "next/dynamic";

const Map = dynamic(() => import("@/components/Map"));

export default function Home() {
  if (typeof window === "undefined") return null;

  return (
    <main>
      <Map />
    </main>
  );
}
