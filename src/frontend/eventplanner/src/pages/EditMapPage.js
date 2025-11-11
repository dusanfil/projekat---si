import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Polygon, Popup, useMapEvents } from 'react-leaflet';
import { Form, Button, Row, Col, Container, Modal } from 'react-bootstrap';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import config from '../config';
const defaultIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function EditMapPage({ dani, index, onClose }) {
  const [points, setPoints] = useState(dani[index].tacke || []);
  const [podrucja, setPodrucja] = useState(dani[index].podrucja || []);
  const [newPolygonCoords, setNewPolygonCoords] = useState([]);
  const [drawingPolygon, setDrawingPolygon] = useState(false);

  // Za dodavanje / izmenu naziva područja
  const [selectedAreaIndex, setSelectedAreaIndex] = useState(null);
  const [areaNameInput, setAreaNameInput] = useState('');

  // Dodavanje tačke na mapu
  const [addingPointMode, setAddingPointMode] = useState(false);
  const [pointType, setPointType] = useState('');
  const [pointName, setPointName] = useState('');
  const [linkedResource, setLinkedResource] = useState('');

  // Map click handler
  const handleMapClick = (latlng) => {
    if (addingPointMode) {
      if (!pointType || !pointName) {
        alert('Popuni vrstu i naziv tačke pre dodavanja.');
        return;
      }
      const newPoint = {
        id: Date.now().toString(),
        type: pointType,
        name: pointName,
        resource: linkedResource,
        position: [latlng.lat, latlng.lng],
      };
      setPoints(prev => [...prev, newPoint]);
      setPointType('');
      setPointName('');
      setLinkedResource('');
      setAddingPointMode(false);
      return;
    }
    if (drawingPolygon) {
      setNewPolygonCoords(prev => [...prev, [latlng.lat, latlng.lng]]);
    }
  };

  // Završavanje crtanja poligona - novo područje
  const finishPolygon = () => {
    if (newPolygonCoords.length < 3) {
      alert('Poligon mora imati najmanje 3 tačke.');
      return;
    }
    if (!areaNameInput.trim()) {
      alert('Unesi naziv područja pre završetka.');
      return;
    }
    const newArea = {
      id: Date.now().toString(),
      naziv: areaNameInput.trim(),
      koordinate: newPolygonCoords,
      lokacije: [],
    };
    setPodrucja(prev => [...prev, newArea]);
    setNewPolygonCoords([]);
    setDrawingPolygon(false);
    setAreaNameInput('');
  };

  // Izmena naziva postojećeg područja
  const handleSelectArea = (idx) => {
    setSelectedAreaIndex(idx);
    setAreaNameInput(podrucja[idx].naziv || '');
  };

  const handleAreaNameChange = (e) => {
    setAreaNameInput(e.target.value);
  };

  const handleUpdateAreaName = () => {
    if (selectedAreaIndex === null) return;
    const updatedAreas = [...podrucja];
    updatedAreas[selectedAreaIndex].naziv = areaNameInput.trim();
    setPodrucja(updatedAreas);
    setSelectedAreaIndex(null);
    setAreaNameInput('');
  };

  // Brisanje područja
  const handleDeleteArea = (idx) => {
    if (window.confirm('Da li ste sigurni da želite obrisati ovo područje?')) {
      const filtered = podrucja.filter((_, i) => i !== idx);
      setPodrucja(filtered);
      if (selectedAreaIndex === idx) {
        setSelectedAreaIndex(null);
        setAreaNameInput('');
      }
    }
  };

  // Komponenta za slušanje klikova na mapu
  function LocationClickHandler() {
    useMapEvents({
      click(e) {
        handleMapClick(e.latlng);
      },
    });
    return null;
  }

  // Funkcija za slanje podataka backendu
  const handleSave = async () => {
    // Pripremi payload za backend
    // Izvuci samo ID-jeve područja jer DTO traži List<string>
    const podrucjaIds = podrucja.map(p => p.id);

    const payload = {
      // Primer polja - prilagodi po potrebi
      naziv: dani[index].naziv,
      opis: dani[index].opis,
      datumOdrzavanja: dani[index].datumOdrzavanja,
      podrucja: podrucjaIds,
      aktivnosti: dani[index].aktivnosti,
      tacke: points,
    };

    try {
      const response = await fetch(config.API_BASE_URL + `api/dani/${dani[index].id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const errText = await response.text();
        alert('Greška pri čuvanju: ' + errText);
        return;
      }
      alert('Podaci uspešno sačuvani.');
      onClose(); // zatvori modal
    } catch (error) {
      alert('Greška pri konekciji sa serverom.');
      console.error(error);
    }
  };

  return (
    <Container fluid className="bg-light text-dark py-3" style={{ minHeight: '100vh' }}>
      <Row>
        <Col xs={12} md={9} className="mb-4">
          <h5>Mapa događaja</h5>
          <MapContainer
            center={[44.7866, 20.4489]}
            zoom={13}
            style={{ height: '70vh', width: '100%' }}
            className="rounded shadow"
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <LocationClickHandler />

            {/* Prikaz poligona područja */}
            {podrucja.map((p, idx) => (
              p.koordinate && p.koordinate.length > 0 ? (
                <Polygon key={p.id || idx} positions={p.koordinate} color="red">
                  <Popup>{p.naziv}</Popup>
                </Polygon>
              ) : null
            ))}

            {/* Novi poligon koji se crta */}
            {newPolygonCoords.length > 0 && (
              <Polygon positions={newPolygonCoords} color="blue">
                <Popup>Novi poligon (u izradi)</Popup>
              </Polygon>
            )}

            {/* Tačke na mapi */}
            {points.map(p => (
              <Marker key={p.id} position={p.position} icon={defaultIcon}>
                <Popup>
                  <strong>{p.name}</strong><br />
                  Vrsta: {p.type}<br />
                  Resurs: {p.resource || 'N/A'}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </Col>

        {/* Kontrole za dodavanje/izmenu/brisanje područja */}
        <Col xs={12} md={3}>
          <h5>Alati za područja</h5>

          {/* Dodaj novo područje - unos naziva */}
          {drawingPolygon ? (
            <>
              <Form.Group className="mb-3">
                <Form.Label>Naziv novog područja</Form.Label>
                <Form.Control
                  type="text"
                  value={areaNameInput}
                  onChange={handleAreaNameChange}
                  placeholder="Unesi naziv područja"
                />
              </Form.Group>
              <Button variant="success" onClick={finishPolygon} className="mb-3">
                Završi područje
              </Button>
              <Button variant="secondary" onClick={() => {
                setDrawingPolygon(false);
                setNewPolygonCoords([]);
                setAreaNameInput('');
              }}>
                Otkaži
              </Button>
            </>
          ) : (
            <>
              <Button variant="warning" onClick={() => setDrawingPolygon(true)} className="mb-3">
                Dodaj novo područje
              </Button>

              <h6>Postojeća područja</h6>
              <ul className="list-group mb-3" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                {podrucja.map((p, idx) => (
                  <li key={p.id || idx} className="list-group-item d-flex justify-content-between align-items-center">
                    <div
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleSelectArea(idx)}
                    >
                      {p.naziv || 'Područje'}
                    </div>
                    <div>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => handleSelectArea(idx)}
                        className="me-2"
                      >
                        Izmeni
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDeleteArea(idx)}
                      >
                        Obriši
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Izmena naziva */}
              {selectedAreaIndex !== null && (
                <>
                  <Form.Group className="mb-3">
                    <Form.Label>Izmeni naziv područja</Form.Label>
                    <Form.Control
                      type="text"
                      value={areaNameInput}
                      onChange={handleAreaNameChange}
                    />
                  </Form.Group>
                  <Button variant="success" onClick={handleUpdateAreaName} className="mb-3">
                    Sačuvaj izmene
                  </Button>
                  <Button variant="secondary" onClick={() => {
                    setSelectedAreaIndex(null);
                    setAreaNameInput('');
                  }}>
                    Otkaži izmenu
                  </Button>
                </>
              )}
            </>
          )}

          {/* Dugme za čuvanje svih promena */}
          <Button variant="primary" onClick={handleSave} className="mt-4" size="lg" block>
            Sačuvaj promene i zatvori
          </Button>

        </Col>
      </Row>
    </Container>
  );
}

export default EditMapPage;
