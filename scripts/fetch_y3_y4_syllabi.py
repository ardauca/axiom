import os
import json
import urllib.request
import urllib.parse
import ssl
from pypdf import PdfReader
import re

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

COURSES_Y3_Y4 = [
    # 3. Sınıf Güz (5. Dönem)
    {"code": "MAT301", "name": "Modern Cebir", "url": "https://matbil.ogu.edu.tr/Storage/MatematikBilgisayarBolumu/Uploads/Modern-Cebir---Türkçe.pdf"},
    {"code": "MAT303", "name": "Diferansiyel Geometri", "url": "https://matbil.ogu.edu.tr/Storage/MatematikBilgisayarBolumu/Uploads/Diferansiyel-Geometri-Türkçe.pdf"},
    {"code": "MAT305", "name": "Sembolik Hesaplama I", "url": "https://matbil.ogu.edu.tr/Storage/MatematikBilgisayarBolumu/Uploads/Sembolik-Hesaplama-I---Türkçe.pdf"},
    {"code": "CENG301", "name": "Matematiksel Yazılım ve Tasarım", "url": "https://matbil.ogu.edu.tr/Storage/MatematikBilgisayarBolumu/Uploads/Matematiksel-yazılım-ve-Tasarım-turkçe.pdf"},

    # 3. Sınıf Bahar (6. Dönem)
    {"code": "MAT302", "name": "Topoloji", "url": "https://matbil.ogu.edu.tr/Storage/MatematikBilgisayarBolumu/Uploads/Topoloji--turkçe.pdf"},
    {"code": "MAT304", "name": "Kompleks Analiz", "url": "https://matbil.ogu.edu.tr/Storage/MatematikBilgisayarBolumu/Uploads/Kompleks-Analiz---Türkçe.pdf"},
    {"code": "CENG302", "name": "Algoritmalar", "url": "https://matbil.ogu.edu.tr/Storage/MatematikBilgisayarBolumu/Uploads/Algoritmalar---Türkçe.pdf"},
    {"code": "CENG304", "name": "Kategori Teorisi ve Bilgisayar Bilimleri", "url": "https://matbil.ogu.edu.tr/Storage/MatematikBilgisayarBolumu/Uploads/Kategori-Teorisi-ve-Bilgisayar-Bilimleri---Türkçe.pdf"},

    # 4. Sınıf Güz (7. Dönem)
    {"code": "CENG401", "name": "Java", "url": "https://matbil.ogu.edu.tr/Storage/MatematikBilgisayarBolumu/Uploads/Java---Türkçe.pdf"},

    # 4. Sınıf Bahar (8. Dönem)
    {"code": "CENG402", "name": "Kriptoloji", "url": "https://matbil.ogu.edu.tr/Storage/MatematikBilgisayarBolumu/Uploads/Kriptoloji-Türkçe.pdf"}
]

os.makedirs("syllabi_cache", exist_ok=True)
extracted = {}
weekly_plans = {}

for c in COURSES_Y3_Y4:
    code = c["code"]
    name = c["name"]
    raw_url = c["url"]
    
    parsed = urllib.parse.urlsplit(raw_url)
    encoded_path = urllib.parse.quote(parsed.path, safe="/:")
    clean_url = urllib.parse.urlunsplit((parsed.scheme, parsed.netloc, encoded_path, parsed.query, parsed.fragment))
    
    pdf_path = os.path.join("syllabi_cache", f"{code}.pdf")
    
    try:
        req = urllib.request.Request(clean_url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, context=ctx, timeout=15) as resp:
            with open(pdf_path, "wb") as f:
                f.write(resp.read())
        
        reader = PdfReader(pdf_path)
        full_text = ""
        for page in reader.pages:
            t = page.extract_text()
            if t:
                full_text += t + "\n"
        
        extracted[code] = {
            "code": code,
            "name": name,
            "url": clean_url,
            "text": full_text
        }
        
        # Parse weeks
        plan_start = re.search(r"Dersin\s+Haftalık\s+Planı|Haftalık\s+Ders\s+Planı|Haftalık\s+Konular", full_text, re.IGNORECASE)
        weeks = []
        if plan_start:
            sub = full_text[plan_start.end():]
            plan_end = re.search(r"Dersin\s+İş\s+Yükünün|Değerlendirme|Ölçme\s+ve\s+Değerlendirme", sub, re.IGNORECASE)
            plan_text = sub[:plan_end.start()] if plan_end else sub[:2000]
            
            lines = plan_text.split("\n")
            for line in lines:
                line = line.strip()
                if not line:
                    continue
                m = re.match(r"^(\d{1,2}(?:\s*,\s*\d{1,2})?)\s*[\.\:\-\s]\s*(.*)$", line)
                if m:
                    week_num = m.group(1).replace(" ", "")
                    week_topic = m.group(2).strip()
                    if week_topic:
                        weeks.append({"week": week_num, "topic": week_topic})
                elif weeks and len(line) > 3 and not re.match(r"^(Ara Sınav|Mid-Term|Final|Yarıyıl)", line):
                    weeks[-1]["topic"] += " " + line
        
        weekly_plans[code] = {
            "code": code,
            "name": name,
            "weeks": weeks
        }
        
        print(f"[OK] {code} ({name}): Extracted {len(full_text)} chars, {len(weeks)} weeks")
    except Exception as e:
        print(f"[ERR] {code} ({name}): {e}")

with open("esogu_y3_y4_extracted_syllabi.json", "w", encoding="utf-8") as f:
    json.dump(extracted, f, ensure_ascii=False, indent=2)

with open("parsed_weekly_plans_y3_y4.json", "w", encoding="utf-8") as f:
    json.dump(weekly_plans, f, ensure_ascii=False, indent=2)

print("\nSuccessfully processed all 3rd & 4th year syllabi!")
