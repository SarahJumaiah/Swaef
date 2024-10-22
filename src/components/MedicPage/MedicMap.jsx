import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions';
import io from 'socket.io-client';
import './Loader.css'; // استيراد ملف CSS للودر الرادار

mapboxgl.accessToken = 'pk.eyJ1IjoienlhZDIyIiwiYSI6ImNtMmhyZjYwbjBlNzUycXF2eW5ucjdrNTIifQ.gl1phZ7zs3yRryUmKgrKMQ'; // Access Token الخاص بك

const socket = io('http://localhost:3000'); // الاتصال بالخادم

const MedicMap = () => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null); // تخزين الخريطة دون إعادة تحميلها
  const directionsRef = useRef(null); // لتخزين عنصر الـ Directions
  const medicMarkerRef = useRef(null); // لتخزين Marker المسعف
  const caseMarkerRef = useRef(null); // لتخزين Marker الحالة
  const [medicLocation, setMedicLocation] = useState(null); // الموقع الافتراضي للرياض
  const [caseLocation, setCaseLocation] = useState(null); // سيتم جلب موقع الحالة من API
  const [estimatedTime, setEstimatedTime] = useState(''); // لتخزين المدة الزمنية المقدرة
  const [isLoading, setIsLoading] = useState(true); // حالة البحث (جاري البحث)

  // تتبع موقع المسعف باستخدام Geolocation API
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setMedicLocation([longitude, latitude]); // تحديث موقع المسعف
        },
        (error) => {
          console.error('Error getting location', error);
        }
      );
    } else {
      console.error('Geolocation not supported');
    }
  }, []);

  // استماع لتحديثات الموقع من الخادم عبر Socket.IO
  useEffect(() => {
    const fetchCase = () => {
      socket.on('locationUpdate', (updatedLocation) => {
        if (updatedLocation) {
          setCaseLocation([updatedLocation.longitude, updatedLocation.latitude]); // تحديث موقع الحالة من الخادم
          setIsLoading(false); // إنهاء حالة البحث
        } else {
          setIsLoading(true); // إذا لم توجد حالة
        }
      });
    };

    fetchCase();

    // إعادة البحث عن حالات جديدة كل 10 ثوانٍ
    const intervalId = setInterval(fetchCase, 60000);

    return () => {
      socket.off('locationUpdate');
      clearInterval(intervalId);
    };
  }, []);

  // إنشاء الخريطة مرة واحدة فقط
  useEffect(() => {
    if (mapRef.current || !caseLocation) return;

    const mapInstance = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: medicLocation,
      zoom: 13,
    });

    const directions = new MapboxDirections({
      accessToken: mapboxgl.accessToken,
      unit: 'metric',
      profile: 'mapbox/driving',
      controls: { inputs: false, instructions: false },
    });

    directions.setOrigin(medicLocation);
    directions.setDestination(caseLocation);

    mapInstance.on('style.load', () => {
      // إنشاء Marker المسعف كنقطة صغيرة
      const medicDiv = document.createElement('div');
      medicDiv.style.width = '20px';
      medicDiv.style.height = '20px';
      medicDiv.style.borderRadius = '50%';
      medicDiv.style.backgroundColor = 'blue'; // لون النقطة
      medicDiv.style.border = '2px solid white'; // إضافة حد ليجعل النقطة بارزة

      const medicMarker = new mapboxgl.Marker(medicDiv).setLngLat(medicLocation).addTo(mapInstance);

      // إنشاء Marker لصاحب الحالة مع أيقونة مخصصة
      const el = document.createElement('div');
      el.className = 'emergency-icon';
      el.style.backgroundImage = 'url(https://png.pngtree.com/png-clipart/20230409/original/pngtree-emergency-icon-png-image_9037948.png)';
      el.style.width = '50px';
      el.style.height = '50px';
      el.style.backgroundSize = '100%';

      const caseMarker = new mapboxgl.Marker(el).setLngLat(caseLocation).addTo(mapInstance);

      directions.on('route', (e) => {
        if (e.route && e.route.length > 0) {
          const { duration, distance } = e.route[0];
          const timeInMinutes = Math.floor(duration / 60);
          setEstimatedTime(`${timeInMinutes} دقيقة (${(distance / 1000).toFixed(2)} كم)`);
        }
      });

      mapInstance.addControl(directions);

      mapRef.current = mapInstance;
      directionsRef.current = directions;
      medicMarkerRef.current = medicMarker;
      caseMarkerRef.current = caseMarker;
    });
  }, [caseLocation, medicLocation]);

  // تحديث المواقع والـ Markers والمسار دون إعادة تحميل الخريطة
  useEffect(() => {
    if (mapRef.current && directionsRef.current && medicMarkerRef.current && caseMarkerRef.current) {
      medicMarkerRef.current.setLngLat(medicLocation); // تحديث Marker المسعف
      caseMarkerRef.current.setLngLat(caseLocation); // تحديث Marker الحالة

      directionsRef.current.setOrigin(medicLocation); // تحديث الموقع الحالي للمسعف
      directionsRef.current.setDestination(caseLocation); // تحديث الموقع الحالي للحالة
    }
  }, [medicLocation, caseLocation]);

  return (
    <div>
      {/* عرض لودر الرادار أثناء البحث */}
      {isLoading && (
        <div className="radar-loader-container">
          <div className="radar-loader mb-5"></div>
          <p>جاري البحث عن حالة طارئة...</p>
        </div>
      )}

      {/* عرض الخريطة مع تغبيش أثناء البحث */}
      <div
        ref={mapContainerRef}
        className={`map-container ${isLoading ? 'blur-map' : ''}`}
        style={{ width: '100%', height: '500px' }}
      />

      <div className="absolute top-10 left-24 bg-white p-3 rounded-badge shadow-md">
        <h3>الوقت المتوقع: {estimatedTime}</h3>
      </div>
    </div>
  );
};

export default MedicMap;
