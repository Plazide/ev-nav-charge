import "leaflet-routing-machine";
import { useMap } from "react-leaflet";
import L, { Routing as RoutingControl, latLng } from "leaflet";
import { useEffect, useState } from "react";

L.Marker.prototype.options.icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
});

/**
 * Handle cutoffs and time formatting of route travel time
 * @param time Duration of route in seconds
 */
const timeFormatter = (time: number) => {
  console.log(time);

  const minutes = time / 60;
  const hours = minutes / 60;
  const days = hours / 24;

  if (hours > 1) {
    if (hours < 7) {
      const restMinutes = minutes % 60;
      return Math.floor(hours) + " tim " + Math.floor(restMinutes) + " min";
    }

    return Math.floor(hours) + " tim ";
  }
  if (days > 1) {
    if (days < 2) {
      const restHours = hours % 24;
      return Math.floor(days) + " dag " + Math.floor(restHours) + " tim ";
    }

    return days + "dagar";
  }

  // If less than one hour, return minutes.
  return minutes;
};

interface Point {
  lat: number;
  lng: number;
}

interface Props {
  from: Point;
  to: Point;
  waypoints?: Point[];
}

export default function Routing({ from, to, waypoints }: Props) {
  const map = useMap();
  const [control, setControl] = useState<RoutingControl.Control | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [time, setTime] = useState<number | null>(null);

  const fromlatLng = `${from.lat}-${from.lng}`;

  useEffect(() => {
    if (!control) {
      const routingControl = RoutingControl.control({
        showAlternatives: false,
        show: false,
        containerClassName: "hidden",
        autoRoute: true,
        summaryTemplate: `<h2>{name}</h2> {distance}, {time}`,
        lineOptions: {
          extendToWaypoints: false,
          missingRouteTolerance: 0.5,
          styles: [{ stroke: true, color: "blue", weight: 5 }],
        },
        waypoints: [
          latLng(from.lat, from.lng),
          ...(waypoints
            ? waypoints.map((point) => latLng(point.lat, point.lng))
            : []),
          latLng(to.lat, to.lng),
        ],
      });

      routingControl.on(
        "routeselected",
        (e: RoutingControl.RouteSelectedEvent) => {
          console.log(e);

          setDistance(e.route.summary?.totalDistance || null);
          setTime(e.route.summary?.totalTime || null);
        }
      );

      routingControl.addTo(map);
      setControl(routingControl);
    }

    return () => {
      if (control) map.removeControl(control);
    };
  }, []);

  useEffect(() => {
    control?.spliceWaypoints(0, 1, { latLng: latLng(from.lat, from.lng) });
    map.setView(latLng(from.lat, from.lng));
  }, [fromlatLng]);

  return (
    <div className="bg-white p-4 rounded-md fixed top-4 left-4 z-[1001] text-gray-700 font-semibold text-lg">
      {time && <div>{timeFormatter(time)}</div>}
      {distance && <span>{(distance / 1000).toFixed(0)} km</span>}
    </div>
  );
}
