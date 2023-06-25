"use client";
import Map from "../components/Map";

export default function Home() {
  if (typeof window === "undefined") return null;

  return (
    <main>
      <Map />
    </main>
  );
}
