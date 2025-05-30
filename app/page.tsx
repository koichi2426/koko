'use client';

import { useEffect, useState } from "react";
import Header from "./components/layouts/Header/Header";
import Footer from "./components/layouts/Footer/Footer";
import CoccoCharacter from "./features/home/components/CoccoCharacter/CoccoCharacter";
import PoemBubble from "./features/home/components/PoemBubble/PoemBubble";

// デフォルトの位置情報（東京）
const DEFAULT_LOCATION = {
  lat: 35.6762,
  lon: 139.6503
};

export default function Home() {
  const [poem, setPoem] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPoem = async () => {
      try {
        // 位置情報の取得を試みる
        let position;
        try {
          position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              enableHighAccuracy: true,
              timeout: 5000,
              maximumAge: 0
            });
          });
        } catch (geoError) {
          console.log('位置情報の取得に失敗しました。デフォルトの位置（東京）を使用します。', geoError);
          position = {
            coords: {
              latitude: DEFAULT_LOCATION.lat,
              longitude: DEFAULT_LOCATION.lon
            }
          } as GeolocationPosition;
        }

        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        const weatherRes = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}&units=metric&lang=ja`
        );

        const weatherData = await weatherRes.json();

        const environment = {
          location: weatherData.name,
          temperature: weatherData.main.temp,
          humidity: weatherData.main.humidity,
          weather: weatherData.weather[0].description,
          time: new Date().toLocaleString("sv-SE", { timeZone: "Asia/Tokyo" }).replace(" ", "T") + ":00.000+09:00",
        };

        const res = await fetch("/api/GeneratePoem", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(environment),
        });

        const data = await res.json();
        setPoem(data.text || "詩の取得に失敗しました");
      } catch (error) {
        console.error(error);
        setPoem("詩の取得に失敗しました");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPoem();
  }, []);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#40494F] text-white flex flex-col">
        <div className="flex-grow flex items-start justify-center pt-16 sm:pt-32">
          <div className="flex flex-col items-center gap-4 sm:gap-6">
            <PoemBubble poem={isLoading ? "考え中..." : poem} />
            <CoccoCharacter isLoading={isLoading} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
