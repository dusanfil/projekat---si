import React, { useState } from "react";
import axios from "axios";
import './ForgotPassword.css';
import config from '../config';
export default function ForgotPassword({ onSuccess }) {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setError("");
    setLoading(true);

    try {
      await axios.post(config.API_BASE_URL +"api/auth/forgot-password", { email });
      setMsg("Verifikacioni kod je poslat na vašu email adresu (ako postoji u bazi).");
      setTimeout(() => onSuccess(email), 1200); // Kratko prikaži success pa prebaci
    } catch (err) {
      setError("Došlo je do greške. Proverite email i pokušajte ponovo.");
    }
    setLoading(false);
  };

  return (
    <div className="forgot-page">
      <div className="forgot-container">
        <form autoComplete="off" onSubmit={handleSubmit}>
          <h1 className="forgot-title">Zaboravljena šifra</h1>
          <p className="forgot-subtitle">
            Unesite email adresu koju ste koristili prilikom registracije. Poslaćemo vam verifikacioni kod.
          </p>
          <div className="forgot-input-group">
            <label htmlFor="email">Email adresa:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              disabled={loading}
              autoComplete="email"
              placeholder="Unesite svoj email"
            />
          </div>
          {msg && <div className="forgot-success-message">{msg}</div>}
          {error && <div className="forgot-error-message">{error}</div>}
          <button type="submit" className="forgot-submit-btn" disabled={loading}>
            {loading ? "Šaljem..." : "Pošalji verifikacioni kod"}
          </button>
        </form>
      </div>
    </div>
  );
}