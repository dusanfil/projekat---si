import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { MapContainer, TileLayer, Marker, Polygon, useMapEvents, Popup } from 'react-leaflet';
import L from 'leaflet';

const defaultIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const redIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
})

const ClickHandler = ({ onClick }) => {
  useMapEvents({
    click(e) {
      onClick(e.latlng);
    },
  });
  return null;
};

const tipoviLokacije = ["Bina",
"InfoPult",
"Toalet",
"PunktZaHranuIPice",
"Radionica",
"IzlozbeniStand",
"Ulaz",
"Izlaz",
"KantaZaOtpad",
"Parking",
"Bilaternica"] //Ovo je kopirano iz backenda

const MapModal = ({ show, onClose, existingFields }) => {
    const [currentPoints, setCurrentPoints] = useState([]);
    const [fieldName, setFieldName] = useState('');
    const [savedFields, setSavedFields] = useState([]);
    const [settingMainLocation, setSettingMainLocation] = useState(false);
    const [mainLocation, setMainLocation] = useState(null);
    const [mainLocationInProgress, setMainLocationInProgress] = useState(null);
    const [mainLocationType, setMainLocationType] = useState(null);
    console.log('existing')
    console.log(existingFields);
  // Reset all when modal opens
    useEffect(() => {
        if (show) {
        setSavedFields(existingFields || []);
        setCurrentPoints([]);
        setFieldName('');
        }
    }, [show, existingFields]);

    const handleClick = (latlng) => {
        if (settingMainLocation) {
        setMainLocationInProgress(latlng);
        setSettingMainLocation(false); // exit selection mode
    } else {
        setCurrentPoints((prev) => [...prev, latlng]);
    }
    };

    const handleClear = () => {
        setCurrentPoints([]);
        setFieldName('');
    };

    const handleSaveField = () => {
        if (!fieldName.trim()) {
            alert('Unesite duži naziv!');
            return;
        }

        if (currentPoints.length < 3) {
            alert('Potrebno je uneti bar 3 tačke!');
            return;
        }

        if (!mainLocationInProgress) {
            alert('Niste selektovali glavnu lokaciju!');
            return;
        }

        const newField = {
            name: fieldName.trim(),
            polygon: currentPoints,
            mainLocation: {
                coordinates: mainLocationInProgress,
                type: mainLocationType
            }
};

        setSavedFields([...savedFields, newField]);
        console.log(newField);
        setCurrentPoints([]);
        setFieldName('');
        setMainLocationInProgress(null);
};

    const handleClose = () => {
        onClose(savedFields);
    };

    return (
        <Modal show={show} onHide={handleClose} size="lg" centered >
        <Modal.Header style={{backgroundColor:'#1b1230'}} closeButton>
            <Modal.Title style={{color:'white'}}>Dodaj Podrucje</Modal.Title>
        </Modal.Header>

        <Modal.Body style={{backgroundColor:'#1b1230'}}>
            <Form.Group>
            <Form.Label style={{color:'white'}}>Naziv Podrucja</Form.Label>
            <Form.Control
                type="text"
                placeholder="npr. Glavno"
                value={fieldName}
                style={{backgroundColor:'#2c1e3c', color:'white'}}
                className='placeholder-light'
                onChange={(e) => setFieldName(e.target.value)}
            />
            <Button
                variant="secondary"
                className="my-2 me-2"
                style={{backgroundColor:'#603f86ff', border:'none'}}
                onClick={() => setSettingMainLocation(true)}
                >
                Postavi glavnu tacku
            </Button>

            <Form.Select
                style={{ width:'200px',  backgroundColor:'#603f86ff', color:'white', border:'none' }}
                value={mainLocationType}
                onChange={(e) => setMainLocationType(e.target.value)}
            
            >
                <option value={-1}>Odaberi Tip Lokacije</option>
                {
                    tipoviLokacije.map((tip, index)=>{
                        return <option value={index}>{tip}</option>
                    })
                }
            </Form.Select>
            </Form.Group>
                
            <div className="w-full h-[400px] mt-3">
            <MapContainer center={[44.7866, 20.4489]} zoom={13} style={{ height: '400px', width: '100%' }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <ClickHandler onClick={handleClick} />

                {/* Active field-in-progress */}
                

                {existingFields?.map((field, idx) => (
                    <>
                        <Polygon
                        key={`existing-${idx}`}
                        positions={field.polygon}
                        pathOptions={{ color: 'green', fillOpacity: 0.3 }}
                        />
                        {field.mainLocation.coordinates && (
                        <Marker position={field.mainLocation.coordinates} icon={redIcon}>
                            <Popup>{field.name} - Glavna tačka</Popup>
                        </Marker>
                        )}
                    </>
                    ))}

                    {savedFields.map((field, i) => (
                    <>
                        <Polygon
                        key={`saved-${i}`}
                        positions={field.polygon}
                        pathOptions={{ color: 'green', fillOpacity: 0.2 }}
                        />
                        {field.mainLocation.coordinates && (
                        <Marker position={field.mainLocation.coordinates} icon={redIcon}>
                            <Popup>{field.name} - Glavna tačka</Popup>
                        </Marker>
                        )}
                    </>
                    ))}

                    {mainLocationInProgress && (
                    <Marker position={mainLocationInProgress} icon={redIcon}>
                        <Popup>Glavna tačka u toku</Popup>
                    </Marker>
                    )}
                {currentPoints.map((pos, idx) => (
                <Marker key={`point-${idx}`} position={pos} icon={defaultIcon} />
                ))}
                {currentPoints.length >= 3 && (
                <Polygon positions={currentPoints} pathOptions={{ color: 'blue', fillOpacity: 0.3 }} />
                )}

                {/* Saved fields */}
                {savedFields.map((field, i) => (
                <Polygon
                    key={`saved-${i}`}
                    positions={field.polygon}
                    pathOptions={{ color: 'green', fillOpacity: 0.2 }}
                />
                ))}
            </MapContainer>
            </div>
        </Modal.Body>

        <Modal.Footer style={{backgroundColor:'#1b1230'}} className="flex gap-2">
            <Button variant="secondary" onClick={handleClear}>
            Obrisi
            </Button>
            <Button variant="primary" style={{backgroundColor:'#c13584', border:'none'}}  onClick={handleSaveField}>
            Sačuvaj Podrucje
            </Button>
            <Button variant="success" onClick={handleClose}>
            Gotovo
            </Button>
        </Modal.Footer>
        </Modal>
  );
};

export default MapModal