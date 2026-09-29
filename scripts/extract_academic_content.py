import os
import sys
import json
import zipfile
import re
from xml.etree import ElementTree as ET
try:
    import pypdfium2 as pdfium
except ImportError:
    pdfium = None

ROOT_DIR = r"C:\Users\ARDA\Desktop\2.sınıf Güz"

def get_docx_paragraphs(path):
    try:
        with zipfile.ZipFile(path) as z:
            xml_content = z.read('word/document.xml')
            tree = ET.fromstring(xml_content)
            paragraphs = []
            for node in tree.iter():
                if node.tag.endswith('}p'):
                    texts = [n.text for n in node.iter() if n.tag.endswith('}t') and n.text]
                    if texts:
                        paragraphs.append(''.join(texts))
            return paragraphs
    except Exception as e:
        return [f"[ERROR DOCX: {e}]"]

def extract_pdf_full_text(path):
    if not pdfium:
        return []
    try:
        pdf = pdfium.PdfDocument(path)
        pages = []
        for i in range(len(pdf)):
            try:
                text = pdf[i].get_textpage().get_text_range() or ""
                pages.append({"page_num": i + 1, "text": text})
            except Exception:
                pages.append({"page_num": i + 1, "text": ""})
        return pages
    except Exception as e:
        return []

