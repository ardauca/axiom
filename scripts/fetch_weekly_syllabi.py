import os
import json
import urllib.request
import urllib.parse
import ssl
from pypdf import PdfReader

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

COURSES_TO_FETCH = [
    # 1. Sınıf Güz
    {"code": "MAT101", "name": "Analiz I", "url": "https://matbil.ogu.edu.tr/Storage/MatematikBilgisayarBolumu/Uploads/Analiz1---Türkçe.pdf"},
    {"code": "MAT103", "name": "Analitik Geometri", "url": "https://matbil.ogu.edu.tr/Storage/MatematikBilgisayarBolumu/Uploads/Analitik-Geometri---Türkçe-2024.pdf"},
    {"code": "MAT105", "name": "Soyut Matematik", "url": "https://matbil.ogu.edu.tr/Storage/MatematikBilgisayarBolumu/Uploads/soyut-matematik---Türkçe.pdf"},
    {"code": "CENG101", "name": "Temel Bilgisayar Bilimleri I", "url": "https://matbil.ogu.edu.tr/Storage/MatematikBilgisayarBolumu/Uploads/Temel-Bilgisayar-Bilimleri-I---Türkçe.pdf"},
    {"code": "CENG103", "name": "Bilgisayar Programlama I", "url": "https://matbil.ogu.edu.tr/Storage/MatematikBilgisayarBolumu/Uploads/Bilgisayar-Programlama-I-Türkçe.pdf"},

    # 1. Sınıf Bahar
    {"code": "MAT102", "name": "Analiz II", "url": "https://matbil.ogu.edu.tr/Storage/MatematikBilgisayarBolumu/Uploads/Analiz2---Türkçe.pdf"},
    {"code": "MAT104", "name": "Lineer Cebir", "url": "https://matbil.ogu.edu.tr/Storage/MatematikBilgisayarBolumu/Uploads/Lineer-Cebir---Türkçe-2024.pdf"},
    {"code": "MAT106", "name": "Ayrık Matematik", "url": "https://matbil.ogu.edu.tr/Storage/MatematikBilgisayarBolumu/Uploads/Ayrık-Matematik---Türkçe.pdf"},
    {"code": "CENG102", "name": "Temel Bilgisayar Bilimleri II", "url": "https://matbil.ogu.edu.tr/Storage/MatematikBilgisayarBolumu/Uploads/Temel-Bilgisayar-Bilimleri-I---Türkçe.pdf"},
    {"code": "CENG104", "name": "Bilgisayar Programlama II", "url": "https://matbil.ogu.edu.tr/Storage/MatematikBilgisayarBolumu/Uploads/Bilgisayar-Programlama-II-Türkçe.pdf"},

    # 2. Sınıf Güz
    {"code": "MAT201", "name": "Analiz III", "url": "https://matbil.ogu.edu.tr/Storage/MatematikBilgisayarBolumu/Uploads/Analiz_III---Türkçe.pdf"},
    {"code": "MAT203", "name": "Graf Teori", "url": "https://matbil.ogu.edu.tr/Storage/MatematikBilgisayarBolumu/Uploads/Graf-Teori---Türkçe.pdf"},
    {"code": "MAT205", "name": "Diferansiyel Denklemler", "url": "https://matbil.ogu.edu.tr/Storage/MatematikBilgisayarBolumu/Uploads/Diferansiyel-denklemler---Türkçe.pdf"},
    {"code": "CENG203", "name": "Bilgisayar Mimarisi", "url": "https://matbil.ogu.edu.tr/Storage/MatematikBilgisayarBolumu/Uploads/Bilgisayar-Mimarisi-Türkçe.pdf"},

    # 2. Sınıf Bahar
    {"code": "MAT202", "name": "Analiz IV", "url": "https://matbil.ogu.edu.tr/Storage/MatematikBilgisayarBolumu/Uploads/Analiz_IV---Türkçe.pdf"},
    {"code": "CENG202", "name": "Yapay Zeka", "url": "https://matbil.ogu.edu.tr/Storage/MatematikBilgisayarBolumu/Uploads/Yapay-Zeka-Türkçe.pdf"},
    {"code": "MAT204", "name": "Dinamik Sistemler", "url": "https://matbil.ogu.edu.tr/Storage/MatematikBilgisayarBolumu/Uploads/Dinamik-Sistemler--Türkçe.pdf"},
    {"code": "STAT202", "name": "Olasılık ve İstatistik", "url": "https://matbil.ogu.edu.tr/Storage/MatematikBilgisayarBolumu/Uploads/Olasilik-ve-Istatistik--turkçe.pdf"}
]

os.makedirs("syllabi_cache", exist_ok=True)
extracted_syllabi = {}

for c in COURSES_TO_FETCH:
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
        
        extracted_syllabi[code] = {
            "code": code,
            "name": name,
            "url": clean_url,
            "text": full_text
        }
        print(f"[OK] {code} ({name}): Extracted {len(full_text)} chars")
    except Exception as e:
        print(f"[ERR] {code} ({name}): {e}")

with open("esogu_y1_y2_extracted_syllabi.json", "w", encoding="utf-8") as f:
    json.dump(extracted_syllabi, f, ensure_ascii=False, indent=2)

print("\nSaved all extracted syllabi to esogu_y1_y2_extracted_syllabi.json")
