import { useEffect } from 'react';
  
function MyMapComponent(stations : []) {
    useEffect(() => {
        const googleApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${googleApiKey}`;
        script.async = true;
        script.onload = () => {
            if(stations.length > 0){
                let mapElement = document.getElementById('map');
                // if(mapElement){
                //     const map = new google.maps.Map(mapElement, {
                //         center: { lat: stations[0].lat, lng: stations[0].lng },
                //         zoom: 8,
                //       });

                //     stations.forEach((location: { lat: number; lng: number; }) => {
                //         new google.maps.marker.AdvancedMarkerElement ({
                //             position: {lat: location.lat, lng: location.lng}
                //         })
                //     });
                // }
            }
            
            
          // You can add markers or other map elements here
        };
        document.head.appendChild(script);
      
        return () => {
          document.head.removeChild(script);
        };
      }, []);
  return (
    <div id="map" style={{ height: '500px', width: '100%' }}>
      {/* Your map will be rendered here */}
    </div>
  );
}

export default MyMapComponent;
