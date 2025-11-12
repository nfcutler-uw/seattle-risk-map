mapboxgl.accessToken = 'pk.eyJ1IjoibmZjdXRsZXIiLCJhIjoiY21obWN5aWJpMmJueTJrcHFmZGZkY3piYSJ9.FKJD-n7jV8pfzlOktuL2Zw';

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/nfcutler/cmhmfgt7m000601ss6nw2b8mm', // style name (URL encoded)
  center: [-122.39, 47.57],
  zoom: 13
});

map.on('load', () => {
  map.addSource('risk', {
    type: 'vector',
    url: 'mapbox://nfcutler.6lwsbz30'
  });

  map.addLayer({
    id: 'risk-fill',
    type: 'fill',
    source: 'risk',
    'source-layer': 'landslide_bldrisk_alki-9q1dpd',
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
