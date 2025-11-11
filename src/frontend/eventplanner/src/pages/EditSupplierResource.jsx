import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SupplierSidebar from "./SupplierSidebar";
import "./AddSupplierResources.css";
import config from '../config';
const TIP_RESURSA_ENUM = [
  "Osoblje",
  "Oprema",
  "Hrana",
  "Tehnika",
  "Scena",
  "Drugo"
];

export default function EditSupplierResource() {
  const { id } = useParams();
  const [form, setForm] = useState({
    naziv: "",
    opis: "",
    tip: TIP_RESURSA_ENUM[0],
    ukupnoKolicina: "",
    lokacija: "",
    // aktivnost: "Slobodan",  // STATUS POLJE IZBAČENO
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchResurs = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://softeng.pmf.kg.ac.rs:11071/api/resursi/${id}`);
        if (!response.ok) throw new Error("Greška pri učitavanju resursa!");
        const data = await response.json();
        setForm({
          naziv: data.naziv ?? "",
          opis: data.opis ?? "",
          tip: TIP_RESURSA_ENUM[typeof data.tip === "number" ? data.tip : 0],
          ukupnoKolicina: data.ukupnoKolicina ?? data.kolicina ?? "",
          lokacija: data.lokacija ?? "",
          // aktivnost: data.aktivnost ?? data.status ?? "Slobodan",  // STATUS POLJE IZBAČENO
        });
      } catch (err) {
        alert(err.message);
      }
      setLoading(false);
    };
    fetchResurs();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

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
      // aktivnost: form.aktivnost, // STATUS POLJE IZBAČENO
    };

    try {
      const response = await fetch(`http://softeng.pmf.kg.ac.rs:11071/api/resursi/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dto),
      });

      const responseBody = await response.text();
      if (!response.ok) {
        console.log("Backend response:", responseBody);
        throw new Error("Greška pri izmeni resursa");
      }
      navigate("/dobavljac/dashboard", { state: { izmenjenResurs: dto } });
    } catch (err) {
      alert(err.message);
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="supplier-dashboard-wrapper">
        <SupplierSidebar />
        <div className="add-resource-page">
          <div className="add-resource-content">
            <h2 className="add-resource-title">Učitavanje...</h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="supplier-dashboard-wrapper">
      <SupplierSidebar />
      <div className="add-resource-page">
        <div className="add-resource-content">
          <h2 className="add-resource-title">Izmeni resurs</h2>
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
            {/* STATUS POLJE IZBAČENO */}
            <button type="submit" className="add-resource-btn">
              {saving ? "Čuvam..." : "Sačuvaj izmene"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}