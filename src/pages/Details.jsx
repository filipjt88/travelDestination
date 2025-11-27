import { useParams } from "react-router-dom";
import { Container } from "react-bootstrap";
import { MapContainer, TileLayer, Marker } from "react-leaflet";

export default function Details() {
  const { name } = useParams();
  const lat = 48.8566; // placeholder
  const lon = 2.3522;  // placeholder

  return (
    <Container className="my-4">
      <h2>{name}</h2>

      <MapContainer
        center={[lat, lon]}
        zoom={12}
        style={{ height: "400px", marginTop: "20px" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[lat, lon]} />
      </MapContainer>
    </Container>
  );
}
