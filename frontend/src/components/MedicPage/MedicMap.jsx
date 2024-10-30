import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions';
import axios from 'axios';

mapboxgl.accessToken = 'pk.eyJ1IjoienlhZDIyIiwiYSI6ImNtMmhyZjYwbjBlNzUycXF2eW5ucjdrNTIifQ.gl1phZ7zs3yRryUmKgrKMQ'; // Access Token الخاص بك

const MedicMap = ({ caseId }) => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null); // لتخزين الخريطة
  const directionsRef = useRef(null); // لتخزين عنصر الـ Directions
  const [medicLocation, setMedicLocation] = useState(null); // موقع المسعف
  const [caseLocation, setCaseLocation] = useState(null); // سيتم جلب موقع الحالة من API
  const [estimatedTime, setEstimatedTime] = useState(''); // لتخزين المدة الزمنية المقدرة
  const [isLoading, setIsLoading] = useState(true); // حالة البحث (جاري البحث)
  const BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchCaseLocation = async () => {
      try {
        // استدعاء الباك إند لجلب بيانات الحالة
        const response = await axios.get(`${BASE_URL}/cases/${caseId}`);
        const caseData = response.data;
  
        if (caseData.location) {
          const { latitude, longitude } = caseData.location;
          setCaseLocation([longitude, latitude]);
        }
        setIsLoading(false);
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
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setMedicLocation([longitude, latitude]);
        },
        (error) => {
          console.error('Error getting location', error);
        }
      );
      return () => navigator.geolocation.clearWatch(watchId); // تنظيف عند إلغاء التثبيت
    } else {
      console.error('Geolocation not supported');
    }
  }, []);

  // إنشاء وتحديث الخريطة
  useEffect(() => {
    if (!medicLocation || !caseLocation || !mapContainerRef.current) {
      console.log("الموقع غير متاح لإنشاء الخريطة.");
      return;
    }

    if (mapRef.current) {
      // تحديث الموقع في حال تغيير المسعف أو الحالة
      directionsRef.current.setOrigin(medicLocation);
      directionsRef.current.setDestination(caseLocation);
      return;
    }

    // إنشاء الخريطة
    console.log('Creating Map...');
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
      new mapboxgl.Marker(medicDiv).setLngLat(medicLocation).addTo(mapInstance);

      // Marker الحالة
      const caseDiv = document.createElement('div');
      caseDiv.style.width = '20px';
      caseDiv.style.height = '20px';
      caseDiv.style.borderRadius = '50%';
      caseDiv.style.backgroundColor = 'red';
      caseDiv.style.border = '2px solid white';
      new mapboxgl.Marker(caseDiv).setLngLat(caseLocation).addTo(mapInstance);

      directions.on('route', (e) => {
        if (e.route && e.route.length > 0) {
          const { duration, distance } = e.route[0];
          const timeInMinutes = Math.floor(duration / 60);
          setEstimatedTime(`${timeInMinutes} دقيقة (${(distance / 1000).toFixed(2)} كم)`);
        }
      });

      mapInstance.addControl(directions);

      // حفظ حالة الخريطة
      mapRef.current = mapInstance;
      directionsRef.current = directions;
    });
  }, [medicLocation, caseLocation]);

  return (
    <div className="relative">
      {/* عرض الخريطة */}
      <div
        ref={mapContainerRef}
        className={`map-container ${isLoading ? 'blur-map' : ''}`}
        style={{ width: '100%', height: '400px' }}
      />
      <div className="absolute top-3 left-1 bg-white p-3 rounded-badge shadow-md">
        <h3>الوقت المتوقع: {estimatedTime}</h3>
      </div>
    </div>
  );
};

export default MedicMap;



