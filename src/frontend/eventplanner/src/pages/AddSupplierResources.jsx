import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SupplierSidebar from "./SupplierSidebar";
import "./AddSupplierResources.css";
import config from '../config';
// Vrednosti iz TipResursa enuma sa beka
const TIP_RESURSA_ENUM = [
  "Osoblje",
  "Oprema",
  "Hrana",
  "Tehnika",
  "Scena",
  "Drugo"
];

export default function AddSupplierResource() {
  const [form, setForm] = useState({
    naziv: "",
    opis: "",
    tip: TIP_RESURSA_ENUM[0],
    ukupnoKolicina: "",
    lokacija: "",
    // nema više aktivnost u form state-u
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dobavljacId = localStorage.getItem("dobavljacId");
    if (!dobavljacId || dobavljacId === "undefined" || dobavljacId.length !== 24) {
      alert("Niste prijavljeni kao dobavljač ili ID nije validan! Prijavite se ponovo.");
      navigate("/login-dobavljac");
      return;
    }

    const dto = {
      naziv: form.naziv,
      opis: form.opis,
      tip: TIP_RESURSA_ENUM.indexOf(form.tip),
      ukupnoKolicina: Number(form.ukupnoKolicina),
      dobavljac: dobavljacId,
      lokacija: form.lokacija,
      aktivnost: "Slobodan", // automatski setuje na Slobodan
    };

    try {
      const response = await fetch(config.API_BASE_URL +"api/resursi/kreiraj", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dto),
      });

      const responseBody = await response.text();
      if (!response.ok) {
        console.log("Backend response:", responseBody);
        throw new Error("Greška pri kreiranju resursa");
      }
      const data = JSON.parse(responseBody);
      navigate("/dobavljac/dashboard", { state: { noviResurs: data } });
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="supplier-dashboard-wrapper">
      <SupplierSidebar />
      <div className="add-resource-page">
        <div className="add-resource-content">
          <h2 className="add-resource-title">Dodajte novi resurs</h2>
          <form className="add-resource-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <label>Naziv resursa</label>
              <input
                className="form-input"
                type="text"
                name="naziv"
                value={form.naziv}
                onChange={handleChange}
                required
                placeholder="Unesite naziv resursa"
              />
            </div>
            <div className="form-row">
              <label>Opis resursa</label>
              <textarea
                className="form-input"
                name="opis"
                value={form.opis}
                onChange={handleChange}
                required
                placeholder="Unesite opis resursa"
              />
            </div>
            <div className="form-row">
              <label>Tip resursa</label>
              <select
                className="form-input"
                name="tip"
                value={form.tip}
                onChange={handleChange}
                required
              >
                {TIP_RESURSA_ENUM.map(tip => (
                  <option key={tip} value={tip}>{tip}</option>
                ))}
              </select>
            </div>
            <div className="form-row">
              <label>Količina (ukupno)</label>
              <input
                className="form-input"
                type="number"
                name="ukupnoKolicina"
                value={form.ukupnoKolicina}
                onChange={handleChange}
                required
                placeholder="Unesite ukupnu količinu"
                min={1}
              />
            </div>
            <div className="form-row">
              <label>Lokacija</label>
              <input
                className="form-input"
                type="text"
                name="lokacija"
                value={form.lokacija}
                onChange={handleChange}
                placeholder="Unesite lokaciju"
              />
            </div>
            {/* Uklonjen status */}
            <button type="submit" className="add-resource-btn">
              + Dodaj resurs
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}