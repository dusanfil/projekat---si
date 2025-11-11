import React, { useState } from 'react';
import { Form } from 'react-bootstrap';

const AktivnostForm = ({ dani, setDani, aktivniDanIndex, aktivnostUnos, setAktivnostUnos, index }) => {

  console.log('DANI : : : ')
  console.log(aktivniDanIndex)
  console.log(dani)
  const handleLokacijaChange = (e) => {
    const selectedId = parseInt(e.target.value);
    const pozicije = dani[aktivniDanIndex]?.tacke || [];
    const selected = pozicije.find(p => p.id === selectedId);
    console.log('pozicije= ' + pozicije);
    console.log('selected = ' + selected);
    console.log(selected);
    setAktivnostUnos(prev => ({
      ...prev,
      lokacija: selected ? selected : null,
    }));
    // const updatedDani = [...dani]
    // const danToUpdate = {...updatedDani[aktivniDanIndex]}
    // danToUpdate.aktivniDanIndex = danToUpdate.aktivniDanIndex || []
    //danToUpdate.aktivnosti[index].lokacija = selected
    //updatedDani[aktivniDanIndex].aktivnosti[index].lokacija = selected;
    // const newAktivnost = {
    //   ...aktivnostUnos,
    //   lokacija: selected ? selected : null,
    // };
    // updatedDani[aktivniDanIndex].aktivnosti.push(newAktivnost)
      

    
    // console.log('updated dani:')
    // console.log(updatedDani)
    // setDani(updatedDani);
  };

  return (
    <Form.Group controlId="formLokacija">
      <Form.Label>Lokacija za {dani[aktivniDanIndex]?.naziv}</Form.Label>
      <Form.Control as="select" onChange={handleLokacijaChange} defaultValue="">
        <option value="" disabled>Izaberite tacku</option>
        {dani[aktivniDanIndex]?.tacke.map(tacka => (
          <option key={tacka.id} value={tacka.id}>
            {tacka.name}
          </option>
        ))}
      </Form.Control>

      {/* Optional: for debugging */}
      {/* {aktivnostUnos.lokacija && (
        <div className="mt-2 text-muted">
          Izabrana lokacija: {aktivnostUnos.lokacija.lat}, {aktivnostUnos.lokacija.lng}
        </div>
      )} */}
    </Form.Group>
  );
};

export default AktivnostForm;