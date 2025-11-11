import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './ForgotPassword.css';
import config from '../config';
export default function ResetPasswordByCode({ email }) {
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg(""); setError(""); setLoading(true);
    try {
      await axios.post(config.API_BASE_URL +"api/auth/reset-password-by-code", {
        email, code, newPassword
      });
      setMsg("Šifra je uspešno promenjena. Sada možete da se prijavite.");
      setResetSuccess(true);
      setCode("");
      setNewPassword("");
    } catch (err) {
      setError("Kod nije validan ili je istekao.");
    }
    setLoading(false);
  };

  return (
    <div className="forgot-page">
      <div className="forgot-container">
        {!resetSuccess ? (
          <form autoComplete="off" onSubmit={handleSubmit}>
            <h1 className="forgot-title">Unesi verifikacioni kod</h1>
            <p className="forgot-subtitle">
              Unesite kod koji ste dobili na email i novu šifru.
            </p>
            <div className="forgot-input-group">
              <label htmlFor="code">Kod:</label>
              <input
                type="text"
                id="code"
                value={code}
                onChange={e => setCode(e.target.value.replace(/\D/, ""))}
                required
                disabled={loading}
                placeholder="Unesite kod iz emaila"
                maxLength={6}
              />
            </div>
            <div className="forgot-input-group">
              <label htmlFor="newPassword">Nova šifra:</label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                required
                disabled={loading}
                placeholder="Nova šifra"
              />
            </div>
            {msg && <div className="forgot-success-message">{msg}</div>}
            {error && <div className="forgot-error-message">{error}</div>}
            <button type="submit" className="forgot-submit-btn" disabled={loading}>
              {loading ? "Menjam..." : "Promeni šifru"}
            </button>
          </form>
        ) : (
          <div>
            <h1 className="forgot-title">Šifra promenjena!</h1>
            <div className="forgot-success-message">{msg}</div>
            <button
              className="forgot-submit-btn"
              onClick={() => navigate("/login")}
            >
              Vrati se na login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}