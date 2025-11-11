import React, { useState } from "react";
import ForgotPassword from "./ForgotPassword";
import ResetPasswordByCode from "./ResetPasswordByCode";

// Glavna komponenta koja vodi flow: prvo email, pa unos koda i nove šifre
export default function ForgotPasswordFlow() {
  const [email, setEmail] = useState(null);

  return (
    <>
      {!email
        ? <ForgotPassword onSuccess={setEmail} />
        : <ResetPasswordByCode email={email} />}
    </>
  );
}