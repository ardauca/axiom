import json
import re

with open("esogu_y1_y2_extracted_syllabi.json", "r", encoding="utf-8") as f:
    syllabi = json.load(f)

parsed_weekly_plans = {}

for code, data in syllabi.items():
    text = data["text"]
    name = data["name"]
    
    # Locate "Dersin Haftalık Planı" or "Haftalık Konular"
    plan_start = re.search(r"Dersin\s+Haftalık\s+Planı|Haftalık\s+Ders\s+Planı|Haftalık\s+Konular", text, re.IGNORECASE)
    
    weeks = []
    if plan_start:
        sub = text[plan_start.end():]
        # End at "Dersin İş Yükünün" or "Değerlendirme" or "DERSİN ÖĞRENİM ÇIKTILARI"
        plan_end = re.search(r"Dersin\s+İş\s+Yükünün|Değerlendirme|Ölçme\s+ve\s+Değerlendirme", sub, re.IGNORECASE)
        if plan_end:
            plan_text = sub[:plan_end.start()]
        else:
            plan_text = sub[:2000]
        
        # Match lines like "1 Konu..." or "1. Hafta: Konu..."
        lines = plan_text.split("\n")
        current_week = None
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
                # Continuation of previous week
                weeks[-1]["topic"] += " " + line
                
    parsed_weekly_plans[code] = {
        "code": code,
        "name": name,
        "weeks": weeks
    }

with open("parsed_weekly_plans.json", "w", encoding="utf-8") as f:
    json.dump(parsed_weekly_plans, f, ensure_ascii=False, indent=2)

print(f"Extracted weekly plans for {len(parsed_weekly_plans)} courses:")
for code, d in parsed_weekly_plans.items():
    print(f"  {code} ({d['name']}): {len(d['weeks'])} weeks parsed")
