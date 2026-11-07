"""Build public/Andrew Velazquez resume.pdf on US Letter, one page, 0.75 inch margins.

Run: python tools/resume.py
"""
from pathlib import Path

from reportlab.lib.colors import HexColor
from reportlab.lib.enums import TA_CENTER, TA_RIGHT
from reportlab.lib.pagesizes import LETTER
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import inch
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (BaseDocTemplate, Flowable, Frame, KeepTogether, ListFlowable, ListItem,
                                PageTemplate, Paragraph, Spacer, Table, TableStyle)

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "Andrew Velazquez resume.pdf"
NAME = "Andrew Velazquez"

FONTS = Path("C:/Windows/Fonts")
pdfmetrics.registerFont(TTFont("Cal", str(FONTS / "calibri.ttf")))
pdfmetrics.registerFont(TTFont("Cal-B", str(FONTS / "calibrib.ttf")))
pdfmetrics.registerFont(TTFont("Cal-I", str(FONTS / "calibrii.ttf")))
pdfmetrics.registerFont(TTFont("Cal-BI", str(FONTS / "calibriz.ttf")))
pdfmetrics.registerFontFamily("Cal", normal="Cal", bold="Cal-B", italic="Cal-I", boldItalic="Cal-BI")

NAVY = HexColor("#1F3864")
GREY = HexColor("#404040")
MARGIN = 0.75 * inch
PAGE_W, PAGE_H = LETTER
FRAME_W = PAGE_W - 2 * MARGIN

body = ParagraphStyle("body", fontName="Cal", fontSize=10, leading=11.9)
right = ParagraphStyle("right", parent=body, alignment=TA_RIGHT)
note = ParagraphStyle("note", parent=body, textColor=GREY)
title = ParagraphStyle("title", fontName="Cal-B", fontSize=18, leading=22, alignment=TA_CENTER, textColor=NAVY)
centre = ParagraphStyle("centre", parent=body, alignment=TA_CENTER)
head = ParagraphStyle("head", fontName="Cal-B", fontSize=11, leading=13, textColor=NAVY)


class Rule(Flowable):
    def __init__(self, width):
        super().__init__()
        self.width, self.height = width, 1

    def draw(self):
        self.canv.setStrokeColor(NAVY)
        self.canv.setLineWidth(0.6)
        self.canv.line(0, 0, self.width, 0)


def section(text):
    return [Spacer(1, 5), Paragraph(text.upper(), head), Spacer(1, 1), Rule(FRAME_W), Spacer(1, 3)]


def row(left, right_text, style=body, right_share=0.24):
    """Left text with a right-aligned date, widths computed from the frame."""
    right_w = FRAME_W * right_share
    t = Table([[Paragraph(left, style), Paragraph(right_text, right)]], colWidths=[FRAME_W - right_w, right_w])
    t.setStyle(TableStyle([("LEFTPADDING", (0, 0), (-1, -1), 0), ("RIGHTPADDING", (0, 0), (-1, -1), 0),
                           ("TOPPADDING", (0, 0), (-1, -1), 0), ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
                           ("VALIGN", (0, 0), (-1, -1), "TOP")]))
    return t


def bullets(items):
    return ListFlowable([ListItem(Paragraph(i, body), leftIndent=14, value="•") for i in items],
                        bulletType="bullet", start="•", leftIndent=14, bulletFontName="Cal", bulletFontSize=10,
                        spaceBefore=1)


SKILLS = [
    ("Languages", "TypeScript, JavaScript, Python, SQL (PostgreSQL, BigQuery GoogleSQL), PHP, Java, HTML, CSS"),
    ("Frameworks", "React, React Native, Node.js, Express, FastAPI, Laravel, Svelte, Vite, Tailwind"),
    ("Cloud and data", "GCP (Cloud Run, Cloud SQL, BigQuery, Secret Manager), Terraform, Firebase, Docker, PostgreSQL"),
    ("AI and agents", "Claude API (Haiku, Sonnet, Opus), Claude Code, LLM evals, Gemini, RAG, NL2SQL, "
                      "llama.cpp, Ollama, OpenClaw, MCP"),
    ("Tools and practices", "GitHub Actions CI/CD, Jira, Agile/Scrum, EDI X12 (204, 210, 214, 990), Twilio, OpenTelemetry, "
                            "Vitest"),
]

