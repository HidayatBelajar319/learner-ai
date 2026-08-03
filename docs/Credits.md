# Kredit & Sumber Inspirasi (MIT Attribution)

Beberapa fitur LearnerAI dibuat terinspirasi dari riset open-source dan konten
publik. Berikut kredit serta lisensi untuk sumber yang digunakan sebagai
referensi konsep & desain. Implementasi di LearnerAI bersifat orisinal.

| Sumber | Penulis | Lisensi | Kontribusi Konsep |
| ------ | ------- | ------- | ----------------- |
| [ai-ui-live-editor](https://github.com/sina-nasiri/ai-ui-live-editor) | Sina Nasiri | MIT | AI UI Editor: memilih elemen & mengedit tampilan secara live lewat prompt |
| [second-brain-research-dashboard](https://github.com/coleam00/second-brain-research-dashboard) | coleam00 | Tidak disebutkan | Dashboard berbasis agent dengan protokol A2UI/AG-UI (SSE, JSON Patch) |
| [a2ui / a2ui.org](https://a2ui.org) | a2ui-project | Apache-2.0 | Protokol *agent-to-UI*: deskripsi komponen deklaratif yang dihasilkan agent |
| [CopilotKit generative-ui (video MD8VQzvMVek)](https://www.youtube.com/watch?v=MD8VQzvMVek) | CopilotKit | MIT (pustaka) | *Generative UI*: agent AI membangun antarmuka secara real-time |

---

## Rincian

### 1. sina-nasiri/ai-ui-live-editor (MIT)

Konsep: memuat website melalui proxy, memilih elemen dengan klik, dan AI
menulis ulang HTML secara langsung. Di LearnerAI, konsep ini diadaptasi
menjadi **AI UI Editor** (`/ui-editor`) dan mode **UI** di AI Chat yang
menghasilkan patch UI yang dapat ditinjau sebelum diterapkan.

> Lisensi MIT (Pustaka): <https://github.com/sina-nasiri/ai-ui-live-editor>

### 2. coleam00/second-brain-research-dashboard

Referensi: agent AI yang menghasilkan antarmuka *research dashboard* secara
dinamis. Mendorong desain AI Chat yang mampu menghasilkan **kartu aksi**
(desain & patch UI) di samping jawaban teks.

### 3. a2ui-project/a2ui (Apache-2.0)

Protokol terbuka *agent-to-UI*: model mendeskripsikan komponen antarmuka
secara deklaratif, lalu aplikasi merendernya. Mempengaruhi arsitektur hasil
terstruktur (JSON) dari `/api/ai/assistant` yang dirender sebagai kartu di
frontend. <https://a2ui.org> | <https://github.com/a2ui-project/a2ui>

### 4. CopilotKit generative-ui (video MD8VQzvMVek)

Video "AI Agents Can Now Build Their Own UI in Real Time" — konsep *generative
UI* di mana agent membangun antarmuka real-time. Menginspirasi penggabungan
Creative AI, Chat AI, dan UI Editor AI ke dalam satu antarmuka chat.

---

*Dokumen terakhir diperbarui: 01 Agustus 2026*
