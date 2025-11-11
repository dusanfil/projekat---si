import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import SideBar from './Sidebar.jsx';
import './OrganizerEventsPage.css';
import config from '../config';
function OrganizerEventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);
  const [organizatorId, setOrganizatorId] = useState(null);

  const [search, setSearch] = useState("");
  const [tipFilter, setTipFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [sortirajPoDatumu, setSortirajPoDatumu] = useState("");
  const [sortirajPoPrijavljenima, setSortirajPoPrijavljenima] = useState("");

  const [sortConfig, setSortConfig] = useState({ key: 'datumPocetka', direction: 'default' });

  const navigate = useNavigate();
  const TIPS = ["Konferencija", "Utakmica", "Protest", "Festival", "Zurka", "Vasar"];

  useEffect(() => {
    const tempToken = localStorage.getItem("token");
    const tempId = localStorage.getItem('organizatorId');
    setOrganizatorId(tempId);
    setToken(tempToken);
  }, []);

  useEffect(() => {
    if (!token || !organizatorId) return;

    const fetchEvents = async () => {
      try {
        const response = await axios.get(config.API_BASE_URL +`api/dogadjaj/prikaz`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const mojiDogadjaji = response.data.filter((e) =>
          (e.organizator || e.Organizator)?.trim() === organizatorId?.trim()
        );
        setEvents(mojiDogadjaji);
        setError(null);
      } catch (err) {
        setError("Greška prilikom učitavanja događaja");
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [token, organizatorId]);

  const obrisiDogadjaj = async (id) => {
    const potvrda = window.confirm("Da li ste sigurni da želite da obrišete događaj?");
    if (!potvrda) return;

    try {
      await axios.delete(config.API_BASE_URL +`api/dogadjaj/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEvents(events.filter((e) => (e.id || e._id) !== id));
    } catch (err) {
      console.error("Greška prilikom brisanja događaja:", err);
    }
  };

  // Funkcija za klik na th zaglavlje (sortiranje)
  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        if (prev.direction === "default") return { key, direction: "asc" };
        if (prev.direction === "asc") return { key, direction: "desc" };
        return { key, direction: "default" }; // treći klik
      }
      return { key, direction: "asc" };
    });
  };

  // Helper za prikaz strelica u th
  const renderSortArrows = (columnKey) => {
    const isActive = sortConfig.key === columnKey && sortConfig.direction !== "default";
    return (
      <span className={`sort-arrows${isActive ? " active" : ""}`}>
        <span className={sortConfig.key === columnKey && sortConfig.direction === "asc" ? "" : "inactive"}>▲</span>
        <span style={{marginLeft: "-2px"}} className={sortConfig.key === columnKey && sortConfig.direction === "desc" ? "" : "inactive"}>▼</span>
      </span>
    );
  };

  // Filtriranje događaja
  let filteredEvents = events.filter((e) => {
    const naziv = (e.naziv || e.Naziv || "").toLowerCase();
    const tip = (e.tip || e.Tip || e.kategorija || e.Kategorija || "").toLowerCase();
    const datum = (e.datumPocetka || e.DatumPocetka || "").split("T")[0];

    return naziv.includes(search.toLowerCase()) &&
      (tipFilter === "" || tip === tipFilter.toLowerCase()) &&
      (dateFilter === "" || datum === dateFilter);
  });

  if (sortirajPoDatumu === "najskoriji") {
    filteredEvents = filteredEvents.sort(
      (a, b) => new Date(a.datumPocetka || a.DatumPocetka) - new Date(b.datumPocetka || b.DatumPocetka)
    );
  } else if (sortirajPoDatumu === "najkasniji") {
    filteredEvents = filteredEvents.sort(
      (a, b) => new Date(b.datumPocetka || b.DatumPocetka) - new Date(a.datumPocetka || a.DatumPocetka)
    );
  }

  if (sortirajPoPrijavljenima === "najvise") {
    filteredEvents = filteredEvents.sort(
      (a, b) => (b.prijavljeni?.length || 0) - (a.prijavljeni?.length || 0)
    );
  } else if (sortirajPoPrijavljenima === "najmanje") {
    filteredEvents = filteredEvents.sort(
      (a, b) => (a.prijavljeni?.length || 0) - (b.prijavljeni?.length || 0)
    );
  }

  if (sortConfig.direction !== "default") {
    filteredEvents = [...filteredEvents].sort((a, b) => {
      let aValue, bValue;
      switch (sortConfig.key) {
        case "naziv":
          aValue = (a.naziv || a.Naziv || "").toLowerCase();
          bValue = (b.naziv || b.Naziv || "").toLowerCase();
          break;
        case "tip":
          aValue = (a.tip || a.Tip || a.kategorija || a.Kategorija || "").toLowerCase();
          bValue = (b.tip || b.Tip || b.kategorija || b.Kategorija || "").toLowerCase();
          break;
        case "datumPocetka":
          aValue = new Date(a.datumPocetka || a.DatumPocetka);
          bValue = new Date(b.datumPocetka || b.DatumPocetka);
          break;
        case "datumKraja":
          aValue = new Date(a.datumKraja || a.DatumKraja);
          bValue = new Date(b.datumKraja || b.DatumKraja);
          break;
        case "lokacija":
          aValue = (a.lokacija || a.Lokacija || "").toLowerCase();
          bValue = (b.lokacija || b.Lokacija || "").toLowerCase();
          break;
        case "prijavljeni":
          aValue = (a.prijavljeni?.length || 0);
          bValue = (b.prijavljeni?.length || 0);
          break;
        default:
          aValue = bValue = 0;
      }
      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  } else if (
    sortConfig.key !== "datumPocetka"
  ) {
    // Default sortiranje po najskorijem
    filteredEvents = [...filteredEvents].sort(
      (a, b) => new Date(a.datumPocetka || a.DatumPocetka) - new Date(b.datumPocetka || b.DatumPocetka)
    );
  }

  const prikaziTipDogadjaja = (e) => {
    return (
      e.tip ||
      e.Tip ||
      e.Kategorija ||
      e.kategorija ||
      "Nepoznato"
    );
  };

  return (
    <div className="organizer-dashboard-wrapper">
      <SideBar />
      <div className="organizer-dashboard-page">
        <div className="organizer-dashboard-content">
          <h1 className="organizer-dashboard-title">Moji događaji</h1>

          {error && <div className="text-danger mb-3">{error}</div>}

          {/* FILTERI */}
          <div className="organizer-dashboard-filters">
            <div className="organizer-dashboard-filter-item">
              <span className="organizer-dashboard-filter-icon">🔍</span>
              <input
                type="text"
                className="organizer-dashboard-filter-input"
                placeholder="Pretraga po nazivu..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div className="organizer-dashboard-filter-item">
              <span className="organizer-dashboard-filter-icon">🏷️</span>
              <select
                className="organizer-dashboard-filter-select"
                value={tipFilter}
                onChange={(e) => setTipFilter(e.target.value)}
              >
                <option value="">Tip događaja</option>
                {TIPS.map((tip) => (
                  <option key={tip} value={tip}>
                    {tip}
                  </option>
                ))}
              </select>
            </div>
            <div className="organizer-dashboard-filter-item">
              <span className="organizer-dashboard-filter-icon">📅</span>
              <input
                type="date"
                className="organizer-dashboard-filter-input"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              />
            </div>
            <div className="organizer-dashboard-filter-item">
              <span className="organizer-dashboard-filter-icon">📆</span>
              <select
                className="organizer-dashboard-filter-select"
                value={sortirajPoDatumu}
                onChange={(e) => setSortirajPoDatumu(e.target.value)}
              >
                <option value="">Sortiraj po datumu</option>
                <option value="najskoriji">Najskoriji</option>
                <option value="najkasniji">Najkasniji</option>
              </select>
            </div>
          </div>

          {/* TABELA */}
          <div className="organizer-dashboard-table-container">
            {loading ? (
              <div style={{ color: "#888", textAlign: "center" }}>Učitavanje...</div>
            ) : (
              <table className="organizer-dashboard-table">
                <thead>
                  <tr>
                    <th onClick={() => handleSort("tip")} style={{ cursor: "pointer" }}>
                      Tip događaja{renderSortArrows("tip")}
                    </th>
                    <th onClick={() => handleSort("naziv")} style={{ cursor: "pointer" }}>
                      Naziv{renderSortArrows("naziv")}
                    </th>
                    <th onClick={() => handleSort("datumPocetka")} style={{ cursor: "pointer" }}>
                      Datum početka{renderSortArrows("datumPocetka")}
                    </th>
                    <th onClick={() => handleSort("datumKraja")} style={{ cursor: "pointer" }}>
                      Datum završetka{renderSortArrows("datumKraja")}
                    </th>
                    <th onClick={() => handleSort("lokacija")} style={{ cursor: "pointer" }}>
                      Lokacija{renderSortArrows("lokacija")}
                    </th>
                    <th onClick={() => handleSort("prijavljeni")} style={{ cursor: "pointer" }}>
                      Broj prijavljenih{renderSortArrows("prijavljeni")}
                    </th>
                    {/* Akcije kolona ukinuta */}
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEvents.length > 0 ? (
                    filteredEvents.map((e) => (
                      <tr key={e.id || e._id} className="organizer-dashboard-table-row">
                        <td>{prikaziTipDogadjaja(e)}</td>
                        <td className="organizer-resource-name">{e.naziv || e.Naziv}</td>
                        <td>
                          {(e.datumPocetka || e.DatumPocetka) &&
                            new Date(e.datumPocetka || e.DatumPocetka).toLocaleDateString()}
                        </td>
                        <td>
                          {(e.datumKraja || e.DatumKraja) &&
                            new Date(e.datumKraja || e.DatumKraja).toLocaleDateString()}
                        </td>
                        <td className="organizer-resource-location">{e.lokacija || e.Lokacija || "Nepoznato"}</td>
                        <td>
                          <span className={`organizer-resource-badge medium`} title={`Broj prijavljenih`}>
                            {e.prijavljeni.length  || 0}
                          </span>
                        </td>
                        <td style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                          <button
                            className="organizer-dashboard-detail-btn"
                            onClick={() => navigate(`/details/${e.id || e._id}`)}
                          >
                            Detalji
                          </button>
                          <button
                            className="organizer-dashboard-delete-btn"
                            onClick={() => obrisiDogadjaj(e.id || e._id)}
                          >
                            Izbriši
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" style={{ textAlign: "center", color: "#888" }}>
                        Nema događaja za zadate filtere.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrganizerEventsPage;