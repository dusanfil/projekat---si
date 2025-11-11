import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./Register.css";
import logo from "./logo.png";
import config from '../config';
const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
);
const EyeOffIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
);

export default function Register() {
  const [korisnickoIme, setKorisnickoIme] = useState("");
  const [imeIPrezime, setImeIPrezime] = useState("");
  const [adresa, setAdresa] = useState("");
  const [email, setEmail] = useState("");
  const [brojTelefona, setBrojTelefona] = useState("");
  const [lozinka, setLozinka] = useState("");
  const [potvrdaLozinke, setPotvrdaLozinke] = useState("");
  const [tipNaloga, setTipNaloga] = useState("Organizator");
  const [greskePolja, setGreskePolja] = useState({});
  const [greska, setGreska] = useState("");
  const [uspeh, setUspeh] = useState("");
  const [loading, setLoading] = useState(false);
  const [showLozinka, setShowLozinka] = useState(false);
  const [showPotvrdaLozinke, setShowPotvrdaLozinke] = useState(false);
  const [prikaziVerifikaciju, setPrikaziVerifikaciju] = useState(false);

  const navigate = useNavigate();

  const podnesiFormu = async (e) => {
    e.preventDefault();
    setGreska("");
    setUspeh("");
    setLoading(true);

    const noviGreske = {};
    if (!korisnickoIme.trim()) noviGreske.korisnickoIme = "Korisničko ime je obavezno.";
    if (!imeIPrezime.trim()) noviGreske.imeIPrezime = "Ime i prezime je obavezno.";
    if (!adresa.trim()) noviGreske.adresa = "Adresa je obavezna.";
    if (!email.trim()) noviGreske.email = "Email je obavezan.";
    else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) noviGreske.email = "Neispravan format email adrese.";
    if (!brojTelefona.trim()) noviGreske.brojTelefona = "Broj telefona je obavezan.";
    if (!lozinka) noviGreske.lozinka = "Lozinka je obavezna.";
    else if (lozinka.length < 6) noviGreske.lozinka = "Lozinka mora imati najmanje 6 karaktera.";
    if (!potvrdaLozinke) noviGreske.potvrdaLozinke = "Potvrda lozinke je obavezna.";
    else if (lozinka !== potvrdaLozinke) noviGreske.potvrdaLozinke = "Lozinke se ne poklapaju.";

    setGreskePolja(noviGreske);
    if (Object.keys(noviGreske).length > 0) {
      setLoading(false);
      return;
    }

    try {
      if (tipNaloga === "Organizator") {
        await axios.post(config.API_BASE_URL +"api/auth/registracija/organizator", {
          ImeIPrezime: imeIPrezime,
          Adresa: adresa,
          Email: email,
          KorisnickoIme: korisnickoIme,
          BrojTelefona: brojTelefona,
          Sifra: lozinka,
          Uloga: "Organizator"
        });
        setPrikaziVerifikaciju(true);
        setLoading(false);
      } else if (tipNaloga === "Dobavljac") {
        await axios.post(config.API_BASE_URL +"api/auth/registracija/dobavljac", {
          ImeIPrezime: imeIPrezime,
          Adresa: adresa,
          Email: email,
          KorisnickoIme: korisnickoIme,
          BrojTelefona: brojTelefona,
          Sifra: lozinka,
          Uloga: "Dobavljac"
        });
        setPrikaziVerifikaciju(true);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      if (error.response && error.response.data) {
        const porukaGreske = error.response.data.title || error.response.data.message || 'Greška sa servera.';
        setGreska(porukaGreske);
      } else {
        setGreska("Došlo je do greške pri registraciji.");
      }
    }
  };

  if (prikaziVerifikaciju) {
    return (
      <div className="register-page">
        <div className="register-container">
          <div className="logo-container">
            <img src={logo} alt="Vexa Logo" className="logo-img" />
          </div>
          <h2 className="success-message">Registracija uspešna!</h2>
          <p className="success-message">
            Poslali smo vam email za verifikaciju naloga.<br />
            Molimo proverite svoju email adresu i kliknite na verifikacioni link pre korišćenja aplikacije.
          </p>
          <button className="submit-btn" onClick={() => navigate("/login")}>
            Već ste verifikovali? Prijavite se
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="register-page">
      <div className="register-container">
        <form onSubmit={podnesiFormu} noValidate autoComplete="off">
          <div className="logo-container">
            <img src={logo} alt="Vexa Logo" className="logo-img" />
          </div>
          <h1 className="form-title">Registracija</h1>
          <div className="input-group">
            <label htmlFor="imeIPrezime">Ime i prezime:</label>
            <input id="imeIPrezime" type="text" value={imeIPrezime} onChange={(e) => setImeIPrezime(e.target.value)} disabled={loading} autoComplete="name" />
            {greskePolja.imeIPrezime && <p className="field-error">{greskePolja.imeIPrezime}</p>}
          </div>
          <div className="input-group">
            <label htmlFor="adresa">Adresa:</label>
            <input id="adresa" type="text" value={adresa} onChange={(e) => setAdresa(e.target.value)} disabled={loading} autoComplete="street-address" />
            {greskePolja.adresa && <p className="field-error">{greskePolja.adresa}</p>}
          </div>
          <div className="input-group">
            <label htmlFor="korisnickoIme">Korisničko ime:</label>
            <input id="korisnickoIme" type="text" value={korisnickoIme} onChange={(e) => setKorisnickoIme(e.target.value)} disabled={loading} autoComplete="username" />
            {greskePolja.korisnickoIme && <p className="field-error">{greskePolja.korisnickoIme}</p>}
          </div>
          <div className="input-group">
            <label htmlFor="email">Email:</label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading} autoComplete="email" />
            {greskePolja.email && <p className="field-error">{greskePolja.email}</p>}
          </div>
          <div className="input-group">
            <label htmlFor="brojTelefona">Broj telefona:</label>
            <input id="brojTelefona" type="tel" value={brojTelefona} onChange={(e) => setBrojTelefona(e.target.value)} disabled={loading} autoComplete="tel" />
            {greskePolja.brojTelefona && <p className="field-error">{greskePolja.brojTelefona}</p>}
          </div>
          <div className="input-group" style={{position: "relative"}}>
            <label htmlFor="lozinka">Šifra:</label>
              <input id="lozinka" type={showLozinka ? 'text' : 'password'} value={lozinka} onChange={(e) => setLozinka(e.target.value)} disabled={loading} autoComplete="new-password" style={{paddingRight: "45px", borderRadius:"22px"}} />
              <button style={{marginTop:'15px'}} type="button" className="password-toggle-icon" onClick={() => setShowLozinka(!showLozinka)}>
                {showLozinka ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            {greskePolja.lozinka && <p className="field-error">{greskePolja.lozinka}</p>}
          </div>
          <div className="input-group" style={{position: "relative"}}>
            <label htmlFor="potvrdaLozinke">Potvrdi šifru:</label>
              <input id="potvrdaLozinke" type={showPotvrdaLozinke ? 'text' : 'password'} value={potvrdaLozinke} onChange={(e) => setPotvrdaLozinke(e.target.value)} disabled={loading} autoComplete="new-password" style={{paddingRight: "45px", borderRadius:"22px"}} />
              <button style={{marginTop:'15px'}} type="button" className="password-toggle-icon" onClick={() => setShowPotvrdaLozinke(!showPotvrdaLozinke)}>
                {showPotvrdaLozinke ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            {greskePolja.potvrdaLozinke && <p className="field-error">{greskePolja.potvrdaLozinke}</p>}
          </div>
          {greska && <p className="error-message">{greska}</p>}
          {uspeh && <p className="success-message">{uspeh}</p>}
          <div className="input-group radio-nalog-wrap">
            <span className="radio-label-title">Tip naloga:</span>
            <div className="radio-row-below">
              <label>
                <input
                  type="radio"
                  name="tipNaloga"
                  value="Organizator"
                  checked={tipNaloga === "Organizator"}
                  onChange={() => setTipNaloga("Organizator")}
                />
                Organizator
              </label>
              <label>
                <input
                  type="radio"
                  name="tipNaloga"
                  value="Dobavljac"
                  checked={tipNaloga === "Dobavljac"}
                  onChange={() => setTipNaloga("Dobavljac")}
                />
                Dobavljač
              </label>
            </div>
          </div>
          <div className="login-link">
            <p>Već imaš svoj nalog?</p>
            <Link to="/">Uloguj se</Link>
          </div>
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Registrujem se..." : "Registracija"}
          </button>
        </form>
      </div>
    </div>
  );
}