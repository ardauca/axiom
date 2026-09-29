import os
import sys
import json
import hashlib
import zipfile
import re
from xml.etree import ElementTree as ET

try:
    import pypdfium2 as pdfium
except ImportError:
    pdfium = None

REPO1_DIR = r"C:\Users\ARDA\Desktop\2.sınıf Güz"
REPO2_DIR = r"D:\Belgeler\Ders"

EXCLUDED_FILENAMES = {'desktop.ini', 'thumbs.db', '.ds_store', 'yeni metin belgesi.txt'}

def compute_sha256(filepath, max_bytes=10*1024*1024):
    """Compute sha256 of file (first 10MB if huge for speed, or entire file if <= 10MB)"""
    h = hashlib.sha256()
    try:
        with open(filepath, 'rb') as f:
            while chunk := f.read(65536):
                h.update(chunk)
                if f.tell() >= max_bytes:
                    break
        return h.hexdigest()
    except Exception as e:
        return f"ERR:{e}"

def get_docx_snippet(path):
    try:
        with zipfile.ZipFile(path) as z:
            xml_content = z.read('word/document.xml')
            tree = ET.fromstring(xml_content)
            paragraphs = []
            for node in tree.iter():
                if node.tag.endswith('}p'):
                    t = ''.join([n.text for n in node.iter() if n.tag.endswith('}t') and n.text])
                    if t.strip():
                        paragraphs.append(t.strip())
            return {
                "paragraph_count": len(paragraphs),
                "snippet": " ".join(paragraphs[:5])[:300],
                "char_count": sum(len(p) for p in paragraphs)
            }
    except Exception as e:
        return {"error": str(e), "paragraph_count": 0, "snippet": "", "char_count": 0}

def get_pdf_meta(path):
    if not pdfium:
        return {"pages": 0, "chars": 0, "is_scanned": False, "snippet": ""}
    try:
        doc = pdfium.PdfDocument(path)
        pages_count = len(doc)
        total_chars = 0
        first_page_text = ""
        for i in range(pages_count):
            try:
                t = doc[i].get_textpage().get_text_range() or ""
                total_chars += len(t.strip())
                if i == 0:
                    first_page_text = t[:300].strip().replace('\n', ' ')
            except Exception:
                pass
        return {
            "pages": pages_count,
            "chars": total_chars,
            "is_scanned": total_chars < 50 and pages_count > 0,
            "snippet": first_page_text
        }
    except Exception as e:
        return {"error": str(e), "pages": 0, "chars": 0, "is_scanned": False, "snippet": ""}

def detect_course_and_semester(rel_path, filename):
    lower = (rel_path + " " + filename).lower()
    
    # Semester clues
    semester = "Belirtilmemiş"
    if "1.sınıf güz" in lower or "1.sinif guz" in lower:
        semester = "1. Sınıf Güz"
    elif "1.sınıf bahar" in lower or "1.sinif bahar" in lower:
        semester = "1. Sınıf Bahar"
    elif "2.sınıf güz" in lower or "2.sinif guz" in lower:
        semester = "2. Sınıf Güz"
    elif "2.sınıf bahar" in lower or "2.sinif bahar" in lower:
        semester = "2. Sınıf Bahar"
        
    # Course detection
    if "analiz 4" in lower or "analiz4" in lower or "analiz_iv" in lower or "analiz iv" in lower:
        return "Analiz IV", semester or "2. Sınıf Bahar"
    elif "analiz 3" in lower or "analiz3" in lower or "analiz_3" in lower:
        return "Analiz III", semester or "2. Sınıf Güz"
    elif "analiz 1" in lower or "analiz1" in lower or "analiz_1" in lower or "analiz i" in lower:
        return "Analiz I", semester or "1. Sınıf Güz"
    elif "analiz" in lower:
        return "Matematiksel Analiz (Genel)", semester
    elif "lineer" in lower or "cebir" in lower:
        return "Lineer Cebir I & II", semester or "1. Sınıf"
    elif "difdenk" in lower or "diferansiyel" in lower:
        return "Diferansiyel Denklemler", semester or "2. Sınıf Güz"
    elif "anageo" in lower or "analitik" in lower:
        return "Analitik Geometri I & II", semester or "1. Sınıf"
    elif "graf" in lower:
        return "Graf Teorisi ve Uygulamaları-I", semester or "2. Sınıf Güz"
    elif "bilgisayar_mimarisi" in lower or "mimarisi" in lower:
        return "Bilgisayar Mimarisi", semester or "2. Sınıf Güz"
    elif "gorsel" in lower or "görsel" in lower:
        return "Görsel Programlama I", semester or "2. Sınıf Güz"
    elif "tbt" in lower or "matlab" in lower or "alper_odabas" in lower:
        return "Temel Bilgi Teknolojileri (MATLAB)", semester or "1. Sınıf / 2. Sınıf"
    elif "bilgisayar programlama" in lower or "python" in lower:
        return "Bilgisayar Programlama (Python)", semester or "1. Sınıf / 2. Sınıf"
    elif "ayrık" in lower or "discrete" in lower:
        return "Ayrık Matematik", semester or "1. Sınıf"
    elif "fizik" in lower or "physics" in lower:
        return "Fizik", semester or "1. Sınıf"
    elif "istatistik" in lower or "olasilik" in lower or "olasılık" in lower:
        return "Olasılık ve İstatistik", semester
    elif "soyut" in lower:
        return "Soyut Matematik", semester
    else:
        return "Diğer Akademik Materyal", semester

