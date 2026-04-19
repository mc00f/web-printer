/* i have zero idea how this works, blame claude */
import { useState, useRef, useEffect } from "react";

const THERMAL_FONT = "'Courier New', Courier, monospace";

const TEST_PRINT_LINES = [
 "================================",
 " ** TEST PRINT ** ",
 "================================",
 "",
 " THERMAL RECEIPT PRINTER v1.0 ",
 " Web Edition ",
 "",
 "--------------------------------",
 " Paper Width: 80mm ",
 " DPI: 203 ",
 " Status: OK ",
 " Cutter: READY ",
 "--------------------------------",
 "",
 " If you can read this, ",
 " the printer is working! ",
 "",
 "================================",
 " END OF TEST PRINT ",
 "================================",
];

function formatTimestamp(date) {
 return date.toLocaleString("en-US", {
 month: "2-digit",
 day: "2-digit",
 year: "numeric",
 hour: "2-digit",
 minute: "2-digit",
 second: "2-digit",
 hour12: true,
 });
}

function ReceiptPaper({ lines, timestamp, id, onDiscard, isNew }) {
 const [visible, setVisible] = useState(false);
 const [discarding, setDiscarding] = useState(false);

 useEffect(() => {
 requestAnimationFrame(() => setVisible(true));
 }, []);

 const handleDiscard = () => {
 setDiscarding(true);
 setTimeout(() => onDiscard(id), 350);
 };

 return (
 <div
 style={{
 transition: "all 0.35s cubic-bezier(.4,0,.2,1)",
 opacity: discarding ? 0 : visible ? 1 : 0,
 transform: discarding
 ? "translateY(-18px) scale(0.97)"
 : visible
 ? "translateY(0) scale(1)"
 : "translateY(12px) scale(0.98)",
 marginBottom: "18px",
 }}
 >
 {/* Tear edge top */}
 <div style={{ position: "relative", height: "10px", overflow: "hidden" }}>
 <svg width="100%" height="10" viewBox="0 0 400 10" preserveAspectRatio="none">
 <path
 d="M0,10 Q10,0 20,8 Q30,16 40,6 Q50,-2 60,8 Q70,16 80,4 Q90,-4 100,8 Q110,16 120,4 Q130,-4 140,8 Q150,16 160,6 Q170,-2 180,8 Q190,16 200,4 Q210,-4 220,8 Q230,16 240,6 Q250,-2 260,8 Q270,16 280,4 Q290,-4 300,8 Q310,16 320,4 Q330,-4 340,8 Q350,16 360,6 Q370,-2 380,8 Q390,16 400,10"
 fill="#f0ece2"
 />
 </svg>
 </div>

 {/* Receipt body */}
 <div
 style={{
 background: "#f0ece2",
 backgroundImage:
 "repeating-linear-gradient(0deg, transparent, transparent 23px, rgba(0,0,0,0.03) 24px)",
 padding: "10px 20px 16px",
 fontFamily: THERMAL_FONT,
 fontSize: "13px",
 lineHeight: "24px",
 color: "#1a1410",
 letterSpacing: "0.02em",
 position: "relative",
 boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
 }}
 >
 {/* Timestamp header */}
 <div
 style={{
 fontSize: "10px",
 color: "#888",
 marginBottom: "6px",
 letterSpacing: "0.04em",
 }}
 >
 PRINTED: {timestamp}
 </div>

 {lines.map((line, i) => (
 <div
 key={i}
 style={{
 whiteSpace: "pre",
 minHeight: "24px",
 fontWeight: line.includes("**") ? "700" : "400",
 }}
 >
 {line}
 </div>
 ))}

 {/* Discard button */}
 <button
 onClick={handleDiscard}
 title="Discard this print"
 style={{
 position: "absolute",
 top: "10px",
 right: "10px",
 background: "none",
 border: "1px solid #c8bfa8",
 borderRadius: "3px",
 color: "#b08060",
 fontSize: "11px",
 fontFamily: THERMAL_FONT,
 cursor: "pointer",
 padding: "2px 7px",
 letterSpacing: "0.05em",
 transition: "all 0.15s",
 }}
 onMouseEnter={(e) => {
 e.currentTarget.style.background = "#e0d4bf";
 e.currentTarget.style.color = "#7a3020";
 }}
 onMouseLeave={(e) => {
 e.currentTarget.style.background = "none";
 e.currentTarget.style.color = "#b08060";
 }}
 >
 DISCARD
 </button>
 </div>

 {/* Tear edge bottom */}
 <div style={{ position: "relative", height: "10px", overflow: "hidden" }}>
 <svg width="100%" height="10" viewBox="0 0 400 10" preserveAspectRatio="none">
 <path
 d="M0,0 Q10,10 20,2 Q30,-6 40,4 Q50,14 60,2 Q70,-6 80,6 Q90,14 100,2 Q110,-6 120,4 Q130,14 140,2 Q150,-6 160,6 Q170,14 180,2 Q190,-6 200,4 Q210,14 220,2 Q230,-6 240,6 Q250,14 260,2 Q270,-6 280,4 Q290,14 300,2 Q310,-6 320,4 Q330,14 340,2 Q350,-6 360,6 Q370,14 380,2 Q390,-6 400,0"
 fill="#f0ece2"
 />
 </svg>
 </div>
 </div>
 );
}

