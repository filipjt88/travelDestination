import { Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function DestinationCard({ city, image}) {
    return(
        <Card className="mb-4 shadow-sm">
            <Card.Img variant="top" src={image} className="img-fluid" />
            <Card.Body>
              <Card.Title>{city}</Card.Title>
              <Link to={`/details/${encodeURIComponent(city)}`}>
              <Button variant="primary" className="btn-sm">View details</Button>
              </Link>  
            </Card.Body>
        </Card>
    )
}