GH_POINTS = [
    "Built a multi-agent platform on a dual-GPU workstation: local Qwen and Gemma models on llama.cpp do the work and "
    "Claude reviewers approve each plan; agents opened 43 draft PRs (bug fixes and SOPs), guarded by a GitHub App.",
    "Designed and shipped Data Dump, an LLM pipeline turning chat and email updates into verified TMS notes (Claude "
    "Haiku, Sonnet, Batches API); cleared a 24,656-message backlog for under $40, with eval-gated CI and 414 tests.",
    "Built Bravo Builders, a Claude Code plugin and five-week course that lets operations staff build Bravo Matrix "
    "changes; its pre-command hook blocks deploys, merges, and pushes to master so every session ends in a draft PR.",
    "Built and run the QA module for check-call review (29 merged PRs): Dialpad click-to-call, FourKites and Indemni "
    "pushes, a points-based checklist board, and a staging site; cut each dashboard refresh from about 10 MB to 0.2 MB.",
    "Shipped a Telegram and email helpdesk agent on a local LLM that files IT tickets into the team tracker, with a "
    "custom tool plugin, one-time-code sign-in verified against Google Workspace accounts, and a 32-scenario eval suite.",
    "Single-handedly built and deployed Supplier Bridge, sealed-bid freight procurement live with 6 external companies "
    "including J.B. Hunt: Firestore security rules (212 tests), Twilio SMS and push alerts, and a bidding stress harness.",
    "Cut server latency by over 88% by tracing production 504 timeouts to a Vite dev server running in production; "
    "shipped an optimized static build and moved blocking BigQuery queries off live request paths.",
]


def story():
    s = [
        Paragraph("ANDREW VELAZQUEZ", title),
        Spacer(1, 2),
        Paragraph("San Antonio, TX&nbsp;&nbsp;|&nbsp;&nbsp;(210) 589-9862&nbsp;&nbsp;|&nbsp;&nbsp;"
                  "velazquezandrew27@gmail.com", centre),
        Paragraph("linkedin.com/in/drewsworth&nbsp;&nbsp;|&nbsp;&nbsp;github.com/drewsworthh&nbsp;&nbsp;|"
                  "&nbsp;&nbsp;drewsworth.dev", centre),
    ]
    s += section("Summary")
    s.append(Paragraph("Software engineer building production AI systems and cloud-native platforms on Google Cloud for a "
                       "24/7 freight operation. Strong in LLM pipelines and evals, multi-agent systems, agent "
                       "guardrails, Claude Code tooling, REST APIs, and EDI X12.", body))
    s += section("Technical skills")
    s += [Paragraph(f"<b>{k}:</b> {v}", body) for k, v in SKILLS]
    s += section("Professional experience")
    s += [row("<b>GH Logistics LLC</b>", "San Antonio, TX"),
          row("<i>Software Engineer</i>", "Jun 2026 to Present"),
          Paragraph("Joined a four-person application development and DevOps team for a 24/7 freight brokerage; now its sole engineer", note),
          bullets(GH_POINTS),
          Spacer(1, 4),
          row("<b>Ventura Telephone</b>", "San Antonio, TX"),
          row("<i>Software Developer I</i>", "Sep 2024 to Feb 2025"),
          row("<i>Software Development Assistant</i>", "Feb 2024 to Sep 2024"),
          bullets(["Built job navigation and payroll web apps and REST APIs for an AT&amp;T contractor (Laravel, PHP, "
                   "JavaScript, MySQL); optimized databases and modernized legacy code."])]
    s += section("Projects")
    s.append(KeepTogether([
        row("<b>AQUA, natural-language-to-SQL assistant</b>&nbsp;&nbsp;|&nbsp;&nbsp;Rowdy Hacks 2026 (24 hours, team of "
            "3)&nbsp;&nbsp;|&nbsp;&nbsp;aqua-ai.us", "Oct 2026", right_share=0.12),
        bullets(["Main backend developer: built a Python NL2SQL engine on Gemini 3.5 Flash-Lite with a self-hosted "
                 "qwen3:8b (Ollama) fallback, returning SQL, live results, and charts from TigerData PostgreSQL.",
                 "Grounded queries with gemini-embedding-2 retrieval, reaching about 80% accuracy at about 5 seconds "
                 "per answer; set up the Ubuntu server for the self-hosted model."]),
    ]))
    s += section("Education and certifications")
    s += [row("<b>University of Texas at San Antonio, B.S., Software Engineering</b>", "Expected May 2027"),
          row("<b>Northwest Vista College, A.S., Computer Science</b>", "Dec 2024"),
          Paragraph("Certifications: Google IT Automation with Python Professional Certificate&nbsp;&nbsp;·&nbsp;&nbsp;"
                    "C++ Programming Occupational Skills Certificate", body)]
    return s


def main():
    doc = BaseDocTemplate(str(OUT), pagesize=LETTER, leftMargin=MARGIN, rightMargin=MARGIN, topMargin=MARGIN,
                          bottomMargin=MARGIN, title=f"{NAME} resume", author=NAME, creator=NAME, producer=NAME,
                          subject="Resume")
    frame = Frame(MARGIN, MARGIN, FRAME_W, PAGE_H - 2 * MARGIN, leftPadding=0, rightPadding=0, topPadding=0,
                  bottomPadding=0)
    pages = []
    doc.addPageTemplates([PageTemplate(frames=[frame], onPage=lambda c, d: pages.append(d.page))])
    doc.build(story())
    if len(pages) != 1:
        raise SystemExit(f"Resume runs to {len(pages)} pages; trim a bullet.")
    print(f"Wrote {OUT}")


if __name__ == "__main__":
    main()
