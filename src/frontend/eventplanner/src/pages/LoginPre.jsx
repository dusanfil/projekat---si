// Uvoz paketa i fajlova
import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

// CSS i logo
import './LoginForm.css'; 
import logo from "./logo.png";
import config from '../config';
export default function Login() {
  // State-ovi
  const [korisnickoIme, postaviKorisnickoIme] = useState("");
  const [lozinka, postaviLozinku] = useState("");
  const [greska, postaviGresku] = useState("");
  const [loading, postaviLoading] = useState(false); 
  const navigate = useNavigate();

  // Funkcija za slanje
  const podnesiFormu = async (e) => {
    e.preventDefault();
    postaviGresku("");
    postaviLoading(true);

    if (!korisnickoIme || !lozinka) {
      postaviGresku("Sva polja su obavezna.");
      postaviLoading(false);
      return;
    }

    try {
      const odgovor = await axios.post(config.API_BASE_URL +"api/auth/login/organizator", {
        korisnickoIme:korisnickoIme,
        sifra:lozinka,
      });

      localStorage.setItem("token", odgovor.data.token);
      console.log('token = ' + odgovor.data.token)
      postaviLoading(false);
      navigate("/moji-dogadjaji");
    } catch (error) {
      postaviLoading(false);
      // ISPRAVLJEN CATCH BLOK DA SPREČI  OBJECT GREŠKU
      if (error.response && error.response.data) {
        const porukaGreske = error.response.data.title || error.response.data.message || 'Pogrešan email ili lozinka.';
        postaviGresku(porukaGreske);
      } else {
        postaviGresku("Došlo je do greške prilikom prijave.");
      }
    }
  };

  // ISPRAVLJEN JSX KOJI KORISTI DIZAJN 
  return (
    <div className="login-page">
      <div className="login-container">
        <form autoComplete="off" onSubmit={podnesiFormu}>
          <div className="logo-container">
            <img src={logo} alt="Vexa Logo" className="logo-img" />
          </div>

          <h1 className="welcome-title">Dobrodošli!</h1>
          <h2 className="form-title">Prijava</h2>

          <div className="input-group">
            <label htmlFor="email">Korisnicko Ime:</label>
            <input
              type="text"
              id="korisnickoIme"
              value={korisnickoIme}
              onChange={(e) => postaviKorisnickoIme(e.target.value)}
              required
              disabled={loading}
              autoComplete=""
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Šifra:</label>
            <input
              type="password"
              id="password"
              value={lozinka}
              onChange={(e) => postaviLozinku(e.target.value)}
              required
              disabled={loading}
              autoComplete="new-password"
            />
          </div>

          {/* Prikaz poruke o greškama */}
          {greska && <p className="error-message">{greska}</p>}

          <div className="signup-link">
            <p>Još uvek nemaš svoj nalog?</p>
            <Link to="/register">Napravi ga odmah</Link>
          </div>
          {/* Novo dugme za dobavljača */}
          <div className="login-supplier-switch">
            <button
              type="button"
              className="supplier-btn"
              onClick={() => navigate("/login-dobavljac")}
            >
              Prijava kao dobavljač
            </button>
          </div>
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Prijavljujem se..." : "Prijavi se"}
          </button>
        </form>
      </div>
    </div>
  );
}