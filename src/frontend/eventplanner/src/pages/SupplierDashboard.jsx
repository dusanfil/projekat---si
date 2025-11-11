import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SupplierSidebar from "./SupplierSidebar";
import "./SupplierDashboard.css";
import config from '../config';
const TIP_RESURSA_ENUM = [
  "Osoblje",
  "Oprema",
  "Hrana",
  "Tehnika",
  "Scena",
  "Drugo"
];

export default function SupplierDashboard() {
  const [resources, setResources] = useState([]);
  const [search, setSearch] = useState("");
  const [tipFilter, setTipFilter] = useState("");
  const [lokacijaFilter, setLokacijaFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [openedMenuId, setOpenedMenuId] = useState(null);
  const [deleteError, setDeleteError] = useState(""); // Dodato za poruku o brisanju

  const navigate = useNavigate();

  const dobavljacId = localStorage.getItem("dobavljacId");

  useEffect(() => {
    const fetchResources = async () => {
      setLoading(true);
      try {
        const response = await fetch(config.API_BASE_URL +"api/resursi");
        const data = await response.json();
        setResources(data);
      } catch (err) {
        alert("Greška prilikom dohvatanja resursa!");
      } finally {
        setLoading(false);
      }
    };
    fetchResources();
  }, []);

  useEffect(() => {
    if (openedMenuId === null) return;
    const handleClick = (e) => {
      if (
        !e.target.closest('.supplier-dashboard-action-menu') &&
        !e.target.closest('.supplier-dashboard-action-btn')
      ) {
        setOpenedMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [openedMenuId]);

  // Prikazuj samo resurse za prijavljenog dobavljača!
  const myResources = resources.filter(
    r => String(r.dobavljac) === String(dobavljacId)
  );

  const tipovi = [
    ...new Set(
      myResources.map(r => {
        const tipValue = r.tip ?? r.Tip;
        if (typeof tipValue === "number")
          return TIP_RESURSA_ENUM[tipValue] ?? tipValue;
        return tipValue;
      })
    ),
  ].filter(Boolean);

  const lokacije = [
    ...new Set(myResources.map(r => r.lokacija || r.Lokacija)),
  ].filter(Boolean);

  // Izračunava ukupno rezervisano iz nove strukture (rezervacije po događajima)
  function getRezervisano(res) {
    if (Array.isArray(res.rezervacije)) {
      return res.rezervacije.reduce((acc, r) => acc + (r.kolicina || 0), 0);
    }
    // fallback, stari modeli
    return res.rezervisanoKolicina || res.RezervisanoKolicina || 0;
  }

  function getStatusBadge(ukupno, rezervisano) {
    let statusText = "Slobodan";
    let statusClass = "free";
    if (rezervisano === 0) {
      statusText = "Slobodan";
      statusClass = "free";
    } else if (rezervisano >= ukupno) {
      statusText = "Zauzet";
      statusClass = "busy";
    } else {
      statusText = "Delimično zauzet";
      statusClass = "partial";
    }
    return { statusText, statusClass };
  }

  const obrisiResurs = async (id, rezervisano) => {
    setDeleteError(""); // Resetuj poruku
    if (rezervisano > 0) {
      setDeleteError("Ne možete obrisati resurs koji ima rezervacije. Moguce je brisanje samo slobodnih resursa.");
      return;
    }
    if (!window.confirm("Da li ste sigurni da želite da obrišete resurs?")) return;
    try {
      await fetch(`${config.API_BASE_URL}api/resursi/${id}`, { method: "DELETE" });
      setResources(prev => prev.filter(r => (r.id || r._id) !== id));
    } catch {
      alert("Greška pri brisanju!");
    }
  };

  const filteredResources = myResources.filter(res => {
    const naziv = (res.naziv || res.Naziv || "").toLowerCase();
    const tipValue = res.tip ?? res.Tip;
    const prikazTip =
      typeof tipValue === "number"
        ? TIP_RESURSA_ENUM[tipValue] ?? tipValue
        : tipValue;
    const lokacija = res.lokacija || res.Lokacija;

    return (
      naziv.includes(search.toLowerCase()) &&
      (tipFilter === "" || prikazTip === tipFilter) &&
      (lokacijaFilter === "" || lokacija === lokacijaFilter)
    );
  });

  return (
    <div className="supplier-dashboard-wrapper">
      <SupplierSidebar />
      <div className="supplier-dashboard-page">
        <div className="supplier-dashboard-content">
          <h1 className="supplier-dashboard-title">Moji resursi</h1>

          <div className="supplier-dashboard-filters">
            <div className="supplier-dashboard-filter-item">
              <span className="supplier-dashboard-filter-icon">🔍</span>
              <input
                type="text"
                className="supplier-dashboard-filter-input"
                placeholder="Pretraga resursa..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div className="supplier-dashboard-filter-item">
              <span className="supplier-dashboard-filter-icon">🏷️</span>
              <select
                className="supplier-dashboard-filter-select"
                value={tipFilter}
                onChange={e => setTipFilter(e.target.value)}
              >
                <option value="">Tip resursa</option>
                {tipovi.map(tip => (
                  <option key={tip} value={tip}>{tip}</option>
                ))}
              </select>
            </div>
            <div className="supplier-dashboard-filter-item">
              <span className="supplier-dashboard-filter-icon">📍</span>
              <select
                className="supplier-dashboard-filter-select"
                value={lokacijaFilter}
                onChange={e => setLokacijaFilter(e.target.value)}
              >
                <option value="">Lokacija</option>
                {lokacije.map(lok => (
                  <option key={lok} value={lok}>{lok}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="supplier-dashboard-table-container">
            {loading ? (
              <div style={{ color: "#888", textAlign: "center" }}>Učitavanje...</div>
            ) : (
              <>
                {deleteError && (
                  <div style={{
                    color: "#c73c6c",
                    background: "#3a2132",
                    borderRadius: "6px",
                    margin: "10px 0",
                    padding: "7px 12px",
                    fontWeight: 500,
                    fontSize: "1em",
                    textAlign: "center"
                  }}>
                    {deleteError}
                  </div>
                )}
                <table className="supplier-dashboard-table">
                  <thead>
                    <tr>
                      <th>Naziv</th>
                      <th>Tip</th>
                      <th>Rezervisano</th>
                      <th>Preostalo</th>
                      <th>Lokacija</th>
                      <th>Status</th>
                      <th>Akcije</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredResources.map((res, i) => {
                      const tipValue = res.tip ?? res.Tip;
                      const prikazTip =
                        typeof tipValue === "number"
                          ? TIP_RESURSA_ENUM[tipValue] ?? tipValue
                          : tipValue;
                      const ukupno = res.ukupnoKolicina || res.UkupnoKolicina || res.kolicina || res.Kolicina || 0;
                      const rezervisano = getRezervisano(res);
                      const preostalo = ukupno - rezervisano;

                      const { statusText, statusClass } = getStatusBadge(ukupno, rezervisano);

                      return (
                        <tr key={res._id || res.id || i} className="supplier-dashboard-table-row">
                          <td className="supplier-resource-name">{res.naziv || res.Naziv}</td>
                          <td>{prikazTip}</td>
                          <td>
                            <span className="supplier-resource-badge medium" title={`Rezervisano`}>
                              {rezervisano}
                            </span>
                          </td>
                          <td>
                            <span className="supplier-resource-badge high" title={`Preostalo`}>
                              {preostalo}
                            </span>
                          </td>
                          <td className="supplier-resource-location">
                            {res.lokacija || res.Lokacija}
                          </td>
                          <td>
                            <span
                              className={`supplier-resource-badge ${statusClass}`}
                              title={`Status resursa`}
                            >
                              {statusText}
                            </span>
                          </td>
                          <td style={{ position: "relative" }}>
                            <button
                              className="supplier-dashboard-action-btn"
                              onClick={() => setOpenedMenuId(res.id || res._id)}
                              aria-label="Akcije"
                            >
                              &#8942;
                            </button>
                            {openedMenuId === (res.id || res._id) && (
                              <div className="supplier-dashboard-action-menu">
                                <button
                                  className="supplier-dashboard-action-menu-item"
                                  onClick={() => {
                                    setOpenedMenuId(null);
                                    navigate(`/dobavljac/izmeni-resurs/${res.id || res._id}`);
                                  }}
                                >
                                  Izmeni
                                </button>
                                <button
                                  className="supplier-dashboard-action-menu-item"
                                  style={{ color: "#c73c6c" }}
                                  onClick={() => {
                                    setOpenedMenuId(null);
                                    obrisiResurs(res.id || res._id, rezervisano);
                                  }}
                                >
                                  Obriši
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                    {filteredResources.length === 0 && (
                      <tr>
                        <td colSpan={7} style={{ textAlign: "center", color: "#888" }}>
                          Nema rezultata za zadate filtere.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}