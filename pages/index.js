import { useState } from "react";

export default function Home() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const analyzeResume = async () => {
    if (!file) return alert("Please upload a resume");

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("http://127.0.0.1:8000/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setResult(data);
    } catch (err) {
      alert("Error connecting to backend");
    } finally {
      setLoading(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="container">
      <h1>AI Resume Analyzer</h1>

      {/* Drag & Drop Area */}
      <div
        className={`dropzone ${dragActive ? "active" : ""}`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
      >
        <p>
          {file ? `📄 ${file.name}` : "Drag & drop your PDF here or click to upload"}
        </p>

        <input
          type="file"
          accept=".pdf"
          onChange={(e) => setFile(e.target.files[0])}
        />
      </div>

      <button onClick={analyzeResume} disabled={loading}>
        {loading ? "Analyzing..." : "Analyze Resume"}
      </button>

      {result && (
        <div className="result">
          <h2>Analysis Result</h2>

          <p><b>Name:</b> {result.name}</p>
          <p><b>Email:</b> {result.email}</p>
          <p><b>Phone:</b> {result.phone}</p>

          <p><b>Skills:</b> {result.skills?.join(", ")}</p>

          <p>
            <b>Experience:</b> {result.experience_years} years (
            {result.experience_level})
          </p>

          <p><b>Job Category:</b> {result.classification}</p>

          <p>
            <b>Confidence:</b> {(result.confidence * 100).toFixed(1)}%
          </p>
        </div>
      )}
    </div>
  );
}