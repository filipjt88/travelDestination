// Details.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./Details.css";


delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

export default function Details() {
  const { name } = useParams();
  const navigate = useNavigate();

  const [country, setCountry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!name) {
      setError("No route country name passed.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    // REST Countries API v3.1 - pretražuje po imenu
    const controller = new AbortController();
    const signal = controller.signal;

    fetch(`https://restcountries.com/v3.1/name/${encodeURIComponent(name)}?fullText=true`, { signal })
      .then(async (res) => {
        if (!res.ok) {
          if (res.status === 404) {
            const r2 = await fetch(
              `https://restcountries.com/v3.1/name/${encodeURIComponent(name)}`,
              { signal }
            );
            if (!r2.ok) throw new Error(`Country "${name}" not found!`);
            return r2.json();
          }
          throw new Error(`Loading error: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        // API vraća niz podataka; uzmemo prvi rezultat
        if (!Array.isArray(data) || data.length === 0) {
          throw new Error("There is no data for the requested country.");
        }
        setCountry(data[0]);
        setLoading(false);
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
        setError(err.message || "An error occurred.");
        setLoading(false);
      });

    return () => controller.abort();
  }, [name]);

  if (loading) {
    return (
      <div className="details-container">
        <button onClick={() => navigate(-1)} className="back-button">Back</button>
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="details-container">
        <button onClick={() => navigate(-1)} className="back-button">Back</button>
        <p className="error">Error: {error}</p>
      </div>
    );
  }

  // Safety: provera koordinata
  const latlng =
    country?.latlng && Array.isArray(country.latlng) && country.latlng.length >= 2
      ? [country.latlng[0], country.latlng[1]]
      : null;

  // fallback centar (ako nema koordinata) - prikaži celokupnu mapu sveta
  const mapCenter = latlng ?? [20, 0];
  const mapZoom   = latlng ? 5 : 2;

  // korisne vrednosti iz odgovora
  const commonName   = country?.name?.common ?? name;
  const officialName = country?.name?.official ?? "";
  const capital      = Array.isArray(country?.capital) ? country.capital.join(", ") : country?.capital ?? "N/A";
  const region       = country?.region ?? "N/A";
  const subregion    = country?.subregion ?? "N/A";
  const population   = country?.population ? country.population.toLocaleString() : "N/A";
  const currencies   = country?.currencies
    ? Object.values(country.currencies)
        .map((c) => `${c.name} (${c.symbol ?? ""})`.trim())
        .join(", ")
    : "N/A";
  const languages    = country?.languages ? Object.values(country.languages).join(", ") : "N/A";
  const flag = country?.flags?.png ?? country?.flags?.svg ?? null;

  return (
    <div className="details-container">
      <div className="details-header">
        <button onClick={() => navigate(-1)} className="back-button">← Back</button>
        <h1>{commonName}</h1>
        {officialName && <small className="official">({officialName})</small>}
      </div>

      <div className="details-grid">
        <div className="details-card">
          {flag && (
            <img src={flag} alt={`${commonName} flag`} className="flag" />
          )}

          <ul className="info-list">
            <li><strong>Capital city:</strong> {capital}</li>
            <li><strong>Region / Subregion:</strong> {region} / {subregion}</li>
            <li><strong>Population:</strong> {population}</li>
            <li><strong>Currencies:</strong> {currencies}</li>
            <li><strong>Languages:</strong> {languages}</li>
            <li><strong>Territorial coordinates:</strong> {latlng ? `${latlng[0]}, ${latlng[1]}` : "No data"}</li>
          </ul>
        </div>

        <div className="map-card">
          <MapContainer
            center={mapCenter}
            zoom={mapZoom}
            style={{ height: "100%", minHeight: 300, width: "100%" }}
            scrollWheelZoom={false}
            whenCreated={(map) => {
              // ako nema preciznih koordinata - uvećaj prikaz sveta
              if (!latlng) {
                map.setView(mapCenter, mapZoom);
              }
            }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {latlng && (
              <Marker position={latlng}>
                <Popup>
                  <div style={{ minWidth: 150 }}>
                    <strong>{commonName}</strong>
                    <div>{capital !== "N/A" ? `Capital city: ${capital}` : null}</div>
                  </div>
                </Popup>
              </Marker>
            )}
          </MapContainer>
        </div>
      </div>
    </div>
  );
}
