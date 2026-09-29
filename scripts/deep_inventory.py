import os
import sys
import json
import zipfile
import re
from xml.etree import ElementTree as ET
from PIL import Image

try:
    import pypdfium2 as pdfium
except ImportError:
    pdfium = None

ROOT_DIR = r"C:\Users\ARDA\Desktop\2.sınıf Güz"

def get_docx_text(path):
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
            return '\n'.join(paragraphs)
    except Exception as e:
        return f"[ERROR DOCX: {e}]"

def analyze_pdf(path):
    if not pdfium:
        return {"error": "pypdfium2 not installed", "pages": 0, "text": "", "is_scanned": False}
    try:
        pdf = pdfium.PdfDocument(path)
        pages_count = len(pdf)
        extracted_pages = []
        total_chars = 0
        
        for i in range(pages_count):
            try:
                page = pdf[i]
                textpage = page.get_textpage()
                page_text = textpage.get_text_range() or ""
                total_chars += len(page_text.strip())
                extracted_pages.append({
                    "page": i + 1,
                    "char_count": len(page_text.strip()),
                    "snippet": page_text[:300].strip()
                })
            except Exception as pe:
                extracted_pages.append({
                    "page": i + 1,
                    "char_count": 0,
                    "error": str(pe)
                })
                
        is_scanned = total_chars < 50 and pages_count > 0
        return {
            "pages": pages_count,
            "total_chars": total_chars,
            "is_scanned": is_scanned,
            "sample_pages": extracted_pages[:5],
            "all_text_length": total_chars
        }
    except Exception as e:
        return {"error": str(e), "pages": 0, "total_chars": 0, "is_scanned": False}

def detect_course(rel_path, filename):
    lower = (rel_path + " " + filename).lower()
    if "anageo" in lower or "analitik" in lower:
        return "Analitik Geometri"
    elif "analiz" in lower:
        return "Matematiksel Analiz"
    elif "bilgisayar programlama" in lower or "python" in lower or "matbil" in lower:
        return "Bilgisayar Programlama (Python & Algoritmalar)"
    elif "tbt" in lower or "matlab" in lower or "alper_odabas" in lower:
        return "Temel Bilgi Teknolojileri (MATLAB & Bilimsel Hesaplama)"
    elif "bilgisayar_mimarisi" in lower:
        return "Bilgisayar Mimarisi"
    elif "difdenk" in lower or "diferansiyel" in lower:
        return "Diferansiyel Denklemler"
    elif "graf" in lower:
        return "Graf Teorisi"
    elif "gorsel" in lower:
        return "Görsel Programlama"
    else:
        return "Genel Akademik Kaynak"

def scan_all():
    print(f"Scanning {ROOT_DIR}...")
    inventory = []
    failed_files = []
    
    file_type_counts = {}
    course_counts = {}
    
    total_pages = 0
    scanned_pdfs = []
    digital_pdfs = []
    
    for dirpath, dirnames, filenames in os.walk(ROOT_DIR):
        for fname in filenames:
            full_path = os.path.join(dirpath, fname)
            rel_path = os.path.relpath(full_path, ROOT_DIR)
            ext = os.path.splitext(fname)[1].lower()
            size = os.path.getsize(full_path)
            
            file_type_counts[ext] = file_type_counts.get(ext, 0) + 1
            course = detect_course(rel_path, fname)
            course_counts[course] = course_counts.get(course, 0) + 1
            
            item = {
                "filename": fname,
                "rel_path": rel_path,
                "full_path": full_path,
                "extension": ext,
                "size_bytes": size,
                "course": course,
            }
            
            if ext == '.pdf':
                res = analyze_pdf(full_path)
                item["pdf_meta"] = res
                total_pages += res.get("pages", 0)
                if res.get("is_scanned"):
                    scanned_pdfs.append(rel_path)
                elif res.get("pages", 0) > 0:
                    digital_pdfs.append(rel_path)
                if "error" in res:
                    failed_files.append({"path": rel_path, "reason": res["error"]})
                    
            elif ext in ['.docx']:
                text = get_docx_text(full_path)
                item["docx_meta"] = {
                    "word_count": len(text.split()),
                    "char_count": len(text),
                    "snippet": text[:300].strip()
                }
                
            elif ext in ['.m', '.py', '.txt', '.md', '.html', '.asv']:
                try:
                    encodings = ['utf-8', 'latin-1', 'cp1254', 'iso-8859-9']
                    content = ""
                    for enc in encodings:
                        try:
                            with open(full_path, 'r', encoding=enc) as f:
                                content = f.read()
                            break
                        except Exception:
                            continue
                    lines = content.splitlines()
                    item["code_meta"] = {
                        "line_count": len(lines),
                        "char_count": len(content),
                        "snippet": content[:300].strip()
                    }
                except Exception as e:
                    failed_files.append({"path": rel_path, "reason": str(e)})
                    
            elif ext in ['.jpg', '.jpeg', '.png']:
                try:
                    with Image.open(full_path) as img:
                        w, h = img.size
                        item["image_meta"] = {
                            "width": w,
                            "height": h,
                            "format": img.format
                        }
                except Exception as e:
                    item["image_meta"] = {"error": str(e)}
            
            inventory.append(item)
            
    summary = {
        "total_files": len(inventory),
        "file_type_counts": file_type_counts,
        "course_counts": course_counts,
        "total_pdf_pages": total_pages,
        "scanned_pdf_count": len(scanned_pdfs),
        "scanned_pdfs": scanned_pdfs,
        "digital_pdf_count": len(digital_pdfs),
        "failed_files": failed_files,
    }
    
    out_path = os.path.join(os.path.dirname(__file__), "inventory_summary.json")
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump({"summary": summary, "files": inventory}, f, ensure_ascii=False, indent=2)
        
    print(f"Summary generated at {out_path}")
    print(f"Total files: {len(inventory)}")
    print(f"Total PDF pages: {total_pages}")
    print(f"Scanned PDFs: {len(scanned_pdfs)}")
    print("Course distribution:", course_counts)
    print("File type distribution:", file_type_counts)

if __name__ == '__main__':
    scan_all()
