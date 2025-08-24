import { useEffect, useState } from "react";

const useCurrentLocation = () => {
  const [userLocation, setUserLocation] = useState({
    latitude: 0,
    longitude: 0,
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geo location tidak didukung");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          latitude: position?.coords?.latitude,
          longitude: position?.coords?.longitude,
        });
      },
      (err) => {
        setError(err.message);
      }
    );
  }, []);

  return { userLocation, error };
};

export default useCurrentLocation;
