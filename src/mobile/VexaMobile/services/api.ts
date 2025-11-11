import axios from 'axios';

export const API = axios.create({
  baseURL: 'http://softeng.pmf.kg.ac.rs:11071/', // ← OVDE stavi IP adresu backend servera, ovo je samo moja verzija koja nije radi kod mene lokalno--dusan
  headers: {
    'Content-Type': 'application/json',
  },
});
