"use client";
import {
  Icon,
  LatLng,
  LatLngExpression,
  Marker as IMarker,
  latLng,
} from "leaflet";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
import UserLocation from "@/assets/user-location.png";
import Image from "next/image";
import Routing from "./Routing";

export default function Map() {
  const center: [number, number] = [51.505, -0.09];

  if (typeof window === "undefined") return null;

  return (
    <MapContainer
      center={center}
      zoom={13}
      scrollWheelZoom={false}
      style={{ height: "100vh" }}
      zoomControl={false}
    >
      <MapContent />
    </MapContainer>
  );
}

function MapContent() {
  const map = useMap();
  const [center, setCenter] = useState<LatLngExpression>();
  const iconRef = useRef<IMarker>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if ("geolocation" in navigator) {
      navigator.geolocation.watchPosition(
        (pos) => {
          const latLng = new LatLng(pos.coords.latitude, pos.coords.longitude);
          map.setView(latLng, 20, { animate: true, noMoveStart: true });
          setCenter(latLng);
        },
        (err) => {
          console.log(err);
        }
      );
    }

    map.addEventListener("click", (e) => {
      setCenter(e.latlng);
    });
  }, []);

  const iconHeight = 24;
  const iconWidth = 24;
  const icon = new Icon({
    iconUrl: UserLocation.src,
    iconSize: [iconWidth, iconHeight],
    iconAnchor: [iconWidth / 2, iconWidth / 2],
    className: "rotate-90",
  });

  if (!center) return null;
  return (
    <>
      <div className="fixed top-10 left-10 z-[1000] bg-white text-black">
        {center.toString()}
      </div>
      <TileLayer
        attribution="Test"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {/* <Marker position={center} icon={icon} ref={iconRef} /> */}
      <Routing
        from={latLng(center)}
        to={latLng(57.70887, 11.974559999999997)}
      />
    </>
  );
}
