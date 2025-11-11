import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar"; 
import "./ProfilePage.css";
import config from '../config';
export default function OrganizerProfile() {
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

  const fetchProfile = async () => {
  const organizatorId = localStorage.getItem("organizatorId");
  const token = localStorage.getItem("token");
  if (!organizatorId) {
    alert("Niste prijavljeni!");
    return;
  }
  setLoading(true);
  try {
    const res = await fetch(`${config.API_BASE_URL}api/organizatori/${organizatorId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
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

  const validiraj = () => {
    let err = {};
    if (
      !form.imeIPrezime.trim() ||
      !/^[A-Za-zĆČĐŠŽćčđšžА-Яа-я\s]+$/.test(form.imeIPrezime.trim()) ||
      form.imeIPrezime.trim().split(/\s+/).length < 2
    ) err.imeIPrezime = "Ime i prezime: samo slova, minimum dve reči.";
    if (!form.brojTelefona.trim() || !/^\d{9,15}$/.test(form.brojTelefona.trim()))
      err.brojTelefona = "Broj telefona: samo cifre (9-15).";
    if (!form.korisnickoIme.trim()) err.korisnickoIme = "Korisničko ime je obavezno.";
    if (!form.adresa.trim()) err.adresa = "Adresa je obavezna.";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      err.email = "Email adresa nije validna.";

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
  if (!validiraj()) return;

  const organizatorId = localStorage.getItem("organizatorId");
  const token = localStorage.getItem("token");
  if (!organizatorId) return;

  setLoading(true);
  try {
    // 1) Update osnovnih podataka
    const updateRes = await fetch(`${config.API_BASE_URL}api/organizatori/azuriraj`, {
      method: "PUT",
      headers: { 
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        id: organizatorId,
        imeIPrezime: form.imeIPrezime,
        korisnickoIme: form.korisnickoIme,
        brojTelefona: form.brojTelefona,
        adresa: form.adresa,
        email: form.email
      })
    });
    if (!updateRes.ok) {
      const msg = await updateRes.text();
      throw new Error(msg || "Greška pri čuvanju profila");
    }

    // 2) Promena šifre (ako je popunjena)
    if (form.sifra && form.novaSifra && form.novaSifra === form.potvrdiSifru) {
      const passRes = await fetch(`${config.API_BASE_URL}api/organizatori/${organizatorId}/promeni-sifru`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          organizatorId,
          trenutnaSifra: form.sifra,
          novaSifra: form.novaSifra
        })
      });
      if (!passRes.ok) {
        const msg = await passRes.text();
        setGreske(g => ({ ...g, sifra: msg || "Trenutna šifra nije ispravna!" }));
        setLoading(false);
        return;
      }
    }

    await fetchProfile();
    alert("Izmene sačuvane!");
    setEditMode(false);
    setForm(f => ({ ...f, sifra: "", novaSifra: "", potvrdiSifru: "" }));
  } catch (err) {
    alert(err.message || "Greška pri čuvanju izmena!");
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
  <div className="organizer-dashboard-wrapper">
    <Sidebar />
    <div className="organizer-profile-page">
      <div className="organizer-profile-card">
        <div className="organizer-profile-left">
          <div className="organizer-profile-avatar">
            <span role="img" aria-label="avatar" style={{ fontSize: 64, color: "#fff" }}>👤</span>
          </div>
          <div className="organizer-profile-name">{form.imeIPrezime}</div>
          <div className="organizer-profile-role">Organizator</div>
        </div>
        <div className="organizer-profile-info">
          <h2 className="organizer-profile-title">Informacije o nalogu</h2>
          <form className="organizer-profile-form" onSubmit={handleSubmit}>
            {[
              {name:"imeIPrezime", label:"Ime i prezime"},
              {name:"korisnickoIme", label:"Korisničko ime"},
              {name:"brojTelefona", label:"Broj telefona"},
              {name:"adresa", label:"Adresa"},
              {name:"email", label:"E-mail adresa"},
              {name:"sifra", label:"Trenutna šifra"},
              {name:"novaSifra", label:"Nova šifra"},
              {name:"potvrdiSifru", label:"Potvrdite novu šifru"}
            ].map(field => (
              <div className="profile-form-row" key={field.name}>
                <label>{field.label}</label>
                <input
                  name={field.name}
                  type={
                    field.name === "sifra" ||
                    field.name === "novaSifra" ||
                    field.name === "potvrdiSifru"
                      ? "password"
                      : "text"
                  }
                  value={form[field.name]}
                  onChange={handleChange}
                  placeholder={
                    field.name === "sifra"
                      ? "Unesite trenutnu šifru"
                      : field.name === "novaSifra"
                      ? "Unesite novu šifru"
                      : field.name === "potvrdiSifru"
                      ? "Potvrdite novu šifru"
                      : ""
                  }
                  className={`profile-form-input ${greske[field.name] ? "input-error" : ""}`}
                  disabled={loading || !editMode || field.name === "email"}
                  title={field.name === "email" ? "E-mail adresu nije moguće menjati" : ""}
                />
                {greske[field.name] && <span className="error-message">{greske[field.name]}</span>}
              </div>
            ))}
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
                <button type="submit" className="profile-save-btn" disabled={loading}>Sačuvajte izmene</button>
                <button type="button" className="profile-cancel-btn" onClick={handleCancel} disabled={loading}>Otkaži</button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  </div>
);
}
