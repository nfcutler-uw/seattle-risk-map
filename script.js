mapboxgl.accessToken = 'YOUR_MAPBOX_ACCESS_TOKEN';

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/nfcutler/Landslide%20Risk%20Alki', // style name (URL encoded)
  center: [-122.39, 47.57],
  zoom: 13
});

map.on('load', () => {
  map.addSource('risk', {
    type: 'vector',
    url: 'mapbox://nfcutler.landslide_bldrisk_alki_9q1dpd'
  });

  map.addLayer({
    id: 'risk-fill',
    type: 'fill',
    source: 'risk',
    'source-layer': 'buildings',
    paint: {
      'fill-color': [
        'interpolate', ['linear'], ['get', 'total_sum'],
        0, '#2DC4B2',
        0.001, '#F1F075',
        0.01, '#F28CB1'
      ],
      'fill-opacity': 0.7
    }
  });

  map.on('click', 'risk-fill', (e) => {
    const p = e.features[0].properties;
    new mapboxgl.Popup()
      .setLngLat(e.lngLat)
      .setHTML(`
        <strong>Building ID:</strong> ${p.PIN_2009 || 'n/a'}<br/>
        <strong>Precip risk:</strong> ${(+p.precip_sum).toExponential(2)}<br/>
        <strong>Coseismic risk:</strong> ${(+p.coseismic_sum).toExponential(2)}<br/>
        <strong>Total risk:</strong> ${(+p.total_sum).toExponential(2)}
      `)
      .addTo(map);
  });

  map.on('mouseenter', 'risk-fill', () => map.getCanvas().style.cursor = 'pointer');
  map.on('mouseleave', 'risk-fill', () => map.getCanvas().style.cursor = '');
});
