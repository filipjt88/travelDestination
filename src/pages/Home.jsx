import { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import SearchBar from "../components/SearchBar"; 
import DestinationCard from "../components/DestionationCard";
import { SearchCities, getPhotos, searchCities } from "../api";

export default function Home() {
    const [destinations, setDestinations] = useState([]);

    const handleSearch = async (q) => {
        const cityRes = await searchCities(q);

        const cities = cityRes.data._embedded["city:search-results"].slice(0,6);

        const enriched = await Promise.all(
            cities.map(async (c) => {
                const cityName = c.matching_full_name.split(",")[0];
                const photoRes = await getPhotos(cityName);
                return {
                    city: cityName,
                    image: photoRes.data[0]?.urls.small
                };
            })
        );
        setDestinations(enriched);
    };

    return(
        <Container>
      <h1 className="mt-4 text-center">Travel Destination Explorer</h1>
      <SearchBar onSearch={handleSearch} />

      <Row>
        {destinations.map((d, i) => (
          <Col md={4} key={i}>
            <DestinationCard city={d.city} image={d.image} />
          </Col>
        ))}
      </Row>
    </Container>
    )
}