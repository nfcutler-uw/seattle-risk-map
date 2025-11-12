mapboxgl.accessToken = 'pk.eyJ1IjoibmZjdXRsZXIiLCJhIjoiY21obWN5aWJpMmJueTJrcHFmZGZkY3piYSJ9.FKJD-n7jV8pfzlOktuL2Zw';

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/nfcutler/cmhmfgt7m000601ss6nw2b8mm', // your Mapbox Studio style
  center: [-122.39, 47.57],
  zoom: 13
});

map.on('load', () => {
  // Add click popups for the layer from your style
  const layerId = 'landslide_bldrisk_alki-9q1dpd';
  
  map.on('click', layerId, (e) => {
    const p = e.features[0].properties;
    new mapboxgl.Popup()
      .setLngLat(e.lngLat)
      .setHTML(`
        <strong>Total risk:</strong> ${p.Ann_risk_bld_total}<br>
        <strong>Building ID:</strong> ${p.PIN_2009 || 'n/a'}
      `)
      .addTo(map);
  });

  map.on('mouseenter', layerId, () => map.getCanvas().style.cursor = 'pointer');
  map.on('mouseleave', layerId, () => map.getCanvas().style.cursor = '');
});
