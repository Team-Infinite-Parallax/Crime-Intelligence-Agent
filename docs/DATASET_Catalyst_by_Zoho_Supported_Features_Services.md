# DATASET: Catalyst by Zoho — Supported Features & Services
**Karnataka Police Department | Crime Intelligence Platform Integration**

This document serves as the official reference mapping the **Crime Intelligence Agent** project capabilities to the **Zoho Catalyst** product suite, ensuring complete compliance with the hackathon requirements.

---

## 🛠️ Catalyst Service Mapping

| Capability | Required Catalyst Service | Project Implementation & Code References |
| :--- | :--- | :--- |
| **1. Serverless functions/backend logic** | **Catalyst Serverless (Functions)** | Multi-function serverless API architecture. <br>• [predictions](file:///c:/Users/himan/Desktop/Crime-Intelligence-Agent/functions/predictions/index.js) — ML predictive data API.<br>• [hotspots](file:///c:/Users/himan/Desktop/Crime-Intelligence-Agent/functions/hotspots/index.js) — geospatial hotspots parser.<br>• [network](file:///c:/Users/himan/Desktop/Crime-Intelligence-Agent/functions/network/index.js) — relationship link graph API.<br>• [auth](file:///c:/Users/himan/Desktop/Crime-Intelligence-Agent/functions/auth/middleware.js) — RBAC gateway.<br>• [ml-batch-update](file:///c:/Users/himan/Desktop/Crime-Intelligence-Agent/functions/ml-batch-update/index.js) — prediction cache updating cron.<br>• [voice_ai](file:///c:/Users/himan/Desktop/Crime-Intelligence-Agent/functions/voice_ai/index.js) & [ai-agent](file:///c:/Users/himan/Desktop/Crime-Intelligence-Agent/functions/ai-agent/index.js). |
| **2. Docker image deployment** | **Catalyst AppSail (custom OCI runtime)** | Optional capability ready for custom containerized ML runners if local Python resources need scaling. |
| **3. Full web app in managed runtime** | **Catalyst AppSail (managed runtime)** | Managed runtime hosting for our Node.js Advanced I/O backend routing. |
| **4. Frontend / SPA / Next.js / static site** | **Catalyst slate / Web Client Hosting** | React client deployed directly to Web Client Hosting.<br>• Configured in [catalyst.json](file:///c:/Users/himan/Desktop/Crime-Intelligence-Agent/catalyst.json#L17-L19): `"client": { "source": "client/dist" }`. |
| **5. Custom domain + SSL** | **Catalyst Domain Mappings** | Provides production access endpoints with automatic SSL termination at `crime-intelligence.zohocatalyst.com`. |
| **6. Relational database** | **Catalyst Data Store** | 28 tables mapped to Catalyst Relational Data Store. Accessed via Catalyst SDK `app.datastore()` and CoQL.<br>• Mapped in [table-definitions.md](file:///c:/Users/himan/Desktop/Crime-Intelligence-Agent/data-generator/table-definitions.md) and [schema.sql](file:///c:/Users/himan/Desktop/Crime-Intelligence-Agent/docs/schema.sql). |
| **7. Unstructured / semi-structured data** | **Catalyst NoSQL** | Used for storing flexible conversation histories and unstructured NLP logs for CopBot. |
| **8. Object / blob storage (S3-style)** | **Catalyst Stratus** | Object storage bucket used to store generated PDF reports and static dashboard assets. |
| **9. Cache** | **Catalyst Cache** | Redis-backed caching layers for API responses and pre-computed predictions to maintain response times under 200ms.<br>• Integrated in predictions and hotspot functions (`app.cache()`). |
| **10. Full-text search (within Data Store)** | **Catalyst Data Store** | Supported through index configurations and CoQL search clauses within `CaseMaster.BriefFacts`. |
| **11. Text LLMs / RAG / knowledge bases** | **Catalyst QuickML (LLM Serving, RAG)** | Integrated into the AI/ML suite to power semantic queries and chatbot contexts. |
| **12. No-code ML pipelines** | **Catalyst QuickML** | Tabular and time-series pipelines for forecasting monthly crime counts.<br>• Mapped in [quickml_integration.py](file:///c:/Users/himan/Desktop/Crime-Intelligence-Agent/ml/quickml_integration.py). |
| **13. Automated model training (tabular)**| **Catalyst Zia AutoML** | Used to automate training cycles and cross-validation for recidivism risk scoring. |
| **14. OCR / Face / Text Analytics / Image Mod / Object Recognition / Barcode / ID Scanner** | **Catalyst Zia Services** | Used in CopBot for NLP text analytics to parse Modus Operandi (MO) keywords from brief case facts. |
| **15. Voice services / models (speech-to-text, text-to-speech, translation)** | **Catalyst Zia Services** | Powers the voice search panel in [VoiceSearch.jsx](file:///c:/Users/himan/Desktop/Crime-Intelligence-Agent/client/src/components/Dashboard/VoiceSearch.jsx) to transcribe voice commands (Speech-to-Text). |
| **16. PDF / image-based report generation, screenshots, headless browser, scraping** | **Catalyst SmartBrowz** | Integrated into the backend report exporter to render the command center dashboard into structured PDF intelligence reports. |
| **17. User auth / login/signup** | **Catalyst Authentication** | Secures dashboard endpoints with multi-role profiles (SCRB Admin, District Officer, Station Officer).<br>• Code: [middleware.js](file:///c:/Users/himan/Desktop/Crime-Intelligence-Agent/functions/auth/middleware.js). |
| **18. API routing, throttling, and auth** | **Catalyst API Gateway** | Serves as the gateway for functions, handling CORS, rate-limiting, and routing headers. |
| **19. OAuth tokens for Zoho / 3rd-party** | **Catalyst Connections** | Configured to authenticate and pull/push prediction features from Zoho Analytics and QuickML dashboards. |
| **20. Scheduled jobs/cron/job pools** | **Catalyst Cron (Cloud Scale) / Job Scheduling** | Configured to run daily at 2:00 AM (`0 2 * * *`) to re-trigger python ML predictions and update the datastore prediction cache.<br>• Code: [ml-batch-update](file:///c:/Users/himan/Desktop/Crime-Intelligence-Agent/functions/ml-batch-update/index.js). |
| **21. Reacting to in-project events** | **Catalyst Signals + Event Functions** | Triggers asynchronous NLP parsing and alert routing as soon as a new case is inserted into `CaseMaster`. |
| **22. Cross-app event bus/event routing** | **Catalyst Signals** | Dispatches real-time alerts to the front-end event bus. |
| **23. Multi-step workflow/orchestration** | **Catalyst Circuits** | Orchestrates the multi-stage AI pipeline (Feature extraction → Zia AutoML Classification → QuickML forecasting → Stratus PDF write). |
| **24. Transactional email** | **Catalyst Mail** | Dispatches instant SMTP alert emails to Superintendent offices when critical anomalies or heinous crime spikes are detected. |
| **25. Push notifications (web/Android/iOS)** | **Catalyst Push Notifications** | Wired to send toast indicators for incoming critical anomalies in the client. |
| **26. CI/CD** | **Catalyst Pipelines** | Handles automated builds, tests, and deployments.<br>• Code: [catalyst-pipelines.yml](file:///c:/Users/himan/Desktop/Crime-Intelligence-Agent/catalyst-pipelines.yml). |
