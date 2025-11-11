import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
// import axios from "axios"; // koristimo kad bude generisana  backend podrska 
import './LoginForm.css';
import logo from "./logo.png";
import config from '../config';

export default function LoginSupplier() {
  const [email, setEmail] = useState("");
  const [lozinka, setLozinka] = useState("");
  const [greska, setGreska] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const podnesiFormu = async (e) => {
    e.preventDefault();
    setGreska("");
    setLoading(true);

    if (!email || !lozinka) {
      setGreska("Sva polja su obavezna.");
      setLoading(false);
      return;
    }

    // Mock login (kad bude uradjena bek podrska)
    // const odgovor = await axios.post("http://localhost:xxxx/api/auth/login/supplier", { email, lozinka });
    // localStorage.setItem("supplierToken", odgovor.data.token);
    localStorage.setItem("supplierToken", "mock-token");
    setLoading(false);
    navigate("/dobavljac/dashboard");
  };
  return (
    <div className="login-page">
      <div className="login-container">
        <form autoComplete="off" onSubmit={podnesiFormu}>
          <div className="logo-container">
            <img src={logo} alt="Logo" className="logo-img" />
          </div>
          <h1 className="welcome-title">Dobrodošli, dobavljaču!</h1>
          <h2 className="form-title">Prijava</h2>
          <div className="input-group">
            <label htmlFor="email">Email:</label>
            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={loading} autoComplete="email" />
          </div>
          <div className="input-group">
            <label htmlFor="password">Šifra:</label>
            <input type="password" id="password" value={lozinka} onChange={(e) => setLozinka(e.target.value)} required disabled={loading} autoComplete="new-password" />
          </div>
          {greska && <p className="error-message">{greska}</p>}
          <div className="signup-link">
            <p>Još uvek nemate nalog?</p>
            <Link to="/register-dobavljac">Napravi ga odmah</Link>
          </div>
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Prijavljujem se..." : "Prijavi se"}
          </button>
        </form>
      </div>
    </div>
  );
}