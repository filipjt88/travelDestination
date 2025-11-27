import { Form, Button, Row, Col } from "react-bootstrap";
import { useState } from "react";

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <Form onSubmit={handleSubmit} className="my-4">
      <Row>
        <Col md={10}>
          <Form.Control
            type="text"
            placeholder="Search destinations..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </Col>
        <Col md={2}>
          <Button type="submit" variant="primary" className="w-100">
            Search
          </Button>
        </Col>
      </Row>
    </Form>
  );
}
