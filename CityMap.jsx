import { CircleMarker, MapContainer, TileLayer, Tooltip, useMap } from 'react-leaflet'
import { Maximize2, Layers2, Plus, Minus } from 'lucide-react'

const markers = [
  { position: [18.5204, 73.8567], label: 'Pothole · Shivajinagar', color: '#f29a54', size: 10 },
  { position: [18.5314, 73.8446], label: 'Streetlight · Deccan', color: '#8b7af7', size: 9 },
  { position: [18.5089, 73.8581], label: 'Water leak · Swargate', color: '#4ea5e8', size: 11 },
  { position: [18.5352, 73.8753], label: 'Waste collection · Koregaon Park', color: '#45bb91', size: 9 },
  { position: [18.4987, 73.8261], label: 'Road damage · Kothrud', color: '#ee7892', size: 10 },
  { position: [18.5483, 73.8295], label: 'Drainage · Aundh', color: '#f29a54', size: 8 },
  { position: [18.5142, 73.888], label: 'Traffic signal · Camp', color: '#8b7af7', size: 8 },
]

function MapControls() {
  const map = useMap()
  return (
    <div className="map-controls">
      <button className="map-control" aria-label="Zoom in" onClick={(event) => { event.stopPropagation(); map.zoomIn() }}><Plus size={17} /></button>
      <button className="map-control" aria-label="Zoom out" onClick={(event) => { event.stopPropagation(); map.zoomOut() }}><Minus size={17} /></button>
      <button className="map-control" aria-label="Reset map" onClick={(event) => { event.stopPropagation(); map.setView([18.5204, 73.8567], 13) }}><Maximize2 size={15} /></button>
    </div>
  )
}

export default function CityMap() {
  return (
    <section className="panel map-panel">
      <div className="panel-heading map-heading">
        <div><h2>Live city pulse</h2><p>Complaints across Pune, in real time</p></div>
        <button className="icon-button" aria-label="Map layers"><Layers2 size={17} /></button>
      </div>
      <div className="map-canvas">
        <MapContainer center={[18.5204, 73.8567]} zoom={13} scrollWheelZoom={false} zoomControl={false} attributionControl={false}>
          <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {markers.map((marker) => (
            <CircleMarker key={marker.label} center={marker.position} radius={marker.size} pathOptions={{ color: marker.color, fillColor: marker.color, fillOpacity: 0.9, weight: 3 }}>
              <Tooltip>{marker.label}</Tooltip>
            </CircleMarker>
          ))}
          <MapControls />
        </MapContainer>
        <div className="map-live"><span /> LIVE UPDATES</div>
        <div className="map-legend"><span><i className="legend-orange" />Roads</span><span><i className="legend-blue" />Water</span><span><i className="legend-green" />Sanitation</span></div>
      </div>
      <div className="map-footer"><span><b>24</b> active reports</span><span className="map-view-all">Explore full map <span>↗</span></span></div>
    </section>
  )
}
