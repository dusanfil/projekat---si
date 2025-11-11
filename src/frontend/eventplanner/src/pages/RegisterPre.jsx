// Paketi i fajlovi
import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import config from '../config';
// CSS i logo
import "./Register.css"; 
import logo from "./logo.png";

// SVG ikone koje stoje pored lozinke
const EyeIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg> );
const EyeOffIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg> );

export default function Register() {
  // State-ovi
  const [korisnickoIme, setKorisnickoIme] = useState("");
  const [email, setEmail] = useState("");
  const [brojTelefona, setBrojTelefona] = useState("");
  const [lozinka, setLozinka] = useState("");
  const [potvrdaLozinke, setPotvrdaLozinke] = useState("");
  const [greskePolja, setGreskePolja] = useState({});
  const [greska, setGreska] = useState("");
  const [uspeh, setUspeh] = useState("");
  const [loading, setLoading] = useState(false); // Dodato za bolje UX
  const navigate = useNavigate();

  // Dodatni state za prikaz ili sakrivanje šifre
  const [showLozinka, setShowLozinka] = useState(false);
  const [showPotvrdaLozinke, setShowPotvrdaLozinke] = useState(false);

  // ISPRAVLJEN CATCH kao i u Login.jsx
  const podnesiFormu = async (e) => {
    e.preventDefault();
    setGreska("");
    setUspeh("");
    setLoading(true);

    const noviGreske = {};
    if (!korisnickoIme.trim()) noviGreske.korisnickoIme = "Korisničko ime je obavezno.";
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
      await axios.post(config.API_BASE_URL + "api/auth/registracija/organizator", {
        imeIPrezime:'Ime Prezime', email, korisnickoIme,  sifra:lozinka, uloga:'Organizator'
      });

      setUspeh("Registracija uspešna! Preusmeravamo na prijavu...");
      setLoading(false);
      setTimeout(() => navigate("/"), 2000);
    } catch (error) {
      setLoading(false);
      // ISPRAVLJEN CATCH BLOK =
      if (error.response && error.response.data) {
        // Izvlačimo samo tekstualnu poruku iz objekta greške
        const porukaGreske = error.response.data.title || error.response.data.message || 'Greška sa servera.';
        setGreska(porukaGreske);
      } else {
        setGreska("Došlo je do greške pri registraciji.");
      }
    }
  };

  // JSX 
  return (
    <div className="register-page">
      <div className="register-container">
        <form onSubmit={podnesiFormu} noValidate autoComplete="off">
          <div className="logo-container">
            <img src={logo} alt="Vexa Logo" className="logo-img" />
          </div>

          <h1 className="form-title">Registracija</h1>

          {/* Polje za korisničko ime */}
          <div className="input-group">
            <label htmlFor="korisnickoIme">Ime organizatora:</label>
            <input id="korisnickoIme" type="text" value={korisnickoIme} onChange={(e) => setKorisnickoIme(e.target.value)} disabled={loading} autoComplete="username" />
            {greskePolja.korisnickoIme && <p className="field-error">{greskePolja.korisnickoIme}</p>}
          </div>

          {/* Polje za email */}
          <div className="input-group">
            <label htmlFor="email">Email:</label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading} autoComplete="email" />
            {greskePolja.email && <p className="field-error">{greskePolja.email}</p>}
          </div>
          
          {/* Polje za broj telefona */}
          <div className="input-group">
            <label htmlFor="brojTelefona">Broj telefona:</label>
            <input id="brojTelefona" type="tel" value={brojTelefona} onChange={(e) => setBrojTelefona(e.target.value)} disabled={loading} autoComplete="tel" />
            {greskePolja.brojTelefona && <p className="field-error">{greskePolja.brojTelefona}</p>}
          </div>

          {/* Polje za lozinku */}
          <div className="input-group">
            <label htmlFor="lozinka">Šifra:</label>
            <div className="password-input-wrapper">
              <input id="lozinka" type={showLozinka ? 'text' : 'password'} value={lozinka} onChange={(e) => setLozinka(e.target.value)} disabled={loading} autoComplete="new-password" />
              <button type="button" className="password-toggle-icon" onClick={() => setShowLozinka(!showLozinka)}>
                {showLozinka ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
            {greskePolja.lozinka && <p className="field-error">{greskePolja.lozinka}</p>}
          </div>

          {/* Polje za potvrdu lozinke*/}
          <div className="input-group">
            <label htmlFor="potvrdaLozinke">Potvrdi šifru:</label>
            <div className="password-input-wrapper">
              <input id="potvrdaLozinke" type={showPotvrdaLozinke ? 'text' : 'password'} value={potvrdaLozinke} onChange={(e) => setPotvrdaLozinke(e.target.value)} disabled={loading} autoComplete="new-password" />
              <button type="button" className="password-toggle-icon" onClick={() => setShowPotvrdaLozinke(!showPotvrdaLozinke)}>
                {showPotvrdaLozinke ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
            {greskePolja.potvrdaLozinke && <p className="field-error">{greskePolja.potvrdaLozinke}</p>}
          </div>
          
          {/* Prikaz greške ili poruke o uspehu */}
          {greska && <p className="error-message">{greska}</p>}
          {uspeh && <p className="success-message">{uspeh}</p>}

          <div className="login-link">
            <p>Već imaš svoj nalog?</p>
            <Link to="/">Uloguj se</Link>
          </div>
          <div className="register-supplier-switch">
            <button
              type="button"
              className="supplier-btn"
              onClick={() => navigate("/register-dobavljac")}
            >
              Registracija kao dobavljač
            </button>
          </div>
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Registrujem se..." : "Registracija"}
          </button>
        </form>
      </div>
    </div>
  );
}