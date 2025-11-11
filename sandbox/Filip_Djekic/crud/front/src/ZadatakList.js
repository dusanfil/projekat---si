import React, { useEffect, useState } from "react";

const API_URL = "https://localhost:7037/api/zadatak"; // prilagodi URL tvom backendu

function ZadatakList() {
  const [zadaci, setZadaci] = useState([]);
  const [noviZadatak, setNoviZadatak] = useState({
    naslov: "",
    opis: "",
    uradjeno: false,
  });

  const ucitajZadatke = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setZadaci(data);
    } catch (err) {
      console.error("Greška prilikom učitavanja:", err);
    }
  };

  const dodajZadatak = async () => {
    if (!noviZadatak.naslov || !noviZadatak.opis) return;
    try {
      await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(noviZadatak),
      });
      setNoviZadatak({ naslov: "", opis: "", uradjeno: false });
      ucitajZadatke();
    } catch (err) {
      console.error("Greška pri dodavanju zadatka:", err);
    }
  };

  const obrisiZadatak = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });
      ucitajZadatke();
    } catch (err) {
      console.error("Greška pri brisanju zadatka:", err);
    }
  };

  useEffect(() => {
    ucitajZadatke();
  }, []);

  return (
    <div>
      <input
        placeholder="Naslov"
        value={noviZadatak.naslov}
        onChange={(e) =>
          setNoviZadatak({ ...noviZadatak, naslov: e.target.value })
        }
      />
      <input
        placeholder="Opis"
        value={noviZadatak.opis}
        onChange={(e) =>
          setNoviZadatak({ ...noviZadatak, opis: e.target.value })
        }
      />
      <button onClick={dodajZadatak}>Dodaj</button>

      <ul>
        {zadaci.map((z) => (
          <li key={z.id}>
            <b>{z.naslov}</b> — {z.opis} [{z.uradjeno ? "✔" : "✗"}]
            <button onClick={() => obrisiZadatak(z.id)}>Obriši</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ZadatakList;
