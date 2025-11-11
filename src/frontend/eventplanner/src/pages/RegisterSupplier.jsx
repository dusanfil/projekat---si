import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
// import axios from "axios"; // koristiti nakon dodatka bek podrske 
import './Register.css'; // koristi postojeći stil
import logo from "./logo.png";
//import './RegisterSupplier.css'
import config from '../config';
export default function RegisterSupplier() {
  const [nazivFirme, setNazivFirme] = useState("");
  const [email, setEmail] = useState("");
  const [lozinka, setLozinka] = useState("");
  const [greska, setGreska] = useState("");
  const [uspeh, setUspeh] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const podnesiFormu = async (e) => {
    e.preventDefault();
    setGreska("");
    setUspeh("");
    setLoading(true);

    // Mock validacija
    if (!nazivFirme || !email || !lozinka) {
      setGreska("Sva polja su obavezna.");
      setLoading(false);
      return;
    }
    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
      setGreska("Neispravan format email adrese.");
      setLoading(false);
      return;
    }
    if (lozinka.length < 6) {
      setGreska("Lozinka mora imati najmanje 6 karaktera.");
      setLoading(false);
      return;
    }

    // Mock uspeh
    setUspeh("Registracija uspešna! Preusmeravamo na prijavu...");
    setLoading(false);
    setTimeout(() => navigate("/login-dobavljac"), 2000);
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <form onSubmit={podnesiFormu} noValidate autoComplete="off">
          <div className="logo-container">
            <img src={logo} alt="Logo" className="logo-img" />
          </div>
          <h1 className="form-title">Registracija Dobavljača</h1>
          <div className="input-group">
            <label htmlFor="nazivFirme">Naziv firme:</label>
            <input id="nazivFirme" type="text" value={nazivFirme} onChange={(e) => setNazivFirme(e.target.value)} disabled={loading} autoComplete="organization" />
          </div>
          <div className="input-group">
            <label htmlFor="email">Email:</label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading} autoComplete="email" />
          </div>
          <div className="input-group">
            <label htmlFor="lozinka">Šifra:</label>
            <input id="lozinka" type="password" value={lozinka} onChange={(e) => setLozinka(e.target.value)} disabled={loading} autoComplete="new-password" />
          </div>
          {greska && <p className="error-message">{greska}</p>}
          {uspeh && <p className="success-message">{uspeh}</p>}
          <div className="login-link">
            <p>Već imate nalog?</p>
            <Link to="/login-dobavljac">Ulogujte se</Link>
          </div>
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Registrujem se..." : "Registracija"}
          </button>
        </form>
      </div>
    </div>
  );
}