# FairShift 🛡️
> **Decent-Work & Fair Pay Platform Aligned with UN SDG 8**  
> *Built for Prompt Wars 2026 (ACM Student Chapter, SRMIST)*

FairShift is a frontline and industrial worker empowerment platform engineered to eliminate wage opacity, protect whistleblowers reporting safety hazards, and provide proactive fatigue mitigation.

---

## 🌟 Key Features

1. **Shift & Transparent Wage Audit**:
   - Real-time regular vs overtime hours split.
   - 1.5x statutory overtime calculation & night shift differential (+15%).
   - Guaranteed **₹0.00 hidden deductions**.
   - Text-to-speech audio breakdown in English, Hindi, and Tamil.
   - Simulated geofence verification & site QR check-in.

2. **Whistleblower Shield (Hazard Reporting)**:
   - On-device client-side PII sanitization (redacts names, phone numbers, employee IDs).
   - Voice note recording with animated waveform and canned transcripts.
   - Sector-specific safety hazard presets (Construction & Factory).
   - Warm-tone severity ranking (Informational / Needs Review / Critical).

3. **Anonymous Workplace Feedback**:
   - Zero identity metadata logged.
   - Client-side SHA-256 cryptographic receipt verification via Web Crypto API.

4. **Decentralized Skill Passport**:
   - Verified safe working hours counter.
   - Micro-credential skill badges.
   - Inline SVG QR code generator for open verifier scanning.

5. **Employer Operations & Fatigue Monitoring**:
   - Live KPI dashboard (Active workforce, shift completion %, open hazards, fatigue violations).
   - Hazard triage board with supervisor acknowledge/resolve workflows.
   - Fatigue panel flagging >10h shifts with one-click interventions (Mandatory Rest, Shift Reassignment, Overtime Cap).

---

## 🧪 Automated Testing

FairShift includes an automated test suite verifying pay calculations, PII redaction, QR generation, and security audits:

```bash
npm test
```

---

## 🚀 Deployment (Google Cloud Run)

FairShift is containerized via a multi-stage Docker build (`node:20-alpine` -> `nginx:alpine`) listening on `0.0.0.0:${PORT:-8080}`.

```bash
# Build & Deploy to Google Cloud Run
gcloud run deploy fairshift \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 8080
```

---

## 💻 Local Development

```bash
npm install
npm run dev
```

---

## 📜 License
MIT License • Aligned with UN SDG 8 (Decent Work & Economic Growth)
