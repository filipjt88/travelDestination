import { Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function DestinationCard({ city, image}) {
    return(
        <Card className="mb-3 shadow-sm">
            <Card.Img variant="top" src={image} />
            <Card.Body>
              <Card.Title>{city}</Card.Title>
              <Link to={`/details/${encodeURIComponent(city)}`}>
              <Button variant="primary">View details</Button>
              </Link>  
            </Card.Body>
        </Card>
    )
}