import fs from 'fs';

const content = fs.readFileSync('C:\\Users\\ARDA\\.gemini\\antigravity\\brain\\d9ae7b82-ec33-4460-9984-67e17594327a\\.system_generated\\steps\\1314\\content.md', 'utf8');

// Match table rows: <tr>...<td>Code</td>...<td><a href="...">Name</a></td>...</tr>
const trRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
let trMatch;
const results = [];

while ((trMatch = trRegex.exec(content)) !== null) {
  const rowHtml = trMatch[1];
  const aMatch = /<a[^>]+href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/i.exec(rowHtml);
  if (aMatch) {
    const href = aMatch[1];
    const name = aMatch[2].replace(/<[^>]+>/g, '').trim();
    
    // Extract course code if present in the first td
    const tdMatches = [...rowHtml.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)];
    const code = tdMatches.length > 0 ? tdMatches[0][1].replace(/<[^>]+>/g, '').trim() : '';

    if (name && (href.includes('.pdf') || href.includes('/Storage/'))) {
      results.push({
        code,
        name,
        pdfUrl: href.startsWith('http') ? href : `https://matbil.ogu.edu.tr${href}`
      });
    }
  }
}

console.log(`Found ${results.length} course syllabus PDF links:`);
results.forEach(r => console.log(`${r.code} | ${r.name} -> ${r.pdfUrl}`));

fs.writeFileSync('syllabus_pdf_links.json', JSON.stringify(results, null, 2));
