import React, { useState, useEffect } from "react";
import SupplierSidebar from "./SupplierSidebar";
import "./SupplierProfile.css";
import config from '../config';
export default function SupplierProfile() {
  const [form, setForm] = useState({
    imeIPrezime: "",
    korisnickoIme: "",
    brojTelefona: "",
    adresa: "",
    email: "",
    sifra: "",
    novaSifra: "",
    potvrdiSifru: ""
  });
  const [greske, setGreske] = useState({});
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [initialForm, setInitialForm] = useState(form);

  // Funkcija za učitavanje profila iz baze
  const fetchProfile = async () => {
    const dobavljacId = localStorage.getItem("dobavljacId");
    if (!dobavljacId) {
      alert("Niste prijavljeni!");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${config.API_BASE_URL}api/dobavljaci/${dobavljacId}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      const updated = {
        imeIPrezime: data.imeIPrezime || "",
        korisnickoIme: data.korisnickoIme || "",
        brojTelefona: data.brojTelefona || "",
        adresa: data.adresa || "",
        email: data.email || "",
        sifra: "",
        novaSifra: "",
        potvrdiSifru: ""
      };
      setForm(updated);
      setInitialForm(updated);
    } catch {
      alert("Greška pri učitavanju profila!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    setGreske(g => ({ ...g, [name]: "" }));
  };

  // VALIDACIJA
  const validiraj = () => {
    let err = {};
    // Ime i prezime: samo slova i razmaci, min 2 reči
    if (
      !form.imeIPrezime.trim() ||
      !/^[A-Za-zĆČĐŠŽćčđšžА-Яа-я\s]+$/.test(form.imeIPrezime.trim()) ||
      form.imeIPrezime.trim().split(/\s+/).length < 2
    ) {
      err.imeIPrezime = "Ime i prezime: samo slova, bez brojeva, minimum dve reči.";
    }
    // Broj telefona: samo cifre, 9-15 cifara
    if (!form.brojTelefona.trim() || !/^\d{9,15}$/.test(form.brojTelefona.trim())) {
      err.brojTelefona = "Broj telefona: samo cifre (9-15).";
    }
    // Korisničko ime
    if (!form.korisnickoIme.trim()) {
      err.korisnickoIme = "Korisničko ime je obavezno.";
    }
    // Adresa
    if (!form.adresa.trim()) {
      err.adresa = "Adresa je obavezna.";
    }
    // Email
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      err.email = "Email adresa nije validna.";
    }
    // Šifra - validiraj samo ako neko polje nije prazno
    if (form.sifra || form.novaSifra || form.potvrdiSifru) {
      if (!form.sifra) err.sifra = "Unesite trenutnu šifru!";
      if (!form.novaSifra) err.novaSifra = "Unesite novu šifru!";
      else if (form.novaSifra.length < 8) err.novaSifra = "Nova šifra mora imati najmanje 8 karaktera!";
      if (!form.potvrdiSifru) err.potvrdiSifru = "Potvrdite novu šifru!";
      if (form.novaSifra && form.potvrdiSifru && form.novaSifra !== form.potvrdiSifru)
        err.potvrdiSifru = "Nova šifra i potvrda se ne poklapaju!";
    }
    setGreske(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!validiraj()) return; // Prikaži greške ispod polja
    const dobavljacId = localStorage.getItem("dobavljacId");
    if (!dobavljacId) {
      alert("Niste prijavljeni!");
      return;
    }
    setLoading(true);
    try {
      // Ažuriraj podatke
      const updateRes = await fetch(`${config.API_BASE_URL}api/dobavljaci/${dobavljacId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: dobavljacId,
          imeIPrezime: form.imeIPrezime,
          korisnickoIme: form.korisnickoIme,
          brojTelefona: form.brojTelefona,
          adresa: form.adresa,
          email: form.email
        }),
      });
      if (!updateRes.ok) throw new Error();

      // Promeni šifru ako je potrebno
      if (form.sifra && form.novaSifra && form.novaSifra === form.potvrdiSifru) {
        const passRes = await fetch(`${config.API_BASE_URL}api/dobavljaci/${dobavljacId}/promeni-sifru`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            trenutnaSifra: form.sifra,
            novaSifra: form.novaSifra
          })
        });
        if (!passRes.ok) {
          const msg = await passRes.text();
          setGreske(g => ({ ...g, sifra: msg || "Greška pri promeni šifre!" }));
          setLoading(false);
          return;
        }
      }

      await fetchProfile();
      alert("Izmene sačuvane!");
      setEditMode(false);
      setForm(f => ({ ...f, sifra: "", novaSifra: "", potvrdiSifru: "" }));
    } catch (err) {
      alert("Greška prilikom čuvanja izmena!");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setForm({ ...initialForm, sifra: "", novaSifra: "", potvrdiSifru: "" });
    setEditMode(false);
    setGreske({});
  };

  return (
    <div className="supplier-dashboard-wrapper">
      <SupplierSidebar />
      <div className="supplier-profile-page">
        <div className="supplier-profile-card">
          <div className="supplier-profile-left">
            <div className="supplier-profile-avatar">
              <span role="img" aria-label="avatar" style={{ fontSize: 64, color: "#fff" }}>👤</span>
            </div>
            <div className="supplier-profile-name">{form.imeIPrezime}</div>
            <div className="supplier-profile-role">Dobavljač</div>
            {/* <div className="supplier-profile-img"></div> */}
          </div>
          <div className="supplier-profile-info">
            <h2 className="supplier-profile-title">Informacije o nalogu</h2>
            <form className="supplier-profile-form" onSubmit={handleSubmit}>
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
                <label>E-mail adresa</label>
                <input name="email" value={form.email} className="profile-form-input" disabled />
                {greske.email && <span className="error-message">{greske.email}</span>}
              </div>
              <div className="profile-form-row">
                <label>Trenutna šifra</label>
                <input
                  name="sifra"
                  type="password"
                  value={form.sifra}
                  onChange={handleChange}
                  className={`profile-form-input ${greske.sifra ? "input-error" : ""}`}
                  placeholder="Unesite trenutnu šifru"
                  disabled={loading || !editMode}
                />
                {greske.sifra && <span className="error-message">{greske.sifra}</span>}
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
          </div>
        </div>
      </div>
    </div>
  );
}