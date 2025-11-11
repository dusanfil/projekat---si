import React, { useState, useEffect } from "react";
import "./Profile.css";
import config from '../config';
export default function Profile() {
  const [form, setForm] = useState({
    imeIPrezime: "",
    korisnickoIme: "",
    brojTelefona: "",
    adresa: "",
    email: "",
    trenutnaSifra: "",
    novaSifra: "",
    potvrdiSifru: ""
  });
  const [greske, setGreske] = useState({});
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [initialForm, setInitialForm] = useState(form);
  const [globalError, setGlobalError] = useState("");

  useEffect(() => {
    async function fetchProfile() {
      const organizatorId = localStorage.getItem("organizatorId");
      if (!organizatorId) return;
      setLoading(true);
      try {
        const res = await fetch(`${config.API_BASE_URL}api/organizatori/${organizatorId}`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        const updated = {
          imeIPrezime: data.imeIPrezime || "",
          korisnickoIme: data.korisnickoIme || "",
          brojTelefona: data.brojTelefona || "",
          adresa: data.adresa || "",
          email: data.email || "",
          trenutnaSifra: "",
          novaSifra: "",
          potvrdiSifru: ""
        };
        setForm(updated);
        setInitialForm(updated);
      } catch {
        setGlobalError("Greška pri učitavanju profila!");
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    setGreske(g => ({ ...g, [name]: "" }));
    setGlobalError("");
  };

  const validiraj = () => {
    let err = {};
    if (
      !form.imeIPrezime.trim() ||
      !/^[A-Za-zĆČĐŠŽćčđšžА-Яа-я\s]+$/.test(form.imeIPrezime.trim()) ||
      form.imeIPrezime.trim().split(/\s+/).length < 2
    ) {
      err.imeIPrezime = "Ime i prezime: samo slova, bez brojeva, minimum dve reči.";
    }
    if (!form.brojTelefona.trim() || !/^\d{9,15}$/.test(form.brojTelefona.trim())) {
      err.brojTelefona = "Broj telefona: samo cifre (9-15).";
    }
    if (!form.korisnickoIme.trim()) {
      err.korisnickoIme = "Korisničko ime je obavezno.";
    }
    if (!form.adresa.trim()) {
      err.adresa = "Adresa je obavezna.";
    }
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      err.email = "Email adresa nije validna.";
    }
    if (form.trenutnaSifra || form.novaSifra || form.potvrdiSifru) {
      if (!form.trenutnaSifra) err.trenutnaSifra = "Unesite trenutnu šifru!";
      if (!form.novaSifra) err.novaSifra = "Unesite novu šifru!";
      else if (form.novaSifra.length < 8) err.novaSifra = "Nova šifra mora imati najmanje 8 karaktera!";
      if (!form.potvrdiSifru) err.potvrdiSifru = "Potvrdite novu šifru!";
      if (form.novaSifra && form.potvrdiSifru && form.novaSifra !== form.potvrdiSifru)
        err.potvrdiSifru = "Nova šifra i potvrda se ne poklapaju!";
    }
    setGreske(err);
    return Object.keys(err).length === 0;
  };

  // Funkcija za mapiranje backend poruka na polja
  const mapBackendErrorToField = msg => {
    const lower = msg.toLowerCase();
    if (lower.includes("ime i prezime")) return { imeIPrezime: msg };
    if (lower.includes("broj telefona")) return { brojTelefona: msg };
    if (lower.includes("korisničko ime")) return { korisnickoIme: msg };
    if (lower.includes("adresa")) return { adresa: msg };
    if (lower.includes("email")) return { email: msg };
    if (lower.includes("šifra") || lower.includes("sifra")) return { trenutnaSifra: msg };
    return {}; // fallback
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setGlobalError("");
    if (!validiraj()) return;
    const organizatorId = localStorage.getItem("organizatorId");
    if (!organizatorId) {
      setGlobalError("Niste prijavljeni!");
      return;
    }
    setLoading(true);
    try {
      const updateRes = await fetch(`${config.API_BASE_URL}api/organizatori/${organizatorId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: organizatorId,
          imeIPrezime: form.imeIPrezime,
          korisnickoIme: form.korisnickoIme,
          brojTelefona: form.brojTelefona,
          adresa: form.adresa,
          email: form.email
        }),
      });
      if (!updateRes.ok) {
        const msg = await updateRes.text();
        const greskePolje = mapBackendErrorToField(msg);
        if (Object.keys(greskePolje).length > 0) {
          setGreske(g => ({ ...g, ...greskePolje }));
        } else {
          setGlobalError(msg); // fallback ako ne prepozna polje
        }
        setLoading(false);
        return;
      }

      // Promena šifre
      if (
        form.trenutnaSifra &&
        form.novaSifra &&
        form.potvrdiSifru &&
        form.novaSifra === form.potvrdiSifru &&
        form.novaSifra.length >= 8
      ) {
        const passRes = await fetch(`${config.API_BASE_URL}api/organizatori/${organizatorId}/promeni-sifru`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            trenutnaSifra: form.trenutnaSifra,
            novaSifra: form.novaSifra
          })
        });
        if (!passRes.ok) {
          const msg = await passRes.text();
          const greskePolje = mapBackendErrorToField(msg);
          if (Object.keys(greskePolje).length > 0) {
            setGreske(g => ({ ...g, ...greskePolje }));
          } else {
            setGlobalError(msg);
          }
          setLoading(false);
          return;
        }
      }
      setEditMode(false);
      setForm(f => ({ ...f, trenutnaSifra: "", novaSifra: "", potvrdiSifru: "" }));
      setGreske({});
      setGlobalError("");
      alert("Izmene sačuvane!");
    } catch (err) {
      setGlobalError("Greška pri čuvanju.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setForm({ ...initialForm, trenutnaSifra: "", novaSifra: "", potvrdiSifru: "" });
    setEditMode(false);
    setGreske({});
    setGlobalError("");
  };

  return (
    <div className="organizer-profile-page">
      <div className="organizer-profile-card">
        <div className="organizer-profile-left">
          <div className="organizer-profile-avatar">
            <span role="img" aria-label="avatar" style={{ fontSize: 64, color: "#fff" }}>👤</span>
          </div>
          <div className="organizer-profile-name">{form.imeIPrezime}</div>
          <div className="organizer-profile-role">Organizator</div>
          <div className="organizer-profile-img"></div>
        </div>
        <div className="organizer-profile-info">
          <h2 className="organizer-profile-title">Informacije o nalogu</h2>
          <form className="organizer-profile-form" onSubmit={handleSubmit}>
            <div className="profile-form-row">
              <label>Ime i prezime</label>
              <input
                name="imeIPrezime"
                value={form.imeIPrezime}
                onChange={handleChange}
                className={`profile-form-input ${greske.imeIPrezime ? "input-error" : ""}`}
                disabled={loading || !editMode}
              />
              {greske.imeIPrezime && <span className="error-message">{greske.imeIPrezime}</span>}
            </div>
            <div className="profile-form-row">
              <label>E-mail adresa</label>
              <input name="email" value={form.email} className="profile-form-input" disabled />
              {greske.email && <span className="error-message">{greske.email}</span>}
            </div>
            <div className="profile-form-row">
              <label>Korisničko ime</label>
              <input
                name="korisnickoIme"
                value={form.korisnickoIme}
                onChange={handleChange}
                className={`profile-form-input ${greske.korisnickoIme ? "input-error" : ""}`}
                disabled={loading || !editMode}
              />
              {greske.korisnickoIme && <span className="error-message">{greske.korisnickoIme}</span>}
            </div>
            <div className="profile-form-row">
              <label>Broj telefona</label>
              <input
                name="brojTelefona"
                value={form.brojTelefona}
                onChange={handleChange}
                className={`profile-form-input ${greske.brojTelefona ? "input-error" : ""}`}
                disabled={loading || !editMode}
              />
              {greske.brojTelefona && <span className="error-message">{greske.brojTelefona}</span>}
            </div>
            <div className="profile-form-row">
              <label>Adresa</label>
              <input
                name="adresa"
                value={form.adresa}
                onChange={handleChange}
                className={`profile-form-input ${greske.adresa ? "input-error" : ""}`}
                disabled={loading || !editMode}
              />
              {greske.adresa && <span className="error-message">{greske.adresa}</span>}
            </div>
            <div className="profile-form-row">
              <label>Trenutna šifra</label>
              <input
                name="trenutnaSifra"
                type="password"
                value={form.trenutnaSifra}
                onChange={handleChange}
                className={`profile-form-input ${greske.trenutnaSifra ? "input-error" : ""}`}
                placeholder="Unesite trenutnu šifru"
                disabled={loading || !editMode}
              />
              {greske.trenutnaSifra && <span className="error-message">{greske.trenutnaSifra}</span>}
            </div>
            <div className="profile-form-row">
              <label>Nova šifra</label>
              <input
                name="novaSifra"
                type="password"
                value={form.novaSifra}
                onChange={handleChange}
                className={`profile-form-input ${greske.novaSifra ? "input-error" : ""}`}
                placeholder="Unesite novu šifru"
                disabled={loading || !editMode}
              />
              {greske.novaSifra && <span className="error-message">{greske.novaSifra}</span>}
            </div>
            <div className="profile-form-row">
              <label>Potvrdite novu šifru</label>
              <input
                name="potvrdiSifru"
                type="password"
                value={form.potvrdiSifru}
                onChange={handleChange}
                className={`profile-form-input ${greske.potvrdiSifru ? "input-error" : ""}`}
                placeholder="Potvrdite novu šifru"
                disabled={loading || !editMode}
              />
              {greske.potvrdiSifru && <span className="error-message">{greske.potvrdiSifru}</span>}
            </div>
            {!editMode ? (
              <button
                type="button"
                className="profile-save-btn"
                onClick={() => setEditMode(true)}
                disabled={loading}
              >
                Izmeni profil
              </button>
            ) : (
              <div style={{ display: "flex", gap: 16 }}>
                <button
                  type="submit"
                  className="profile-save-btn"
                  disabled={loading}
                >
                  Sačuvajte izmene
                </button>
                <button
                  type="button"
                  className="profile-cancel-btn"
                  onClick={handleCancel}
                  disabled={loading}
                >
                  Otkaži
                </button>
              </div>
            )}
          </form>
          {globalError && (
            <div className="global-error-message">
              {globalError}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}