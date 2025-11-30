import { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import SearchBar from "../components/SearchBar"; 
import DestinationCard from "../components/DestionationCard";
import { getDestinations, searchDestinations } from "../api/index";

export default function Home() {
  const [destinations, setDestinations] = useState([]);

  // Učitaj sve države pri pokretanju
  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    const res = await getDestinations();
    setDestinations(res.data);
  };

  // Pretraga
  const handleSearch = async (q) => {
    if (!q) return loadAll();

    try {
      const res = await searchDestinations(q);
      setDestinations(res.data);
    } catch (err) {
      console.log("Nothing found.");
      setDestinations([]);
    }
  };

  return (
    <Container>
      <h1 className="mt-4 text-center">Travel Destination Explorer</h1>
      <SearchBar onSearch={handleSearch} />

      <Row className="mt-4">
        {destinations.map((d, i) => (
          <Col md={2} key={i} className="mb-4">
            <DestinationCard
              city={d.name.common}
              image={d.flags.png}
              country={d.capital?.[0] || "N/A"}
            />
          </Col>
        ))}
      </Row>
    </Container>
  );
}