def scan_repository(repo_path, repo_name):
    print(f"Scanning {repo_name} at {repo_path}...")
    files_list = []
    
    for dirpath, dirnames, filenames in os.walk(repo_path):
        for fname in filenames:
            ext = os.path.splitext(fname)[1].lower()
            lower_fname = fname.lower()
            
            # Filter system / trash
            if lower_fname in EXCLUDED_FILENAMES:
                continue
            if fname.startswith("~$") or lower_fname.endswith('.tmp'):
                continue
                
            full_path = os.path.join(dirpath, fname)
            rel_path = os.path.relpath(full_path, repo_path)
            
            try:
                size = os.path.getsize(full_path)
                mtime = os.path.getmtime(full_path)
            except Exception:
                continue
                
            # If 0-byte file, skip
            if size == 0:
                continue
                
            course, semester = detect_course_and_semester(rel_path, fname)
            sha = compute_sha256(full_path)
            
            f_type = "other"
            if ext in ['.pdf']: f_type = "pdf"
            elif ext in ['.docx', '.doc']: f_type = "docx"
            elif ext in ['.m', '.py', '.ipynb']: f_type = "code"
            elif ext in ['.jpg', '.jpeg', '.png']: f_type = "image"
            elif ext in ['.txt', '.md', '.html']: f_type = "text"
            
            # Check exam keywords in filename
            is_exam = bool(re.search(r'\b(vize|final|quiz|sinav|sınav|bütünleme|sorular)\b', lower_fname))
            
            meta = {}
            if f_type == "pdf":
                meta = get_pdf_meta(full_path)
            elif f_type == "docx":
                meta = get_docx_snippet(full_path)
                
            files_list.append({
                "repo": repo_name,
                "filename": fname,
                "rel_path": rel_path,
                "full_path": full_path,
                "extension": ext,
                "size_bytes": size,
                "mtime": mtime,
                "sha256": sha,
                "course": course,
                "semester": semester,
                "file_type": f_type,
                "is_exam": is_exam,
                "meta": meta
            })
            
    print(f"Scanned {len(files_list)} valid academic files in {repo_name}.")
    return files_list

def main():
    repo1_files = scan_repository(REPO1_DIR, "Repo1 (2.sınıf Güz)")
    repo2_files = scan_repository(REPO2_DIR, "Repo2 (D:\\Belgeler\\Ders)")
    
    all_files = repo1_files + repo2_files
    
    # 1. Exact Duplicate Detection via SHA-256
    sha_map = {}
    for f in all_files:
        sha = f["sha256"]
        if sha not in sha_map:
            sha_map[sha] = []
        sha_map[sha].append(f)
        
    exact_duplicates = []
    cross_repo_duplicates = []
    
    for sha, flist in sha_map.items():
        if len(flist) > 1:
            repos_in_cluster = set(f["repo"] for f in flist)
            cluster_info = {
                "sha256": sha,
                "count": len(flist),
                "files": [{"repo": f["repo"], "path": f["rel_path"], "size": f["size_bytes"]} for f in flist]
            }
            exact_duplicates.append(cluster_info)
            if len(repos_in_cluster) > 1:
                cross_repo_duplicates.append(cluster_info)
                
    # 2. Near Duplicate / Filename Similarity Detection
    name_map = {}
    for f in all_files:
        norm_name = re.sub(r'[_\-\s\(\)\d]', '', f["filename"].lower())
        if norm_name not in name_map:
            name_map[norm_name] = []
        name_map[norm_name].append(f)
        
    near_duplicates = []
    for norm_name, flist in name_map.items():
        if len(flist) > 1 and len(set(f["sha256"] for f in flist)) > 1:
            near_duplicates.append({
                "normalized_key": norm_name,
                "files": [{"repo": f["repo"], "path": f["rel_path"], "filename": f["filename"], "size": f["size_bytes"], "pages": f["meta"].get("pages")} for f in flist]
            })

    # Summary Statistics per repo
    def get_repo_stats(flist):
        tot_size = sum(f["size_bytes"] for f in flist)
        courses = {}
        types = {}
        exams = 0
        pdf_pages = 0
        scanned_pdfs = 0
        for f in flist:
            c = f["course"]
            t = f["file_type"]
            courses[c] = courses.get(c, 0) + 1
            types[t] = types.get(t, 0) + 1
            if f["is_exam"]: exams += 1
            if f["file_type"] == "pdf":
                pdf_pages += f["meta"].get("pages", 0)
                if f["meta"].get("is_scanned"): scanned_pdfs += 1
        return {
            "total_files": len(flist),
            "total_size_mb": round(tot_size / (1024*1024), 2),
            "courses": courses,
            "file_types": types,
            "exams_count": exams,
            "pdf_pages": pdf_pages,
            "scanned_pdfs": scanned_pdfs
        }

    stats1 = get_repo_stats(repo1_files)
    stats2 = get_repo_stats(repo2_files)
    
    out_data = {
        "repo1_stats": stats1,
        "repo2_stats": stats2,
        "exact_duplicates_total": len(exact_duplicates),
        "cross_repo_duplicates_total": len(cross_repo_duplicates),
        "cross_repo_duplicates": cross_repo_duplicates,
        "near_duplicates_sample": near_duplicates[:25],
        "all_files_count": len(all_files)
    }
    
    out_file = os.path.join(os.path.dirname(__file__), "two_repo_comparison.json")
    with open(out_file, "w", encoding="utf-8") as f:
        json.dump(out_data, f, ensure_ascii=False, indent=2)
        
    print(f"Comparison report written to {out_file}")
    print(f"Repo1 Valid Files: {stats1['total_files']} ({stats1['total_size_mb']} MB)")
    print(f"Repo2 Valid Files: {stats2['total_files']} ({stats2['total_size_mb']} MB)")
    print(f"Cross-Repo Exact Duplicates: {len(cross_repo_duplicates)}")
    print(f"Near Duplicates Clusters: {len(near_duplicates)}")

if __name__ == '__main__':
    main()
