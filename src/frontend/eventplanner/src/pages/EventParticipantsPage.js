import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import axios from "axios";
import "./EventParticipantsPage.css";
import config from '../config';
// Mapiranje tipova (broj ili string u tekst)
const tipKarteMap = {
  0: "Regular",
  1: "VIP",
  2: "Besplatna",
  3: "RaniPristup",
  Regular: "Regular",
  VIP: "VIP",
  Besplatna: "Besplatna",
  RaniPristup: "RaniPristup"
};

const tipiUlazniceOpcije = [
  { value: '', label: 'Svi tipovi ulaznica' },
  { value: 'Regular', label: 'Regular' },
  { value: 'VIP', label: 'VIP' },
  { value: 'Besplatna', label: 'Besplatna' },
  { value: 'RaniPristup', label: 'RaniPristup' },
];

export default function EventParticipantsPage() {
  const { id } = useParams();
  const [eventName, setEventName] = useState('');
  const [participants, setParticipants] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get(`${config.API_BASE_URL}api/dogadjaj/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
      setEventName(res.data.naziv || res.data.Naziv || "");
    });

    axios.get(`${config.API_BASE_URL}api/dogadjaj/prijavljeni/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
      const mapped = (res.data || []).map(p => ({
        ...p,
        tipUlaznice: tipKarteMap[p.tipUlaznice] || p.tipUlaznice
      }));
      setParticipants(mapped);
    }).catch(() => {
      setParticipants([]);
    }).finally(() => setLoading(false));
  }, [id]);

  let filtered = participants.filter((p) =>
    ((p.korisnickoIme || '') + (p.email || '')).toLowerCase().includes(search.toLowerCase())
    && (typeFilter === '' || p.tipUlaznice === typeFilter)
  );

  const escapeCSV = (value) => {
    const str = value == null ? '' : String(value);
    if (/["',\n]/.test(str)) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const exportToCSV = () => {
    // Write UTF-8 BOM for Excel compatibility
    let csvContent = '\uFEFF';

    const headers = [
      "Korisničko ime",
      "Email",
      "Broj telefona",
      "Tip ulaznice"
    ];

    const rows = filtered.map(p =>
      [
        escapeCSV(p.korisnickoIme),
        escapeCSV(p.email),
        `"${p.brojTelefona}"`, // Broj telefona kao tekst
        escapeCSV(p.tipUlaznice)
      ]
    );
    csvContent += [headers, ...rows].map(e => e.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ucesnici.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="ep-container">
      <div className="ep-box">
        <h3>Lista učesnika za "{eventName}"</h3>
        <div className="ep-filter-row">
          <input
            type="text"
            placeholder="Pretraži učesnika"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="ep-input"
          />
          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            className="ep-select"
          >
            {tipiUlazniceOpcije.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        <table className="ep-table">
          <thead>
            <tr>
              <th>Korisničko ime</th>
              <th>Email</th>
              <th>Broj telefona</th>
              <th>Tip ulaznice</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} style={{ textAlign: "center", color: "#aaa" }}>Učitavanje...</td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ textAlign: "center", color: "#aaa" }}>Nema učesnika</td>
              </tr>
            ) : (
              filtered.map(p => (
                <tr key={p.id}>
                  <td>{p.korisnickoIme}</td>
                  <td>{p.email}</td>
                  <td>{p.brojTelefona}</td>
                  <td>{p.tipUlaznice}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <div className="ep-btn-row" style={{ justifyContent: "flex-end" }}>
          <button className="ep-csv-btn" onClick={exportToCSV}>
            Konvertuj u CSV
          </button>
        </div>
      </div>
    </div>
  );
}