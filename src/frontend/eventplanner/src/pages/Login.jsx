import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import './LoginForm.css';
import logo from "./logo.png";
import config from '../config';
export default function Login() {
  const [korisnickoIme, setKorisnickoIme] = useState("");
  const [lozinka, setLozinka] = useState("");
  const [greska, setGreska] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const podnesiFormu = async (e) => {
    e.preventDefault();
    setGreska("");
    setLoading(true);

    if (!korisnickoIme || !lozinka) {
      setGreska("Sva polja su obavezna.");
      setLoading(false);
      return;
    }

    try {
      const odgovor = await axios.post(config.API_BASE_URL + "api/auth/login", {
        korisnickoIme,
        sifra: lozinka,
      });
      localStorage.setItem("token", odgovor.data.token);

      // Robustno: uzmi ulogu iz oba moguća ključa i provedi na mala slova
      const uloga = (odgovor.data.uloga || odgovor.data.Uloga || "").toLowerCase();

      if (uloga === "dobavljac") {
        const dobavljacId = odgovor.data.id;
        if (dobavljacId && dobavljacId.length === 24) {
          localStorage.setItem("dobavljacId", dobavljacId);
        } else {
          alert("Greška pri prijavi: Nedostaje ID dobavljača.");
          setLoading(false);
          return;
        }
        navigate("/dobavljac/dashboard");
      } else if (uloga === "organizator") {
        const organizatorId = odgovor.data.id;
        if (organizatorId && organizatorId.length === 24) {
          localStorage.setItem("organizatorId", organizatorId);
        } else {
          alert("Greška pri prijavi: Nedostaje ID organizatora.");
          setLoading(false);
          return;
        }
        navigate("/moji-dogadjaji");
      } else {
        alert("Nepoznata uloga: " + odgovor.data.uloga);
        setLoading(false);
        return;
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      if (error.response && error.response.data) {
        const greskaTekst =
          error.response.data === "Email nije verifikovan. Proverite svoj email."
            ? "Verifikujte svoj nalog pre prijave putem linka u emailu."
            : error.response.data.title ||
              error.response.data.message ||
              "Pogrešan email ili lozinka.";
        setGreska(greskaTekst);
      } else {
        setGreska("Došlo je do greške prilikom prijave.");
      }
    }
  };

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
            <label htmlFor="korisnickoIme">Korisničko ime:</label>
            <input
              type="text"
              id="korisnickoIme"
              value={korisnickoIme}
              onChange={(e) => setKorisnickoIme(e.target.value)}
              required
              disabled={loading}
              autoComplete="username"
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Šifra:</label>
            <input
              type="password"
              id="password"
              value={lozinka}
              onChange={(e) => setLozinka(e.target.value)}
              required
              disabled={loading}
              autoComplete="current-password"
            />
          </div>
          
          <div className="forgot-link">
            <Link to="/forgot-password">Zaboravili ste šifru?</Link>
          </div>
          {greska && <p className="error-message">{greska}</p>}
          <div className="signup-link">
            <p>Još uvek nemaš svoj nalog?</p>
            <Link to="/register">Napravi ga odmah</Link>
          </div>
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Prijavljujem se..." : "Prijavi se"}
          </button>
        </form>
      </div>
    </div>
  );
}