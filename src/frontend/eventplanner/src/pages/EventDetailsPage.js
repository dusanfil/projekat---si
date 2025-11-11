
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './EventDetailsPage.css';
import { MapContainer, TileLayer, Marker, Popup, Polygon, Tooltip  } from 'react-leaflet';
import config from '../config';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const defaultIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const TIP_REZERVISANOG_RESURSA = {
  0: "Osoblje",
  1: "Piće",
  2: "Hrana",
  3: "Oprema",
  4: "Stolica",
  5: "Zvuk",
};

const TIP_NOTIFIKACIJE = {
  0: "Informacija",
  1: "Upozorenje",
  2: "Hitno",
};

const DEFAULT_IMAGE_PATHS = {
  "Konferencija": "/images/event-defaults/konferencija.webp",
  "Utakmica": "/images/event-defaults/utakmica.jpg",
  "Protest": "/images/event-defaults/protest.webp",
  "Festival": "/images/event-defaults/festival.jpg",
  "Zurka": "/images/event-defaults/zurka.jpeg",
  "Vasar": "/images/event-defaults/vasar.jpg"
};

function EventDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    naziv: "",
    datumPocetka: "",
    datumKraja: "",
    celodnevni: false,
    lokacija: "",
    opis: "",
    kategorija: "",
    kapacitet: "",
    tipoviUlaznica: "",
    slika: "",
    status: "",
  });
  const [slikaUrl, setSlikaUrl] = useState("");
  const [daniDogadjaja, setDaniDogadjaja] = useState([]);
  const [napomeneList, setNapomeneList] = useState([{ sadrzaj: "", tip: "" }]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [rezervisaniResursi, setRezervisaniResursi] = useState([]);
  const [dobavljaciMap, setDobavljaciMap] = useState({});
  const [deleteLoadingId, setDeleteLoadingId] = useState(null);

  const [showAddResursModal, setShowAddResursModal] = useState(false);
  const [dobavljaci, setDobavljaci] = useState([]);
  const [selectedDobavljac, setSelectedDobavljac] = useState("");
  const [resursiDobavljaca, setResursiDobavljaca] = useState([]);
  const [selectedResurs, setSelectedResurs] = useState("");
  const [addResursValues, setAddResursValues] = useState({
    naziv: "",
    opis: "",
    tip: "",
    lokacija: "",
    kolicina: "",
    ukupnoKolicina: "",
    rezervacije: [],
  });
  const [addLoading, setAddLoading] = useState(false);
  const [addResursError, setAddResursError] = useState("");
  const [statistika, setStatistika] = useState(null);
  const [notifikacije, setNotifikacije] = useState([]);
  const [podrucja, setPodrucja] = useState([]);
  const [podrucjaLoading, setPodrucjaLoading] = useState(true);
  const [cenovnik, setCenovnik] = useState(null)
  const [cenovnikStavke, setCenovnikStavke] = useState([]);
  const [cenovnikLoading, setCenovnikLoading] = useState(true);
useEffect(()=>{
    const ucitajCenovnik = async()=>{
      try {
        const response = await fetch(config.API_BASE_URL + `api/cenovnici/dogadjaj/${id}`);
        if (!response.ok) throw new Error("Cenovnik nije pronađen");
        const data = await response.json();

        // backend nekad vrati listu, nekad objekat
        const cen = Array.isArray(data) ? data[0] : (data ?? null);
        setCenovnik(cen);

        const stavkeIds = Array.isArray(cen?.stavke) ? cen.stavke : [];
        if (stavkeIds.length === 0) {
          setCenovnikStavke([]);
          return;
        }

        const stavkePromises = stavkeIds.map(async (stavkaId) => {
          const res = await fetch(config.API_BASE_URL + `api/cenovnik-stavke/${stavkaId}`);
          if (!res.ok) throw new Error("Greška pri učitavanju stavke cenovnika");
          return res.json();
        });

        const stavke = await Promise.all(stavkePromises);
        setCenovnikStavke(stavke);
      } catch (e) {
        console.error(e);
        setCenovnikStavke([]);
      } finally {
        setCenovnikLoading(false);
      }
    }
     ucitajCenovnik();
  }, [id]);

  const [notifikacijaForm, setNotifikacijaForm] = useState({
    naziv: "",
    tip: "",
    sadrzaj: ""
  });
  const [notifError, setNotifError] = useState("");
  const [notifLoading, setNotifLoading] = useState(false);

  const [brojPrijavljenih, setBrojPrijavljenih] = useState(0);
useEffect(()=>{
    if(!id) return;
    const fetchStat = async()=>{
      const response = await axios.get(config.API_BASE_URL + `api/dogadjaj-statistika/${id}`);
      setStatistika(response.data);
      console.log(response);
    }
    fetchStat();
  },[id])
  const handleDownload = async () => {
  try {
    const response = await fetch(config.API_BASE_URL + "api/dogadjaj-statistika/export/"+id, {
      method: "GET",
      headers: {
        "Accept": "text/csv",
      },
    });

    if (!response.ok) {
      throw new Error("Greska pri preuzimanju");
    }

    if (!response.ok) {
      throw new Error("Greska pri preuzimanju");
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    // create a temporary link
    const link = document.createElement("a");
    link.href = url;
    link.download = "data.csv"; // fallback filename
    document.body.appendChild(link);
    link.click();
    link.remove();

    // free memory
    window.URL.revokeObjectURL(url);
  } catch (err) {
    console.error("Error downloading file:", err);
  }
};

  // Lock body scroll when modal is open
  useEffect(() => {
    document.body.classList.toggle('modal-open', showAddResursModal);
    document.body.style.overflow = showAddResursModal ? "hidden" : "auto";
    return () => { document.body.style.overflow = "auto"; };
  }, [showAddResursModal]);

  // Initial fetch: event, reserved resources, suppliers, notifications
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(config.API_BASE_URL + `api/dogadjaj/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const kategorija = res.data.kategorija || res.data.Kategorija || "";
        let urLalbuma = res.data.urLalbuma || res.data.URLalbuma || res.data.slikaDogadjaja?.putanjaDoSlike || "";
        if (!urLalbuma && kategorija) {
          urLalbuma = DEFAULT_IMAGE_PATHS[kategorija] || "";
        }

        setForm({
          naziv: res.data.naziv || "",
          datumPocetka: res.data.datumPocetka ? res.data.datumPocetka.slice(0,10) : "",
          datumKraja: res.data.datumKraja ? res.data.datumKraja.slice(0,10) : "",
          celodnevni: !!res.data.celodnevni,
          lokacija: res.data.lokacija || "",
          opis: res.data.opis?.replace(/<[^>]+>/g, '') || "",
          kategorija: kategorija,
          kapacitet: res.data.kapacitet || "",
          tipoviUlaznica: res.data.tipoviUlaznica || "",
          slika: urLalbuma,
          status: res.data.status || res.data.Status || "",
        });

        setSlikaUrl(getImageUrl(urLalbuma, kategorija));
        setNapomeneList(
          Array.isArray(res.data.napomene) && res.data.napomene.length > 0
            ? res.data.napomene.map(n => ({
                sadrzaj: n.sadrzaj ?? (typeof n === "string" ? n : ""),
                tip: n.tip ?? n.oznake ?? ""
              }))
            : [{ sadrzaj: "", tip: "" }]
        );
        setBrojPrijavljenih((res.data.prijavljeni && res.data.prijavljeni.length) || 0);
        setLoading(false);
      } catch (e) {
        console.error(e);
        setLoading(false);
      }
    };

    fetchData();

    axios.get(config.API_BASE_URL + `api/resursi/dogadjaj/${id}`)
      .then(res => setRezervisaniResursi(res.data))
      .catch(() => {});

    axios.get(config.API_BASE_URL + "api/dobavljaci")
      .then(res => {
        const map = {};
        (res.data || []).forEach(d => {
          map[d.id] = d.imeIPrezime || d.korisnickoIme || d.email;
        });
        setDobavljaciMap(map);
        setDobavljaci(res.data || []);
      })
      .catch(() => {});

    axios.get(config.API_BASE_URL + `api/notifikacija/dogadjaj/${id}`)
      .then(res => {
        const seen = new Set();
        const uniqueNotifikacije = [];
        for (const n of res.data || []) {
          const key = `${n.naziv}|${n.sadrzaj}|${n.tip}|${n.datumSlanja}`;
          if (!seen.has(key)) {
            seen.add(key);
            uniqueNotifikacije.push(n);
          }
        }
        setNotifikacije(uniqueNotifikacije);
      })
      .catch(() => {});
  }, [id]);

  // Fetch days with areas and activities (deduped, fixed per-id fetch for areas)
  useEffect(() => {
    const token = localStorage.getItem('token');

    const fetchDani = async () => {
      try {
        const resEvent = await axios.get(config.API_BASE_URL + `api/dogadjaj/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const eventData = resEvent.data;
        const daniSaDetaljima = [];

        if (Array.isArray(eventData.dani)) {
          for (const danIdObj of eventData.dani) {
            const danId = typeof danIdObj === "object" && danIdObj.$oid ? danIdObj.$oid : danIdObj;

            // Dan details
            const danRes = await axios.get(config.API_BASE_URL + `api/dani/${danId}`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            const danData = danRes.data;

            // Areas for the day
            let podrucjaSaKoord = [];
            if (Array.isArray(danData.podrucja)) {
              for (const podrucjeIdObj of danData.podrucja) {
                const podrucjeId = typeof podrucjeIdObj === "object" && podrucjeIdObj.$oid ? podrucjeIdObj.$oid : podrucjeIdObj;
                try {
                  const podrRes = await axios.get(config.API_BASE_URL + `api/podrucja/${podrucjeId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                  });
                  const podrData = podrRes.data;
                  podrucjaSaKoord.push({
                    naziv: podrData.naziv || podrData.Naziv || "",
                    koordinate: podrData.koordinate || podrData.Koordinate || [],
                    HEXboja: podrData.hexBoja || podrData.HEXboja || null
                  });
                } catch {
                  // skip broken area
                }
              }
            }
            setPodrucja(podrucjaSaKoord);
            setPodrucjaLoading(false);
            console.log(podrucjaSaKoord);
            // Activities for the day
            let aktivnostiDana = [];
            try {
              const aktRes = await axios.get(config.API_BASE_URL + `api/aktivnosti`, {
                headers: { Authorization: `Bearer ${token}` }
              });
              if (Array.isArray(aktRes.data)) {
                aktivnostiDana = aktRes.data.filter(a => {
                  const aDanId = typeof a.Dan === "object" && a.Dan.$oid ? a.Dan.$oid : a.Dan;
                  return aDanId === danId;
                });
              }
            } catch {
              // ignore
            }

            daniSaDetaljima.push({
              ...danData,
              podrucja: podrucjaSaKoord,
              aktivnosti: aktivnostiDana
            });
          }
        }

        setDaniDogadjaja(daniSaDetaljima);
      } catch (err) {
        console.error("Greška pri dohvatanju dana događaja:", err);
      }
    };

    fetchDani();
  }, [id]);

  // Prepare modal defaults when opened
  useEffect(() => {
    if (showAddResursModal) {
      axios.get(config.API_BASE_URL + "api/dobavljaci")
        .then(res => setDobavljaci(res.data || []));
      setSelectedDobavljac("");
      setResursiDobavljaca([]);
      setSelectedResurs("");
      setAddResursValues({
        naziv: "",
        opis: "",
        tip: "",
        lokacija: "",
        kolicina: "",
        ukupnoKolicina: "",
        rezervacije: [],
      });
      setAddResursError("");
    }
  }, [showAddResursModal]);

  // Load supplier resources
  useEffect(() => {
    const fetchResursi = async () => {
      if (!selectedDobavljac) return;
      try {
        console.log(selectedDobavljac)
        const dobavljac = await axios.get(config.API_BASE_URL + `api/dobavljaci/${selectedDobavljac}`);
        const promises = (dobavljac.data.resursi || []).map(rid =>
          axios.get(config.API_BASE_URL + `api/resursi/${rid}`).then(r => r.data)
        );
        const resursi = await Promise.all(promises);
        setResursiDobavljaca(resursi);
      } catch {
        setResursiDobavljaca([]);
      }
    };
    fetchResursi();
  }, [selectedDobavljac]);

  const getImageUrl = (imgPath, kategorija) => {
    if (!imgPath && kategorija && DEFAULT_IMAGE_PATHS[kategorija]) {
      return `${config.API_BASE_URL}${DEFAULT_IMAGE_PATHS[kategorija]}`;
    }
    if (!imgPath) return "";
    if (imgPath.startsWith("http://") || imgPath.startsWith("https://")) return imgPath;
    return `${config.API_BASE_URL}${imgPath.startsWith("/") ? imgPath : "" + imgPath}`;
  };

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({
      ...f,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleDeleteReservation = async (resursId) => {
    if (!window.confirm("Da li ste sigurni da želite da uklonite rezervaciju ovog resursa?")) return;
    setDeleteLoadingId(resursId);
    try {
      await axios.post(config.API_BASE_URL + + `api/resursi/ponisti-rezervaciju`, {
        resursId,
        dogadjajId: id
      });
      const rezervisani = await axios.get(`${config.API_BASE_URL}api/resursi/dogadjaj/${id}`);
      setRezervisaniResursi(rezervisani.data);
    } catch (err) {
      alert("Greška pri brisanju rezervacije!");
    }
    setDeleteLoadingId(null);
  };

  const handleResursSelect = (e) => {
    const resursId = e.target.value;
    setSelectedResurs(resursId);
    const resurs = resursiDobavljaca.find(r => r.id === resursId);
    setAddResursValues({
      naziv: resurs?.naziv || "",
      opis: resurs?.opis || "",
      tip: resurs?.tip || "",
      lokacija: resurs?.lokacija || "",
      kolicina: "",
      ukupnoKolicina: resurs?.ukupnoKolicina || resurs?.kolicina || "",
      rezervacije: resurs?.rezervacije || [],
    });
    setAddResursError("");
  };

  const handleAddResursChange = e => {
    const { name, value } = e.target;
    setAddResursValues(v => ({
      ...v,
      [name]: value
    }));
    setAddResursError("");
  };

  const handleAddResursSubmit = async (e) => {
  e.preventDefault();
  setAddLoading(true);
  setAddResursError("");

  const ukupno = Number(addResursValues.ukupnoKolicina) || 0;
  const rezervacije = Array.isArray(addResursValues.rezervacije) ? addResursValues.rezervacije : [];
  const ukupnoRezervisano = rezervacije.reduce((acc, r) => acc + (r.kolicina || 0), 0);
  const zaOvajDogadjaj = rezervacije.find(r => r.dogadjajId === id);
  const trenutnoZaOvajDogadjaj = zaOvajDogadjaj ? zaOvajDogadjaj.kolicina : 0;
  const kolicina = Number(addResursValues.kolicina) || 0;

  // Saberi staro+novo
  const novaUkupnaKolicina = trenutnoZaOvajDogadjaj + kolicina;

  
  const maxZaOvajDogadjaj = ukupno - (ukupnoRezervisano - trenutnoZaOvajDogadjaj);

  if (kolicina < 1) {
    setAddResursError("Količina mora biti bar 1.");
    setAddLoading(false);
    return;
  }
  if (novaUkupnaKolicina > maxZaOvajDogadjaj) {
    setAddResursError("Ne možete rezervisati više resursa nego što je preostalo.");
    setAddLoading(false);
    return;
  }

  try {
    await axios.post(config.API_BASE_URL + "api/resursi/rezervisi", {
      resursId: selectedResurs,
      dogadjajId: id,
      kolicina: novaUkupnaKolicina 
    });
    setShowAddResursModal(false);
    const rezervisani = await axios.get(`${config.API_BASE_URL}api/resursi/dogadjaj/${id}`);
    setRezervisaniResursi(rezervisani.data);
  } catch (err) {
    let msg = "Greška!";
    if (err.response && typeof err.response.data === "string") {
      msg = err.response.data;
    } else if (err.response && err.response.data && err.response.data.message) {
      msg = err.response.data.message;
    }
    setAddResursError(msg);
  }
  setAddLoading(false);
};


  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const token = localStorage.getItem('token');

    const napomeneZaSlanje = napomeneList
      .map(n => n.sadrzaj)
      .filter(sadrzaj => !!sadrzaj);

    try {
      await axios.put(
        `${config.API_BASE_URL}api/dogadjaj/${id}`,
        { ...form, napomene: napomeneZaSlanje, id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      alert("Greška pri čuvanju!");
    }
    setSaving(false);
  };

  // Fetch karte and filter by event
  const [karte, setKarte] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');

    const fetchKarte = async () => {
      try {
        const res = await axios.get(config.API_BASE_URL +'api/karta/prikaz', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const karteZaDogadjaj = (res.data || []).filter(k => k.dogadjajId === id);
        setKarte(karteZaDogadjaj);
      } catch (err) {
        console.error("Greška pri dohvatanju karata:", err);
      }
    };

    fetchKarte();
  }, [id]);

  const handleNotifChange = e => {
    const { name, value } = e.target;
    setNotifikacijaForm(f => ({ ...f, [name]: value }));
    setNotifError("");
  };

  const handleNotifSubmit = async e => {
    e.preventDefault();
    if (!notifikacijaForm.naziv || notifikacijaForm.tip === "" || !notifikacijaForm.sadrzaj) {
      setNotifError("Sva polja su obavezna!");
      return;
    }
    setNotifLoading(true);
    try {
      await axios.post(`${config.API_BASE_URL}api/notifikacija/dogadjaj/${id}`,
        {
          naziv: notifikacijaForm.naziv,
          tip: Number(notifikacijaForm.tip),
          sadrzaj: notifikacijaForm.sadrzaj,
          datumSlanja: new Date().toISOString(),
          dogadjajId: id
        }
      );
      setNotifikacijaForm({ naziv: "", tip: "", sadrzaj: "" });
      const res = await axios.get(`${config.API_BASE_URL}api/notifikacija/dogadjaj/${id}`);
      const seen = new Set();
      const uniqueNotifikacije = [];
      for (const n of res.data || []) {
        const key = `${n.naziv}|${n.sadrzaj}|${n.tip}|${n.datumSlanja}`;
        if (!seen.has(key)) {
          seen.add(key);
          uniqueNotifikacije.push(n);
        }
      }
      setNotifikacije(uniqueNotifikacije);
    } catch (err) {
      setNotifError("Greška pri slanju obaveštenja!");
    }
    setNotifLoading(false);
  };

  if (loading) {
    return <div className="event-details-page">Učitavanje...</div>;
  }

  return (
    <div className="event-details-page">
      <div className="event-details-header">
        <h2 className="event-details-title">Detalji događaja</h2>
        <span className="event-details-subtitle">Pregled  podataka o događaju</span>
      </div>

      <div className="event-details-main-card">
        <div className="event-image-wrapper-center">
          {slikaUrl && (
            <img
              src={slikaUrl}
              alt="Slika događaja"
            />
          )}
        </div>

        <div className="main-flex-grid">
          <div className="main-left">
            <div className="details-info-block">
              <div className="details-field">
                <label>Naziv</label>
                <input
                  className="details-value"
                  name="naziv"
                  type="text"
                  value={form.naziv}
                  onChange={handleChange}
                />
              </div>
              <div className="details-field">
                <label>Lokacija</label>
                <input
                  className="details-value"
                  name="lokacija"
                  type="text"
                  value={form.lokacija}
                  onChange={handleChange}
                />
              </div>
              <div className="details-field">
                <label>Opis događaja</label>
                <textarea
                  className="details-value"
                  name="opis"
                  value={form.opis}
                  onChange={handleChange}
                  rows={2}
                />
              </div>
              <div className="form-group">
                <label htmlFor="kapacitet">Kapacitet</label>
                <input
                  id="kapacitet"
                  name="kapacitet"
                  type="number"
                  min="0"
                  value={form.kapacitet}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <form className="main-right" onSubmit={handleSubmit} autoComplete="off">
            <div className="form-group">
              <label htmlFor="datumPocetka">Datum početka</label>
              <input
                id="datumPocetka"
                name="datumPocetka"
                type="date"
                value={form.datumPocetka}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="datumKraja">Datum završetka</label>
              <input
                id="datumKraja"
                name="datumKraja"
                type="date"
                value={form.datumKraja}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="kategorija">Kategorija</label>
              <select
                id="kategorija"
                name="kategorija"
                value={form.kategorija}
                onChange={handleChange}
              >
                <option value="">Odaberite tip događaja</option>
                <option value="Konferencija">Konferencija</option>
                <option value="Utakmica">Utakmica</option>
                <option value="Protest">Protest</option>
                <option value="Festival">Festival</option>
                <option value="Zurka">Zurka</option>
                <option value="Vasar">Vasar</option>
              </select>
            </div>

            <div className="form-group">
              <label>Status događaja</label>
              <input
                type="text"
                value={form.status || ""}
                readOnly
                className="form-control"
              />
            </div>

            <div className="button-row">
              <button
                className="save-btn"
                type="submit"
                disabled={saving}
              >
                {saving ? "Čuvam..." : "Sačuvaj izmene"}
              </button>
              <button
                className="save-btn prijavljeni-lista-btn"
                type="button"
                onClick={() => navigate(`/lista-prijavljenih/${id}`)}
              >
                Lista prijavljenih ({brojPrijavljenih})
              </button>
            </div>

            {saved && <span className="save-success">Sačuvano!</span>}
          </form>
        </div>
      </div>

      <div className="event-details-bottom-row">
        <div className="event-details-right">
          <div className="resources-section">
            <h4>Rezervisani resursi za ovaj događaj</h4>
            <div className="resources-table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Naziv</th>
                    <th>Tip</th>
                    <th>Količina</th>
                    <th>Dobavljač</th>
                    <th>Akcija</th>
                  </tr>
                </thead>
                <tbody>
                  {rezervisaniResursi.map(r => {
                    let rezervisanoZaDogadjaj = 0;
                    if (Array.isArray(r.rezervacije)) {
                      const zaOvaj = r.rezervacije.find(rez => rez.dogadjajId === id);
                      rezervisanoZaDogadjaj = zaOvaj ? zaOvaj.kolicina : 0;
                    }
                    return (
                      <tr key={r.id}>
                        <td>{r.naziv}</td>
                        <td>{TIP_REZERVISANOG_RESURSA[r.tip] || r.tip}</td>
                        <td>{rezervisanoZaDogadjaj}</td>
                        <td>
                          {dobavljaciMap[r.dobavljac] || r.dobavljac}
                        </td>
                        <td>
                          <button
                            className="delete-btn"
                            style={{
                              background: "#c73c6c",
                              color: "#fff",
                              border: "none",
                              padding: "5px 16px",
                              borderRadius: "7px",
                              fontWeight: 600,
                              cursor: "pointer"
                            }}
                            disabled={deleteLoadingId === r.id}
                            onClick={() => handleDeleteReservation(r.id)}
                          >
                            {deleteLoadingId === r.id ? "Brišem..." : "Obriši"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  {rezervisaniResursi.length === 0 && (
                    <tr>
                      <td colSpan={5}>Nema rezervisanih resursa za ovaj događaj.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div style={{ marginTop: 32 }}>
            <button className="add-resource-btn" onClick={() => setShowAddResursModal(true)}>
              + Dodaj novi resurs
            </button>
          </div>

          {showAddResursModal && (
            <div className="modal-overlay">
              <div className="modal-content add-resource-modal" style={{maxWidth:'410px'} }> 
                <h3>Dodaj resurs iz ponude dobavljača</h3>
                <form onSubmit={handleAddResursSubmit}>
                  <div className="form-group">
                    <label>Dobavljač</label>
                    <select
                      value={selectedDobavljac}
                      onChange={e => {
                        setSelectedDobavljac(e.target.value);
                        setSelectedResurs("");
                        setAddResursValues({ naziv: "", opis: "", tip: "", lokacija: "", kolicina: "", ukupnoKolicina: "", rezervacije: [] });
                        setAddResursError("");
                      }}
                      required
                    >
                      <option value="">Izaberi dobavljača...</option>
                      {dobavljaci.map(d => (
                        <option key={d.id} value={d.id}>{d.imeIPrezime || d.korisnickoIme || d.email}</option>
                      ))}
                    </select>
                  </div>
                  {selectedDobavljac && (
                    <div className="form-group">
                      <label>Resurs</label>
                      <select
                        value={selectedResurs}
                        onChange={handleResursSelect}
                        required
                      >
                        <option value="">Izaberi resurs...</option>
                        {resursiDobavljaca.map(r => (
                          <option key={r.id} value={r.id}>
                            {r.naziv} ({TIP_REZERVISANOG_RESURSA[r.tip] || r.tip}) - {r.ukupnoKolicina || r.kolicina} kom.
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  {selectedResurs && (
                    <>
                      <div className="form-group">
                        <label>Naziv</label>
                        <input name="naziv" value={addResursValues.naziv} disabled />
                      </div>
                      <div className="form-group">
                        <label>Opis</label>
                        <input name="opis" value={addResursValues.opis} disabled />
                      </div>
                      <div className="form-group">
                        <label>Tip</label>
                        <input name="tip" value={TIP_REZERVISANOG_RESURSA[addResursValues.tip] || addResursValues.tip} disabled />
                      </div>
                      <div className="form-group">
                        <label>Lokacija</label>
                        <input name="lokacija" value={addResursValues.lokacija} disabled />
                      </div>
                      <div className="form-group">
                        <label>Preostalo</label>
                        <input
                          name="preostaloKolicina"
                          value={
                            (() => {
                              const ukupno = Number(addResursValues.ukupnoKolicina) || 0;
                              const rezervacije = Array.isArray(addResursValues.rezervacije) ? addResursValues.rezervacije : [];
                              const ukupnoRezervisano = rezervacije.reduce((acc, r) => acc + (r.kolicina || 0), 0);
                              // ISPRAVNO:
                              const preostalo = ukupno - ukupnoRezervisano;
                              return `${preostalo} (od ukupno ${ukupno})`;
                            })()
                          }
                          disabled
                        />
                      </div>
                      <div className="form-group">
                        <label>Količina za rezervaciju</label>
                        <input
                          name="kolicina"
                          type="number"
                          value={addResursValues.kolicina}
                          onChange={handleAddResursChange}
                          required
                          min="1"
                        />
                        {(() => {
                          const rezervacije = Array.isArray(addResursValues.rezervacije) ? addResursValues.rezervacije : [];
                          const zaOvajDogadjaj = rezervacije.find(r => r.dogadjajId === id);
                          const trenutnoZaOvajDogadjaj = zaOvajDogadjaj ? zaOvajDogadjaj.kolicina : 0;
                          return trenutnoZaOvajDogadjaj > 0 
                            ? <div style={{fontSize: '.95em', color: '#aaa'}}>Već rezervisano za ovaj događaj: <b>{trenutnoZaOvajDogadjaj}</b></div>
                            : null;
                        })()}
                      </div>
                    </>
                  )}
                  {addResursError && (
                    <div style={{
                      color: "#c73c6c",
                      background: "#3a2132",
                      borderRadius: "6px",
                      margin: "8px 0 4px 0",
                      padding: "7px 12px",
                      fontWeight: 500,
                      fontSize: "1em"
                    }}>
                      {addResursError}
                    </div>
                  )}
                  <button className="save-btn" type="submit" disabled={addLoading || !selectedResurs || !addResursValues.kolicina}>
                    {addLoading ? "Dodajem..." : "Sačuvaj"}
                  </button>
                  <button className="list-btn" type="button" onClick={() => setShowAddResursModal(false)}>
                    Otkaži
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>

        <aside className="event-details-sidebar">
          <h4>Obaveštenje za učesnike</h4>
          <form onSubmit={handleNotifSubmit} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div className="form-group">
              <label htmlFor="nazivObavestenja">Naziv obaveštenja</label>
              <input
                id="nazivObavestenja"
                name="naziv"
                type="text"
                value={notifikacijaForm.naziv}
                onChange={handleNotifChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="tipObavestenja">Tip obaveštenja</label>
              <select
                id="tipObavestenja"
                name="tip"
                value={notifikacijaForm.tip}
                onChange={handleNotifChange}
                required
              >
                <option value="">Odaberi tip</option>
                <option value="0">Informacija</option>
                <option value="1">Upozorenje</option>
                <option value="2">Hitno</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="opisObavestenja">Opis obaveštenja</label>
              <textarea
                id="opisObavestenja"
                name="sadrzaj"
                value={notifikacijaForm.sadrzaj}
                onChange={handleNotifChange}
                rows={2}
                required
              />
            </div>
            <div className="notification-note">
              Svi učesnici biće obavešteni o izmenama vezanim za ovaj događaj
            </div>
            {notifError && <div style={{ color: "#c73c6c" }}>{notifError}</div>}
            <button className="save-btn" type="submit" disabled={notifLoading}>
              {notifLoading ? "Šaljem..." : "Pošalji obaveštenje"}
            </button>
          </form>
          <div style={{ marginTop: 24 }}>
            <h5>Poslate notifikacije:</h5>
            {notifikacije.length === 0 ? (
              <div style={{ color: "#aaa" }}>Nema notifikacija za ovaj događaj.</div>
            ) : (
              <ul style={{ listStyle: "none", padding: 0 }}>
                {notifikacije.map((n, idx) => (
                  <li key={idx} style={{ borderBottom: "1px solid #333", marginBottom: 8, paddingBottom: 8 }}>
                    <div><b>{n.naziv}</b> <span style={{ color: "#ccc" }}>[{TIP_NOTIFIKACIJE[n.tip] || n.tip}]</span></div>
                    <div style={{ fontSize: ".95em" }}>{n.sadrzaj}</div>
                    <div style={{ fontSize: ".8em", color: "#888" }}>{new Date(n.datumSlanja).toLocaleString()}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </aside>
      </div>
<div className='event-details-bottom-row'>
        {statistika&&<div className='event-details-right' style={{marginTop:34,marginBottom:15}}>
          <div className='resources-section'>
            <h4 >Statistika događaja</h4>
            <div>
              <div className="resources-table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Kapacitet</th>
                      <th>Prodate karte</th>
                      <th>Broj prijavljenih</th>
                    </tr>
                  </thead>
                  <tr>
                    <td>{statistika.kapacitet}</td>
                    <td>{statistika.prodatihKarata}</td>
                    <td>{statistika.prijavljenihUcesnika}</td>
                  
                  </tr>
                </table>
              </div>
              <div className="resources-table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Popunjenost</th>
                      <th>Broj napomena</th>
                      <th>Broj obaveštenja</th>
                    </tr>
                  </thead>
                  <tr>
                    <td>{statistika.popunjenostProcenat}%</td>
                    <td>{statistika.brojNapomena}</td>
                    <td>{statistika.brojNotifikacija}</td>
                  </tr>
                </table>
              </div>
              <button onClick={()=>handleDownload()} className='save-btn'>Preuzmi CSV</button>
            </div>
          </div>
        </div>}
      </div>

      {/* BLOK ZA DANE DOGAĐAJA SA KARTAMA */}
      <div className="event-days-section">
        <h3>Dani događaja</h3>
        {daniDogadjaja.map(dan => {
          const danIdStr = typeof dan.id === "object" && dan.id.$oid ? dan.id.$oid : dan.id;

          // filter cards for this day and current event
          const karteZaDan = karte.filter(karta =>
            karta.danId === danIdStr && karta.dogadjajId === id
          );

          const aktivnostiZaDan = dan.aktivnosti || [];

          return (
            <div key={danIdStr} className="day-block">
              <h4>
                {dan.datumOdrzavanja ? new Date(dan.datumOdrzavanja).toLocaleDateString() : ""}
                {dan.naziv ? ` - ${dan.naziv}` : ""}
              </h4>
              {dan.opis && <p>{String(dan.opis).replace(/<[^>]+>/g, '')}</p>}

              {karteZaDan.length > 0 ? (
                <table className="day-cards-table">
                  <thead>
                    <tr>
                      <th>Naziv karte</th>
                      <th>Tip</th>
                      <th>Količina</th>
                      <th>Cena</th>
                    </tr>
                  </thead>
                  <tbody>
                    {karteZaDan.map(karta => (
                      <tr key={karta.id}>
                        <td>{karta.naziv}</td>
                        <td>{karta.tip}</td>
                        <td>{karta.brojKarata}</td>
                        <td>{karta.cena} RSD</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>Za ovaj dan nema karata.</p>
              )}

              {/* Areas */}
{!podrucjaLoading && Array.isArray(podrucja) && Array.isArray(podrucja[0]?.koordinate) && Array.isArray(podrucja[0]?.koordinate?.[0]) && podrucja[0].koordinate[0].length >= 2 && (
  <div className="day-areas-section">
    <h5>Područja</h5>
    <MapContainer
      center={[podrucja[0].koordinate[0][0], podrucja[0].koordinate[0][1]]}
      zoom={14}
      style={{ height: '450px', width: '100%' }}
      scrollWheelZoom={true}
      dragging={true}
      zoomControl={true}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {Array.isArray(podrucja) && podrucja
        .filter(p => Array.isArray(p?.koordinate) && p.koordinate.length > 0)
        .map((p, idx) => (
          <Polygon key={idx} positions={p.koordinate} color={p.HEXboja || 'purple'}>
            <Tooltip permanent direction="center" offset={[0, 0]}>
              {p.naziv}
            </Tooltip>
          </Polygon>
        ))}
    </MapContainer>
  </div>
)}{/* Activities */}
              {aktivnostiZaDan.length > 0 && (
                <div className="day-activities">
                  <h5>Aktivnosti:</h5>
                  <ul>
                    {aktivnostiZaDan.map(aktivnost => (
                      <li key={aktivnost.id}>
                        <strong>{aktivnost.naziv}</strong> ({aktivnost.tip})<br />
                        {aktivnost.opis ? String(aktivnost.opis).replace(/<[^>]+>/g, '') : ""}<br />
                        {aktivnost.datumVremePocetka && new Date(aktivnost.datumVremePocetka).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        {" - "}
                        {aktivnost.datumVremeKraja && new Date(aktivnost.datumVremeKraja).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        {aktivnost.lokacija && <>, Lokacija: {aktivnost.lokacija}</>}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

            </div>
          );
        })}
      </div>
      <div className='event-days-section'>
        <h3>Cenovnik</h3>
        {!cenovnikLoading&&(
          <table className='day-cards-table'>
                  <thead>
                    <tr>
                      <th>Naziv</th>
                      <th>Opis</th>
                      <th>Količina</th>
                      <th>Cena</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cenovnikStavke.map((c)=>{
                      return (
                        <tr>
                          <td>{c.naziv}</td>
                          <td>{c.opis}</td>
                          <td>{c.kolicina}</td>
                          <td>{c.cena}RSD</td>
                        </tr>
                      )
                    })}
                  </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default EventDetailsPage;