def main():
    print("Beginning Deep Academic Content Extraction...")
    
    courses = {
        "Diferansiyel Denklemler": {"files": [], "topics": set(), "definitions": 0, "theorems": 0, "examples": 0, "problems": 0, "solutions": 0, "exams": []},
        "Bilgisayar Mimarisi": {"files": [], "topics": set(), "definitions": 0, "theorems": 0, "examples": 0, "problems": 0, "solutions": 0, "exams": []},
        "Graf Teorisi": {"files": [], "topics": set(), "definitions": 0, "theorems": 0, "examples": 0, "problems": 0, "solutions": 0, "exams": []},
        "Görsel Programlama": {"files": [], "topics": set(), "definitions": 0, "theorems": 0, "examples": 0, "problems": 0, "solutions": 0, "exams": []},
        "Analitik Geometri": {"files": [], "topics": set(), "definitions": 0, "theorems": 0, "examples": 0, "problems": 0, "solutions": 0, "exams": []},
        "Matematiksel Analiz": {"files": [], "topics": set(), "definitions": 0, "theorems": 0, "examples": 0, "problems": 0, "solutions": 0, "exams": []},
        "Bilgisayar Programlama": {"files": [], "topics": set(), "definitions": 0, "theorems": 0, "examples": 0, "problems": 0, "solutions": 0, "exams": []},
        "Temel Bilgi Teknolojileri": {"files": [], "topics": set(), "definitions": 0, "theorems": 0, "examples": 0, "problems": 0, "solutions": 0, "exams": []},
    }
    
    pdf_details = []
    docx_details = []
    code_details = []
    image_details = []
    unreadable_files = []
    
    # Regex patterns for academic artifacts (case-insensitive)
    re_def = re.compile(r'\b(tanım|definition|tanımı|tanımlanır)\b', re.IGNORECASE)
    re_thm = re.compile(r'\b(teorem|theorem|lemma|önerme|sonuç|corollary)\b', re.IGNORECASE)
    re_ex = re.compile(r'\b(örnek|example|örneğin)\b', re.IGNORECASE)
    re_sol = re.compile(r'\b(çözüm|solution|cevap|yanıt)\b', re.IGNORECASE)
    re_prob = re.compile(r'\b(soru|problem|alıştırma|exercise|ödev|sorular)\b', re.IGNORECASE)
    re_exam = re.compile(r'\b(vize|final|quiz|ara sınav|bütünleme|çıkmış soru)\b', re.IGNORECASE)
    
    total_definitions = 0
    total_theorems = 0
    total_examples = 0
    total_problems = 0
    total_solutions = 0
    total_exams = 0
    
    # 1. Process files
    for dirpath, dirnames, filenames in os.walk(ROOT_DIR):
        for fname in filenames:
            fpath = os.path.join(dirpath, fname)
            rel = os.path.relpath(fpath, ROOT_DIR)
            ext = os.path.splitext(fname)[1].lower()
            
            # Identify course
            lower_rel = rel.lower()
            course_name = None
            if "anageo" in lower_rel or "analitik" in lower_rel:
                course_name = "Analitik Geometri"
            elif "analiz" in lower_rel:
                course_name = "Matematiksel Analiz"
            elif "bilgisayar programlama" in lower_rel or "matbil.py" in lower_rel or "tauzenharshad" in lower_rel:
                course_name = "Bilgisayar Programlama"
            elif "tbt" in lower_rel or "matlab" in lower_rel:
                course_name = "Temel Bilgi Teknolojileri"
            elif "bilgisayar_mimarisi" in lower_rel:
                course_name = "Bilgisayar Mimarisi"
            elif "difdenk" in lower_rel or "diferansiyel" in lower_rel:
                course_name = "Diferansiyel Denklemler"
            elif "graf" in lower_rel:
                course_name = "Graf Teorisi"
            elif "gorsel" in lower_rel:
                course_name = "Görsel Programlama"
                
            c_data = courses.get(course_name) if course_name else None
            if c_data:
                c_data["files"].append(rel)
                
            # Check for exams in filename
            if re_exam.search(fname):
                total_exams += 1
                if c_data:
                    c_data["exams"].append(rel)

            if ext == '.pdf':
                pages = extract_pdf_full_text(fpath)
                total_chars = sum(len(p["text"]) for p in pages)
                is_scanned = total_chars < 50 and len(pages) > 0
                
                defs = 0
                thms = 0
                exs = 0
                probs = 0
                sols = 0
                
                all_text = " ".join(p["text"] for p in pages)
                if not is_scanned:
                    defs = len(re_def.findall(all_text))
                    thms = len(re_thm.findall(all_text))
                    exs = len(re_ex.findall(all_text))
                    probs = len(re_prob.findall(all_text))
                    sols = len(re_sol.findall(all_text))
                    
                    total_definitions += defs
                    total_theorems += thms
                    total_examples += exs
                    total_problems += probs
                    total_solutions += sols
                    
                    if c_data:
                        c_data["definitions"] += defs
                        c_data["theorems"] += thms
                        c_data["examples"] += exs
                        c_data["problems"] += probs
                        c_data["solutions"] += sols
                        
                pdf_details.append({
                    "path": rel,
                    "pages": len(pages),
                    "total_chars": total_chars,
                    "is_scanned": is_scanned,
                    "course": course_name,
                    "metrics": {"defs": defs, "thms": thms, "exs": exs, "probs": probs, "sols": sols}
                })
                
            elif ext == '.docx':
                paragraphs = get_docx_paragraphs(fpath)
                full_doc = "\n".join(paragraphs)
                defs = len(re_def.findall(full_doc))
                thms = len(re_thm.findall(full_doc))
                exs = len(re_ex.findall(full_doc))
                probs = len(re_prob.findall(full_doc))
                sols = len(re_sol.findall(full_doc))
                
                total_definitions += defs
                total_theorems += thms
                total_examples += exs
                total_problems += probs
                total_solutions += sols
                
                if c_data:
                    c_data["definitions"] += defs
                    c_data["theorems"] += thms
                    c_data["examples"] += exs
                    c_data["problems"] += probs
                    c_data["solutions"] += sols
                    
                docx_details.append({
                    "path": rel,
                    "paragraphs": len(paragraphs),
                    "char_count": len(full_doc),
                    "course": course_name,
                    "sample": paragraphs[:5],
                    "metrics": {"defs": defs, "thms": thms, "exs": exs, "probs": probs, "sols": sols}
                })
                
            elif ext in ['.m', '.py']:
                encodings = ['utf-8', 'latin-1', 'cp1254']
                content = ""
                for enc in encodings:
                    try:
                        with open(fpath, 'r', encoding=enc) as f:
                            content = f.read()
                        break
                    except Exception:
                        pass
                
                functions = re.findall(r'(?:def|function)\s+([a-zA-Z0-9_]+)', content)
                lines = content.splitlines()
                code_details.append({
                    "path": rel,
                    "language": "matlab" if ext == '.m' else "python",
                    "course": course_name,
                    "lines": len(lines),
                    "functions": functions
                })
                if c_data:
                    c_data["examples"] += len(functions)
                    total_examples += len(functions)

            elif ext in ['.jpg', '.jpeg', '.png']:
                image_details.append({
                    "path": rel,
                    "course": course_name
                })
                if "soru" in lower_rel or "vize" in lower_rel or "final" in lower_rel:
                    total_problems += 1
                    if c_data:
                        c_data["problems"] += 1

    # Extract sample detailed topics from docx and pdfs
    report_data = {
        "courses": {k: {
            "file_count": len(v["files"]),
            "definitions": v["definitions"],
            "theorems": v["theorems"],
            "examples": v["examples"],
            "problems": v["problems"],
            "solutions": v["solutions"],
            "exams_count": len(v["exams"]),
            "sample_files": v["files"][:5],
            "exams": v["exams"]
        } for k, v in courses.items()},
        "overall_totals": {
            "definitions": total_definitions,
            "theorems": total_theorems,
            "examples": total_examples,
            "problems": total_problems,
            "solutions": total_solutions,
            "exams": total_exams
        },
        "pdf_details": pdf_details,
        "docx_details": docx_details,
        "code_details": code_details[:30],
        "image_count": len(image_details)
    }
    
    out_file = os.path.join(os.path.dirname(__file__), "academic_content_report.json")
    with open(out_file, "w", encoding="utf-8") as f:
        json.dump(report_data, f, ensure_ascii=False, indent=2)
        
    print(f"Content report generated at {out_file}")
    print("Totals:", report_data["overall_totals"])

if __name__ == '__main__':
    main()
