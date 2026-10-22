import { useEffect, useRef, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
} from "react-router-dom";

import "./App.css";

const API_URL = "http://127.0.0.1:8000";



function Navbar() {
  return (
    <nav className="navbar">

      <Link to="/" className="logo">
        VERIX<span>.</span>
      </Link>

      <div className="nav-links">
        <Link to="/">ANALYZE</Link>
        <Link to="/live">LIVE</Link>
        <Link to="/how-it-works">
          HOW IT WORKS
        </Link>
      </div>

      <div className="nav-status">
        <span className="status-dot"></span>
        VERIX ENGINE READY
      </div>

    </nav>
  );
}




function Footer() {
  return (
    <footer>

      <div className="footer-logo">
        VERIX.
      </div>

      <p>
        Visual Authenticity Intelligence
      </p>

      <p>
        © 2026 VERIX
      </p>

    </footer>
  );
}




function AnalyzePage() {


  const [selectedImage, setSelectedImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [scanStage, setScanStage] = useState("");

  const [imageDimensions, setImageDimensions] = useState({
    width: 0,
    height: 0,
  });

  const fileInputRef = useRef(null);




  const handleUploadClick = () => {

    if (fileInputRef.current) {
      fileInputRef.current.click();
    }

  };


  const handleFileChange = (event) => {

    const file = event.target.files[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {

      alert("Please select an image file.");

      return;
    }

    const imageUrl = URL.createObjectURL(file);

    setImageFile(file);
    setSelectedImage(imageUrl);
    setAnalysisResult(null);
    setScanStage("");



    const img = new Image();

    img.onload = () => {

      setImageDimensions({
        width: img.naturalWidth,
        height: img.naturalHeight,
      });

      URL.revokeObjectURL(img.src);

    };

    img.onerror = () => {
      console.error("Unable to read image dimensions.");
    };

    img.src = imageUrl;
  };


  const handleRemoveImage = () => {

    setSelectedImage(null);
    setImageFile(null);
    setAnalysisResult(null);
    setScanStage("");

    setImageDimensions({
      width: 0,
      height: 0,
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

  };




  const runScanStages = () => {

    setScanStage("INITIALIZING VERIX ENGINE");

    setTimeout(() => {
      setScanStage("FACE DETECTED");
    }, 700);

    setTimeout(() => {
      setScanStage("EXTRACTING VISUAL FEATURES");
    }, 1400);

    setTimeout(() => {
      setScanStage("RUNNING MOBILENETV3");
    }, 2100);

  };




  const handleAnalyze = async () => {

    if (!imageFile) {

      alert("Please select an image first.");

      return;
    }

    setIsAnalyzing(true);
    setAnalysisResult(null);

    runScanStages();

    try {

      const formData = new FormData();



      formData.append("file", imageFile);

      const response = await fetch(
        API_URL + "/analyze",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Server returned an error.");
      }

      const data = await response.json();

      console.log("VERIX API response:", data);

      setScanStage("ANALYSIS COMPLETE");

      setTimeout(() => {
        setAnalysisResult(data);
      }, 500);

    } catch (error) {

      console.error("Analysis error:", error);

      setScanStage("ENGINE CONNECTION FAILED");

      setAnalysisResult({
        error: true,
        message:
          "Unable to connect to VERIX AI engine. Make sure the backend is running.",
      });

    } finally {

      setTimeout(() => {
        setIsAnalyzing(false);
      }, 600);

    }

  };




  return (
    <div className="app">

      <Navbar />

      <main>



        <section
          className="hero"
          id="analyze"
        >

          <div className="hero-content">

            <p className="eyebrow">
              VISUAL AUTHENTICITY ENGINE
            </p>

            <h1>
              Can you
              <br />
              <span>trust this face?</span>
            </h1>

            <p className="hero-description">
              VERIX analyzes facial imagery using
              computer vision and deep learning
              to identify signs of synthetic
              manipulation.
            </p>

            <div className="hero-buttons">

              <button
                className="primary-button"
                onClick={handleUploadClick}
              >
                Analyze an Image
              </button>

              <Link
                to="/live"
                className="secondary-button"
              >
                Open Live Camera
              </Link>

            </div>

          </div>

        </section>




        <section className="analyzer-section">

          <div className="analyzer-card">

            {!selectedImage ? (

              <div className="upload-area">

                <div className="upload-icon">
                  +
                </div>

                <h2>
                  Drop a face here
                </h2>

                <p>
                  Upload a JPG, JPEG or PNG image
                </p>

                <button
                  className="upload-button"
                  onClick={handleUploadClick}
                >
                  Choose Image
                </button>

              </div>

            ) : (

              <div className="preview-area">

                <div className="image-container">

                  <img
                    src={selectedImage}
                    alt="Selected face"
                    className="preview-image"
                  />

                  {isAnalyzing && (

                    <div className="ai-scan-overlay">

                      <div className="scan-corners"></div>

                      <div className="scan-grid"></div>

                      <div className="face-detection-frame">

                        <span className="corner top-left"></span>

                        <span className="corner top-right"></span>

                        <span className="corner bottom-left"></span>

                        <span className="corner bottom-right"></span>

                        <div className="face-label">
                          FACE DETECTED
                        </div>

                      </div>

                      <div className="scan-line"></div>

                    </div>

                  )}

                </div>


                {isAnalyzing && (

                  <div className="scan-status">

                    <div className="scan-status-dot"></div>

                    <span>
                      {scanStage}
                    </span>

                  </div>

                )}


                <div className="image-actions">

                  <button
                    className="analyze-button"
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                  >
                    {isAnalyzing
                      ? "AI ANALYZING..."
                      : "Analyze Image"}
                  </button>

                  <button
                    className="remove-button"
                    onClick={handleRemoveImage}
                    disabled={isAnalyzing}
                  >
                    Remove
                  </button>

                </div>

              </div>

            )}


            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/jpg"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />

          </div>




          {analysisResult && (

            <div className="result-card">

              {analysisResult.error ? (

                <div className="error-result">

                  <h3>
                    Connection Error
                  </h3>

                  <p>
                    {analysisResult.message}
                  </p>

                </div>

              ) : (

                <div>

                  <div className="result-header">

                    <div>

                      <p className="result-label">
                        VERIX AI ANALYSIS
                      </p>

                      <h2
                        className={
                          analysisResult.prediction === "FAKE"
                            ? "prediction-fake"
                            : "prediction-real"
                        }
                      >
                        {analysisResult.prediction}
                      </h2>

                      <p className="confidence-text">
                        {analysisResult.confidence}% confidence
                      </p>

                    </div>

                    <div className="result-status">
                      ANALYZED
                    </div>

                  </div>


                  <div className="result-grid">

                    <div className="result-item">

                      <span>
                        Filename
                      </span>

                      <strong>
                        {analysisResult.filename}
                      </strong>

                    </div>


                    <div className="result-item">

                      <span>
                        Image Type
                      </span>

                      <strong>
                        {analysisResult.image_type}
                      </strong>

                    </div>


                    <div className="result-item">

                      <span>
                        Original Resolution
                      </span>

                      <strong>
                        {imageDimensions.width > 0
                          ? `${imageDimensions.width} × ${imageDimensions.height}`
                          : `${analysisResult.original_width || analysisResult.width} × ${analysisResult.original_height || analysisResult.height}`}
                      </strong>

                    </div>


                    <div className="result-item">

                      <span>
                        AI Input
                      </span>

                      <strong>
                        224 × 224
                      </strong>

                    </div>


                    <div className="result-item">

                      <span>
                        AI Engine
                      </span>

                      <strong>
                        MobileNetV3
                      </strong>

                    </div>

                  </div>


                  <div className="result-message">

                    <strong>
                      AI Prediction Breakdown
                    </strong>

                    <div className="probability-row">

                      <span>
                        REAL
                      </span>

                      <strong>
                        {analysisResult.probabilities.real}%
                      </strong>

                    </div>

                    <div className="probability-row">

                      <span>
                        FAKE
                      </span>

                      <strong>
                        {analysisResult.probabilities.fake}%
                      </strong>

                    </div>

                  </div>


                  <div className="model-note">

                    VERIX MobileNetV3 AI Engine ·
                    MPS acceleration enabled

                  </div>

                </div>

              )}

            </div>

          )}

        </section>

      </main>

      <Footer />

    </div>
  );
}




function LiveCameraPage() {

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const [cameraActive, setCameraActive] = useState(false);
  const [cameraAnalyzing, setCameraAnalyzing] = useState(false);
  const [cameraResult, setCameraResult] = useState(null);
  const [cameraError, setCameraError] = useState("");

  const [cameraMessage, setCameraMessage] = useState(
    "Position your face inside the frame"
  );

  const [faceDetected, setFaceDetected] = useState(null);

  const startCamera = async () => {

    setCameraError("");
    setCameraResult(null);
    setFaceDetected(null);
    setCameraMessage("Requesting camera access...");

    try {

      const stream =
        await navigator.mediaDevices.getUserMedia({

          video: {
            width: {
              ideal: 1280,
            },

            height: {
              ideal: 720,
            },

            facingMode: "user",
          },

          audio: false,

        });

      streamRef.current = stream;

      if (videoRef.current) {

        videoRef.current.srcObject = stream;

        await videoRef.current.play();

      }

      setCameraActive(true);

      setCameraMessage(
        "Camera active — position your face inside the frame"
      );

    } catch (error) {

      console.error("Camera error:", error);

      setCameraError(
        "Camera access was blocked. Please allow camera permission in your browser."
      );

      setCameraMessage("Camera unavailable");

      setCameraActive(false);

    }

  };




  const stopCamera = () => {

    if (streamRef.current) {

      streamRef.current
        .getTracks()
        .forEach((track) => {
          track.stop();
        });

      streamRef.current = null;

    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setCameraActive(false);
    setCameraAnalyzing(false);
    setCameraResult(null);
    setFaceDetected(null);
    setCameraMessage("Camera stopped");

  };




  const captureCameraFrame = () => {

    if (
      !videoRef.current ||
      !canvasRef.current
    ) {
      return null;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (
      video.readyState < 2 ||
      video.videoWidth === 0 ||
      video.videoHeight === 0
    ) {
      return null;
    }



    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext("2d");

    context.drawImage(
      video,
      0,
      0,
      canvas.width,
      canvas.height
    );

    return new Promise((resolve) => {

      canvas.toBlob(
        (blob) => {
          resolve(blob);
        },
        "image/jpeg",
        0.9
      );

    });

  };




  const analyzeCameraFrame = async () => {

    if (
      !cameraActive ||
      cameraAnalyzing
    ) {
      return;
    }

    setCameraAnalyzing(true);
    setCameraResult(null);
    setCameraMessage(
      "Capturing facial frame..."
    );

    try {

      const blob =
        await captureCameraFrame();

      if (!blob) {
        throw new Error(
          "Unable to capture camera frame."
        );
      }

      setCameraMessage(
        "Running VERIX AI analysis..."
      );

      const formData = new FormData();

      formData.append(
        "file",
        blob,
        "verix_live_camera.jpg"
      );

      const response = await fetch(
        API_URL + "/analyze-live",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(
          "VERIX backend returned an error."
        );
      }

      const data =
        await response.json();

      console.log(
        "VERIX LIVE API response:",
        data
      );

      if (data.status === "no_face" || data.face_detected === false || !data.face_detected) {
        setFaceDetected(false);
        setCameraResult(null);
        setCameraMessage("NO FACE DETECTED");
        return;
      }

      setFaceDetected(true);
      setCameraResult(data);
      setCameraMessage(
        data.prediction === "FAKE"
          ? "Synthetic facial signals detected"
          : "Face appears visually authentic"
      );

    } catch (error) {

      console.error(
        "Live camera analysis error:",
        error
      );

      setCameraError(
        "Unable to analyze the camera frame. Make sure the VERIX backend is running."
      );

      setCameraMessage(
        "Analysis failed"
      );

    } finally {

      setCameraAnalyzing(false);

    }

  };




  useEffect(() => {

    return () => {

      if (streamRef.current) {

        streamRef.current
          .getTracks()
          .forEach((track) => {
            track.stop();
          });

      }

    };

  }, []);




  return (
    <div className="app">

      <Navbar />

      <main>

        <section className="live-section">

          <div className="section-heading">

            <p className="eyebrow">
              REAL-TIME ANALYSIS
            </p>

            <h2>
              Live Camera
            </h2>

            <p>
              Analyze a face directly through your
              webcam with VERIX AI detection.
            </p>

          </div>


          <div className="camera-live-container">

            <div
              style={{
                position: "relative",
                width: "100%",
                maxWidth: "900px",
                margin: "0 auto",
                overflow: "hidden",
                borderRadius: "20px",
                background: "#050708",
                border:
                  "1px solid rgba(255,255,255,0.10)",
                minHeight: "420px",
              }}
            >



              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                style={{
                  display: cameraActive
                    ? "block"
                    : "none",
                  width: "100%",
                  height: "500px",
                  objectFit: "cover",
                  transform: "scaleX(-1)",
                  background: "#050708",
                }}
              />




              {cameraActive && (

                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    pointerEvents: "none",
                  }}
                >



                  <div
                    style={{
                      position: "absolute",
                      top: "20px",
                      left: "20px",
                      right: "20px",
                      display: "flex",
                      justifyContent:
                        "space-between",
                      alignItems: "center",
                    }}
                  >

                    <div
                      style={{
                        padding: "8px 14px",
                        borderRadius: "30px",
                        background:
                          "rgba(0,0,0,0.65)",
                        border:
                          "1px solid rgba(0,255,170,0.35)",
                        color: "#00ffaa",
                        fontSize: "12px",
                        letterSpacing: "1px",
                        fontWeight: "600",
                      }}
                    >
                      ● LIVE CAMERA
                    </div>


                    <div
                      style={{
                        padding: "8px 14px",
                        borderRadius: "30px",
                        background:
                          "rgba(0,0,0,0.65)",
                        color: "#ffffff",
                        fontSize: "12px",
                      }}
                    >
                      VERIX ENGINE
                    </div>

                  </div>




                  <div
                    style={{
                      position: "absolute",
                      left: "50%",
                      top: "50%",
                      width: "260px",
                      height: "330px",
                      transform:
                        "translate(-50%, -50%)",
                      border:
                        "2px solid rgba(0,255,170,0.75)",
                      borderRadius:
                        "45% 45% 42% 42%",
                      boxShadow:
                        "0 0 30px rgba(0,255,170,0.15)",
                    }}
                  >

                    <div
                      style={{
                        position: "absolute",
                        top: "-2px",
                        left: "25%",
                        width: "50%",
                        height: "2px",
                        background: "#00ffaa",
                        boxShadow:
                          "0 0 15px #00ffaa",
                      }}
                    />

                  </div>




                  {cameraAnalyzing && (

                    <div
                      style={{
                        position: "absolute",
                        left: "15%",
                        right: "15%",
                        top: "50%",
                        height: "2px",
                        background: "#00ffaa",
                        boxShadow:
                          "0 0 15px #00ffaa",
                        animation:
                          "verixCameraScan 1.5s linear infinite",
                      }}
                    />

                  )}




                  <div
                    className={`camera-message ${
                      faceDetected === false ? "no-face" : ""
                    }`}
                    style={{
                      position: "absolute",
                      bottom: "25px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      padding: "10px 18px",
                      borderRadius: "30px",
                      background: "rgba(0,0,0,0.75)",
                      fontSize: "13px",
                      whiteSpace: "nowrap",
                      border: "1px solid rgba(255,255,255,0.12)",
                    }}
                  >
                    {faceDetected === false ? (
                      <strong>NO FACE DETECTED</strong>
                    ) : (
                      cameraMessage
                    )}
                  </div>

                </div>

              )}




              {!cameraActive && (

                <div
                  style={{
                    minHeight: "420px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    padding: "40px",
                  }}
                >

                  <div className="camera-icon">
                    ◉
                  </div>

                  <h3>
                    Camera Ready
                  </h3>

                  <p>
                    Start your webcam to analyze a face
                    using the VERIX AI engine.
                  </p>

                </div>

              )}

            </div>




            <canvas
              ref={canvasRef}
              style={{ display: "none" }}
            />




            {cameraError && (

              <div
                style={{
                  marginTop: "18px",
                  padding: "14px 18px",
                  borderRadius: "12px",
                  background:
                    "rgba(255,60,60,0.08)",
                  border:
                    "1px solid rgba(255,60,60,0.25)",
                  color: "#ff7777",
                  textAlign: "center",
                  fontSize: "14px",
                }}
              >
                {cameraError}
              </div>

            )}




            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "14px",
                marginTop: "24px",
                flexWrap: "wrap",
              }}
            >

              {!cameraActive ? (

                <button
                  className="analyze-button"
                  onClick={startCamera}
                >
                  Start Camera
                </button>

              ) : (

                <>

                  <button
                    className="analyze-button"
                    onClick={analyzeCameraFrame}
                    disabled={cameraAnalyzing}
                  >
                    {cameraAnalyzing
                      ? "ANALYZING..."
                      : "Analyze Current Frame"}
                  </button>

                  <button
                    className="remove-button"
                    onClick={stopCamera}
                  >
                    Stop Camera
                  </button>

                </>

              )}

            </div>




            {cameraResult &&
              !cameraResult.error && (

                <div
                  className="result-card"
                  style={{
                    marginTop: "30px",
                    maxWidth: "900px",
                    marginLeft: "auto",
                    marginRight: "auto",
                  }}
                >

                  <div className="result-header">

                    <div>

                      <p className="result-label">
                        LIVE VERIX ANALYSIS
                      </p>

                      <h2
                        className={
                          cameraResult.prediction ===
                          "FAKE"
                            ? "prediction-fake"
                            : "prediction-real"
                        }
                      >
                        {cameraResult.prediction}
                      </h2>

                      <p className="confidence-text">
                        {cameraResult.confidence}%
                        confidence
                      </p>

                    </div>

                    <div className="result-status">
                      LIVE FRAME
                    </div>

                  </div>


                  <div className="result-grid">

                    <div className="result-item">

                      <span>
                        Real Probability
                      </span>

                      <strong>
                        {cameraResult.probabilities.real}%
                      </strong>

                    </div>


                    <div className="result-item">

                      <span>
                        Fake Probability
                      </span>

                      <strong>
                        {cameraResult.probabilities.fake}%
                      </strong>

                    </div>


                    <div className="result-item">

                      <span>
                        Camera Resolution
                      </span>

                      <strong>
                        {cameraResult.width} ×{" "}
                        {cameraResult.height}
                      </strong>

                    </div>


                    <div className="result-item">

                      <span>
                        AI Input
                      </span>

                      <strong>
                        224 × 224
                      </strong>

                    </div>


                    <div className="result-item">

                      <span>
                        AI Engine
                      </span>

                      <strong>
                        MobileNetV3
                      </strong>

                    </div>

                  </div>


                  <div className="model-note">

                    VERIX MobileNetV3 AI Engine ·
                    Live camera frame analyzed

                  </div>

                </div>

              )}

          </div>

        </section>

      </main>

      <Footer />

    </div>
  );
}




function HowItWorksPage() {

  return (
    <div className="app">

      <Navbar />

      <main>

        <section className="how-section">

          <div className="section-heading">

            <p className="eyebrow">
              THE VERIX PIPELINE
            </p>

            <h2>
              How it works
            </h2>

            <p>
              VERIX uses computer vision and deep
              learning to analyze facial imagery
              and identify visual authenticity signals.
            </p>

          </div>


          <div className="steps">

            <div className="step">

              <span>
                01
              </span>

              <h3>
                Upload
              </h3>

              <p>
                Select a facial image for analysis.
              </p>

            </div>


            <div className="step">

              <span>
                02
              </span>

              <h3>
                Detect
              </h3>

              <p>
                VERIX identifies and processes the
                face using computer vision.
              </p>

            </div>


            <div className="step">

              <span>
                03
              </span>

              <h3>
                Analyze
              </h3>

              <p>
                A deep learning model examines
                visual authenticity signals.
              </p>

            </div>


            <div className="step">

              <span>
                04
              </span>

              <h3>
                Verify
              </h3>

              <p>
                VERIX returns an authenticity result
                with confidence information.
              </p>

            </div>

          </div>




          <div
            style={{
              maxWidth: "900px",
              margin: "70px auto 0",
              textAlign: "center",
            }}
          >

            <p
              style={{
                lineHeight: "1.8",
                opacity: 0.75,
              }}
            >
              The uploaded image is sent to the VERIX
              backend for analysis. The AI engine
              processes the facial image and uses the
              trained MobileNetV3 model to classify
              the image as REAL or FAKE.
            </p>

            <p
              style={{
                lineHeight: "1.8",
                opacity: 0.75,
                marginTop: "20px",
              }}
            >
              The model uses a 224 × 224 input image
              internally while the original uploaded
              image resolution is preserved for display
              and reporting.
            </p>

          </div>

        </section>

      </main>

      <Footer />

    </div>
  );
}




function App() {

  return (
    <BrowserRouter>

      <Routes>



        <Route
          path="/"
          element={<AnalyzePage />}
        />




        <Route
          path="/live"
          element={<LiveCameraPage />}
        />




        <Route
          path="/how-it-works"
          element={<HowItWorksPage />}
        />

      </Routes>

    </BrowserRouter>
  );
}


export default App;