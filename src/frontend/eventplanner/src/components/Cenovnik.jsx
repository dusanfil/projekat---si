import React, { useState } from "react";

const Cenovnik = ({ onSubmit }) => {
  const [open, setOpen] = useState(false);

  const [naziv, setNaziv] = useState("");
  const [opis, setOpis] = useState("");
  const [cena, setCena] = useState("");
  const [kolicina, setKolicina] = useState("");

  const [cenovnikStavke, setCenovnikStavke] = useState([]);

  const dodajStavku = () => {
    if (!naziv || !cena || !kolicina) {
      alert("Popuni obavezna polja: naziv, cena i količina!");
      return;
    }

    const stavkaDto = { naziv, opis, cena, kolicina };
    setCenovnikStavke((prev) => [...prev, stavkaDto]);

    setNaziv("");
    setOpis("");
    setCena("");
    setKolicina("");
    setOpen(false);
  };

  const posaljiUBackend = async () => {
    if (onSubmit) {
      onSubmit(cenovnikStavke);
    }
    setCenovnikStavke([]);
  };

  return (
    <div className="p-6">
      <button
        onClick={() => setOpen(true)}
        className="btn-pink" style={{marginRight:15}}
      >
        Dodaj stavku
      </button>

      

      {open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="add-resource-form" style={{width:450,backgroundColor:'#1F1B36', padding:50,borderRadius:16}}>
            <h2 className="text-xl font-bold mb-4 text-white">Dodaj novu stavku</h2>

            <input
              type="text"
              placeholder="Naziv"
              value={naziv}
              onChange={(e) => setNaziv(e.target.value)}
              className="w-full border p-2 mb-2 rounded"
            />
            <textarea
              placeholder="Opis"
              value={opis}
              onChange={(e) => setOpis(e.target.value)}
              className="w-full border p-2 mb-2 rounded"
            />
            <input
              type="number"
              placeholder="Cena"
              value={cena}
              onChange={(e) => setCena(e.target.value)}
              className="w-full border p-2 mb-2 rounded"
            />
            <input
              type="number"
              placeholder="Količina"
              value={kolicina}
              onChange={(e) => setKolicina(e.target.value)}
              className="w-full border p-2 mb-4 rounded"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setOpen(false)}
                className="bg-pink-400 text-white px-4 py-2 rounded"
              >
                Zatvori
              </button>
              <button
                onClick={dodajStavku}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Sačuvaj
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lista stavki */}
      <div className="mt-6">
        <h3 className="font-bold text-white">Trenutne stavke:</h3>
        <ul className="list-disc pl-6">
          {cenovnikStavke.map((s, i) => (
            <li className="text-white" key={i}>
              <b>{s.naziv}</b> – {s.cena} RSD ({s.kolicina} kom)
              {s.opis && <span className="text-white-500"> [{s.opis}]</span>}
            </li>
          ))}
        </ul>
      </div>
      {cenovnikStavke.length > 0 && (
        <button
          onClick={posaljiUBackend}
          className="btn-pink"
        >
          Saučuvaj i završi
        </button>
      )}
    </div>
  );
};

export default Cenovnik;