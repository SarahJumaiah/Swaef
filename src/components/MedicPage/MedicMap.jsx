import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions';
import './Loader.css'; // استيراد ملف CSS للودر الرادار
import axios from 'axios';

mapboxgl.accessToken = 'pk.eyJ1IjoienlhZDIyIiwiYSI6ImNtMmhyZjYwbjBlNzUycXF2eW5ucjdrNTIifQ.gl1phZ7zs3yRryUmKgrKMQ'; // Access Token الخاص بك

const MedicMap = ({ caseId }) => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null); // تخزين الخريطة دون إعادة تحميلها
  const directionsRef = useRef(null); // لتخزين عنصر الـ Directions
  const medicMarkerRef = useRef(null); // لتخزين Marker المسعف
  const caseMarkerRef = useRef(null); // لتخزين Marker الحالة
  const [medicLocation, setMedicLocation] = useState(null); // الموقع الافتراضي للرياض
  const [caseLocation, setCaseLocation] = useState(null); // سيتم جلب موقع الحالة من API
  const [estimatedTime, setEstimatedTime] = useState(''); // لتخزين المدة الزمنية المقدرة
  const [isLoading, setIsLoading] = useState(true); // حالة البحث (جاري البحث)

  // جلب موقع الحالة من الـ MockAPI
  useEffect(() => {
    const fetchCaseLocation = async () => {
      try {
        const response = await axios.get(`https://67073bf9a0e04071d2298046.mockapi.io/users/${caseId}`);
        const caseData = response.data;

        if (caseData.location) {
          const { latitude, longitude } = caseData.location;
          setCaseLocation([longitude, latitude]); // تحديد موقع الحالة
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error fetching case location:', error);
        setIsLoading(true);
      }
    };

    if (caseId) {
      fetchCaseLocation();
    }
  }, [caseId]);

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

  // إنشاء الخريطة مرة واحدة فقط
  useEffect(() => {
    if (mapRef.current || !caseLocation || !medicLocation) return;

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
      // Marker المسعف
      const medicDiv = document.createElement('div');
      medicDiv.style.width = '20px';
      medicDiv.style.height = '20px';
      medicDiv.style.borderRadius = '50%';
      medicDiv.style.backgroundColor = 'blue';
      medicDiv.style.border = '2px solid white';

      const medicMarker = new mapboxgl.Marker(medicDiv).setLngLat(medicLocation).addTo(mapInstance);

      // Marker الحالة
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

  // تحديث المواقع والـ Markers
  useEffect(() => {
    if (mapRef.current && directionsRef.current && medicMarkerRef.current && caseMarkerRef.current) {
      medicMarkerRef.current.setLngLat(medicLocation); // تحديث Marker المسعف
      caseMarkerRef.current.setLngLat(caseLocation); // تحديث Marker الحالة

      directionsRef.current.setOrigin(medicLocation); // تحديث موقع المسعف
      directionsRef.current.setDestination(caseLocation); // تحديث موقع الحالة
    }
  }, [medicLocation, caseLocation]);

  return (
    <div className="relative">
      {/* عرض الخريطة */}
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