function PrinterStatus({ printing }) {
 return (
 <div
 style={{
 display: "flex",
 alignItems: "center",
 gap: "8px",
 fontSize: "11px",
 fontFamily: THERMAL_FONT,
 letterSpacing: "0.06em",
 color: printing ? "#e07020" : "#40a060",
 }}
 >
 <span
 style={{
 width: "8px",
 height: "8px",
 borderRadius: "50%",
 background: printing ? "#e07020" : "#40a060",
 boxShadow: printing
 ? "0 0 6px 2px rgba(224,112,32,0.5)"
 : "0 0 6px 2px rgba(64,160,96,0.4)",
 animation: printing ? "blink 0.5s infinite" : "none",
 display: "inline-block",
 flexShrink: 0,
 }}
 />
 {printing ? "PRINTING..." : "READY"}
 </div>
 );
}

export default function ReceiptPrinter() {
 const [prints, setPrints] = useState([]);
 const [customText, setCustomText] = useState("");
 const [printing, setPrinting] = useState(false);
 const [activeTab, setActiveTab] = useState("custom");
 const outputRef = useRef(null);

 const doPrint = (lines) => {
 setPrinting(true);
 setTimeout(() => {
 const newPrint = {
 id: Date.now(),
 lines,
 timestamp: formatTimestamp(new Date()),
 };
 setPrints((prev) => [newPrint, ...prev]);
 setPrinting(false);
 setTimeout(() => {
 outputRef.current?.scrollTo({ top: 0, behavior: "smooth" });
 }, 50);
 }, 700);
 };

 const handleCustomPrint = () => {
 if (!customText.trim()) return;
 const lines = customText.split("\n");
 doPrint(lines);
 setCustomText("");
 };

 const handleTestPrint = () => {
 doPrint(TEST_PRINT_LINES);
 };

 const handleDiscard = (id) => {
 setPrints((prev) => prev.filter((p) => p.id !== id));
 };

 const handleDiscardAll = () => {
 setPrints([]);
 };

 return (
 <div
 style={{
 minHeight: "100vh",
 background: "#1a1510",
 backgroundImage:
 "radial-gradient(ellipse at 20% 10%, #2a1f0a 0%, transparent 60%), radial-gradient(ellipse at 80% 90%, #1a2010 0%, transparent 60%)",
 display: "flex",
 flexDirection: "column",
 alignItems: "center",
 padding: "32px 16px 48px",
 fontFamily: THERMAL_FONT,
 }}
 >
 <style>{`
 @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.2} }
 @keyframes feed { 0%{transform:translateY(-8px);opacity:0} 100%{transform:translateY(0);opacity:1} }
 textarea { resize: vertical; }
 textarea::placeholder { opacity: 0.5; }
 ::-webkit-scrollbar { width: 6px; }
 ::-webkit-scrollbar-track { background: #111; }
 ::-webkit-scrollbar-thumb { background: #3a3028; border-radius: 3px; }
 `}</style>

 {/* Printer Machine */}
 <div
 style={{
 width: "100%",
 maxWidth: "460px",
 background: "linear-gradient(160deg, #2e2820 0%, #201c14 100%)",
 borderRadius: "18px 18px 10px 10px",
 boxShadow:
 "0 4px 32px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.07), 0 0 0 1px rgba(0,0,0,0.5)",
 overflow: "hidden",
 marginBottom: "0px",
 }}
 >
 {/* Top panel */}
 <div
 style={{
 padding: "20px 24px 14px",
 borderBottom: "1px solid rgba(255,255,255,0.06)",
 }}
 >
 <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
 <div>
 <div
 style={{
 fontSize: "19px",
 fontWeight: "700",
 color: "#e8d8b0",
 letterSpacing: "0.08em",
 textTransform: "uppercase",
 }}
 >
 THERMOPRINT
 </div>
 <div style={{ fontSize: "10px", color: "#706050", letterSpacing: "0.1em", marginTop: "2px" }}>
 WEB RECEIPT TERMINAL
 </div>
 </div>
 <PrinterStatus printing={printing} />
 </div>

 {/* Paper slot visual */}
 <div
 style={{
 marginTop: "14px",
 height: "6px",
 background: "#0d0b08",
 borderRadius: "3px",
 border: "1px solid rgba(255,255,255,0.06)",
 position: "relative",
 overflow: "hidden",
 }}
 >
 {printing && (
 <div
 style={{
 position: "absolute",
 inset: 0,
 background: "linear-gradient(90deg, transparent, #f0ece2 40%, #f0ece2 60%, transparent)",
 animation: "feed 0.7s ease-in-out",
 }}
 />
 )}
 </div>
 </div>

 {/* Control panel */}
 <div style={{ padding: "16px 24px 20px" }}>
 {/* Tabs */}
 <div
 style={{
 display: "flex",
 gap: "4px",
 marginBottom: "16px",
 background: "#13110d",
 borderRadius: "8px",
 padding: "4px",
 }}
 >
 {["custom", "test"].map((tab) => (
 <button
 key={tab}
 onClick={() => setActiveTab(tab)}
 style={{
 flex: 1,
 padding: "8px",
 border: "none",
 borderRadius: "5px",
 fontFamily: THERMAL_FONT,
 fontSize: "11px",
 letterSpacing: "0.08em",
 textTransform: "uppercase",
 cursor: "pointer",
 transition: "all 0.15s",
 background: activeTab === tab ? "#3a2f1c" : "transparent",
 color: activeTab === tab ? "#e8c870" : "#706050",
 fontWeight: activeTab === tab ? "700" : "400",
 boxShadow: activeTab === tab ? "inset 0 1px 0 rgba(255,255,255,0.06)" : "none",
 }}
 >
 {tab === "custom" ? "CUSTOM PRINT" : "TEST PRINT"}
 </button>
 ))}
 </div>

 {activeTab === "custom" && (
 <div style={{ animation: "feed 0.2s ease" }}>
 <textarea
 value={customText}
 onChange={(e) => setCustomText(e.target.value)}
 placeholder={"Type your receipt text here...\nEach line will print as-is."}
 rows={5}
 style={{
 width: "100%",
 background: "#0d0b08",
 border: "1px solid rgba(255,255,255,0.08)",
 borderRadius: "8px",
 color: "#e8d8b0",
 fontFamily: THERMAL_FONT,
 fontSize: "13px",
 lineHeight: "1.6",
 padding: "12px 14px",
 outline: "none",
 boxSizing: "border-box",
 letterSpacing: "0.03em",
 transition: "border-color 0.15s",
 }}
 onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(232,200,112,0.3)")}
 onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}
 onKeyDown={(e) => {
 if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) handleCustomPrint();
 }}
 />
 <div style={{ fontSize: "10px", color: "#504030", marginTop: "4px", letterSpacing: "0.04em" }}>
 CTRL+ENTER TO PRINT
 </div>
 <button
 onClick={handleCustomPrint}
 disabled={!customText.trim() || printing}
 style={{
 marginTop: "12px",
 width: "100%",
 padding: "11px",
 background:
 !customText.trim() || printing
 ? "#1e1a12"
 : "linear-gradient(135deg, #c87820 0%, #e09030 100%)",
 border: "none",
 borderRadius: "8px",
 color: !customText.trim() || printing ? "#504030" : "#1a0e00",
 fontFamily: THERMAL_FONT,
 fontSize: "13px",
 fontWeight: "700",
 letterSpacing: "0.1em",
 cursor: !customText.trim() || printing ? "not-allowed" : "pointer",
 transition: "all 0.15s",
 textTransform: "uppercase",
 }}
 onMouseEnter={(e) => {
 if (!(!customText.trim() || printing)) e.currentTarget.style.filter = "brightness(1.1)";
 }}
 onMouseLeave={(e) => (e.currentTarget.style.filter = "none")}
 >
 {printing ? "PRINTING..." : " PRINT"}
 </button>
 </div>
 )}

 {activeTab === "test" && (
 <div style={{ animation: "feed 0.2s ease" }}>
 <div
 style={{
 background: "#0d0b08",
 border: "1px solid rgba(255,255,255,0.06)",
 borderRadius: "8px",
 padding: "14px",
 fontSize: "11px",
 color: "#706050",
 letterSpacing: "0.04em",
 lineHeight: "1.7",
 marginBottom: "12px",
 }}
 >
 Sends a standard diagnostic print to verify paper feed, character rendering, and alignment. Prints will appear in the output tray below.
 </div>
 <button
 onClick={handleTestPrint}
 disabled={printing}
 style={{
 width: "100%",
 padding: "11px",
 background: printing
 ? "#1e1a12"
 : "linear-gradient(135deg, #205030 0%, #307040 100%)",
 border: "none",
 borderRadius: "8px",
 color: printing ? "#504030" : "#b0e8c0",
 fontFamily: THERMAL_FONT,
 fontSize: "13px",
 fontWeight: "700",
 letterSpacing: "0.1em",
 cursor: printing ? "not-allowed" : "pointer",
 transition: "all 0.15s",
 textTransform: "uppercase",
 }}
 onMouseEnter={(e) => {
 if (!printing) e.currentTarget.style.filter = "brightness(1.1)";
 }}
 onMouseLeave={(e) => (e.currentTarget.style.filter = "none")}
 >
 {printing ? "PRINTING..." : " SEND TEST PRINT"}
 </button>
 </div>
 )}
 </div>
 </div>

 {/* Output tray label */}
 <div
 style={{
 width: "100%",
 maxWidth: "460px",
 marginTop: "0px",
 }}
 >
 <div
 style={{
 background: "#141008",
 borderTop: "none",
 borderRadius: "0 0 10px 10px",
 padding: "6px 24px 0",
 display: "flex",
 alignItems: "center",
 justifyContent: "space-between",
 }}
 >
 <div
 style={{
 fontSize: "10px",
 color: "#504030",
 letterSpacing: "0.1em",
 textTransform: "uppercase",
 paddingBottom: "8px",
 }}
 >
 OUTPUT TRAY — {prints.length} {prints.length === 1 ? "RECEIPT" : "RECEIPTS"}
 </div>
 {prints.length > 0 && (
 <button
 onClick={handleDiscardAll}
 style={{
 background: "none",
 border: "none",
 color: "#604030",
 fontFamily: THERMAL_FONT,
 fontSize: "10px",
 letterSpacing: "0.06em",
 cursor: "pointer",
 padding: "0 0 8px",
 textTransform: "uppercase",
 transition: "color 0.15s",
 }}
 onMouseEnter={(e) => (e.currentTarget.style.color = "#c04020")}
 onMouseLeave={(e) => (e.currentTarget.style.color = "#604030")}
 >
 DISCARD ALL
 </button>
 )}
 </div>

 {/* Receipts */}
 <div
 ref={outputRef}
 style={{
 maxHeight: "520px",
 overflowY: "auto",
 paddingTop: "14px",
 }}
 >
 {prints.length === 0 ? (
 <div
 style={{
 textAlign: "center",
 color: "#3a3020",
 fontSize: "12px",
 letterSpacing: "0.08em",
 padding: "36px 0",
 }}
 >
 — NO RECEIPTS IN TRAY —
 </div>
 ) : (
 prints.map((p) => (
 <ReceiptPaper
 key={p.id}
 id={p.id}
 lines={p.lines}
 timestamp={p.timestamp}
 onDiscard={handleDiscard}
 />
 ))
 )}
 </div>
 </div>
 </div>
 );
}
