import React, { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Camera, Search, X, CheckCircle, AlertCircle, ArrowRight, RefreshCw } from 'lucide-react';
import Modal from '../ui/Modal.jsx';
import Button from '../ui/Button.jsx';
import Badge from '../ui/Badge.jsx';
import Alert from '../ui/Alert.jsx';
import api from '../../services/api.js';

export const BarcodeScannerModal = ({
  isOpen,
  onClose,
  onResolvedAction
}) => {
  const [manualCode, setManualCode] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanError, setScanError] = useState(null);
  const [resolving, setResolving] = useState(false);
  const [resolvedResult, setResolvedResult] = useState(null);

  const scannerRef = useRef(null);
  const html5QrCodeRef = useRef(null);

  // Stop camera when modal closes
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    setScanError(null);
    setIsScanning(true);

    try {
      const html5QrCode = new Html5Qrcode('qr-reader-target');
      html5QrCodeRef.current = html5QrCode;

      await html5QrCode.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 }
        },
        (decodedText) => {
          stopCamera();
          resolveCode(decodedText);
        },
        (errorMessage) => {
          // Continuous frame parse failure - silently ignore
        }
      );
    } catch (err) {
      console.warn('Camera failed to start:', err);
      setScanError('Camera access unavailable or permission denied. Please enter the barcode or accession code manually.');
      setIsScanning(false);
    }
  };

  const stopCamera = async () => {
    if (html5QrCodeRef.current) {
      try {
        if (html5QrCodeRef.current.isScanning) {
          await html5QrCodeRef.current.stop();
        }
        await html5QrCodeRef.current.clear();
      } catch (e) {
        // cleanup error
      }
      html5QrCodeRef.current = null;
    }
    setIsScanning(false);
  };

  const handleModalClose = () => {
    stopCamera();
    setResolvedResult(null);
    setScanError(null);
    onClose();
  };

  const resolveCode = async (codeToSearch) => {
    const code = (codeToSearch || manualCode).trim();
    if (!code) return;

    setResolving(true);
    setScanError(null);
    setResolvedResult(null);

    try {
      const res = await api.get('/loans/scan-resolve', { code });
      if (res.success && res.data) {
        setResolvedResult(res.data);
      } else {
        throw new Error(res.message || 'No match found for this code.');
      }
    } catch (err) {
      setScanError(err.message);
    } finally {
      setResolving(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleModalClose}
      title="Barcode & QR Circulation Scanner"
      maxWidth="max-w-xl"
    >
      <div className="space-y-4">
        {scanError && (
          <Alert type="warning" onClose={() => setScanError(null)}>
            {scanError}
          </Alert>
        )}

        {/* Camera Scanner Viewport */}
        <div className="bg-slate-900 rounded-2xl overflow-hidden relative min-h-[220px] flex flex-col items-center justify-center p-4">
          <div id="qr-reader-target" className="w-full max-w-sm rounded-xl overflow-hidden" />

          {!isScanning && (
            <div className="text-center space-y-3 z-10 py-6">
              <div className="w-12 h-12 rounded-full bg-white/10 text-white flex items-center justify-center mx-auto">
                <Camera className="w-6 h-6" />
              </div>
              <p className="text-xs text-slate-300 max-w-xs mx-auto">
                Point camera at the book copy accession barcode or QR code.
              </p>
              <Button
                variant="primary"
                size="sm"
                onClick={startCamera}
                icon={Camera}
              >
                Start Camera Scanner
              </Button>
            </div>
          )}

          {isScanning && (
            <div className="mt-3">
              <Button
                variant="secondary"
                size="sm"
                onClick={stopCamera}
                className="bg-white/20 text-white border-transparent hover:bg-white/30"
              >
                Cancel Camera Scan
              </Button>
            </div>
          )}
        </div>

        {/* Manual Fallback Entry Form */}
        <div className="pt-2">
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Manual Barcode / Accession Code / ISBN Search
          </label>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              resolveCode();
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              placeholder="e.g. LIB-978144-001 or ACC-978144-001"
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
              className="flex-1 px-3.5 py-2 text-sm bg-slate-50 focus:bg-white rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <Button
              type="submit"
              variant="primary"
              size="md"
              loading={resolving}
              icon={Search}
            >
              Resolve
            </Button>
          </form>
        </div>

        {/* Scan Result Resolution Card */}
        {resolvedResult && (
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 animate-in fade-in duration-200 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <Badge variant="info" size="sm" className="mb-1">
                  Code: {resolvedResult.code}
                </Badge>
                <h4 className="text-sm font-bold text-slate-900">
                  {resolvedResult.book?.title}
                </h4>
                <p className="text-xs text-slate-500">
                  by {Array.isArray(resolvedResult.book?.authors) ? resolvedResult.book.authors.join(', ') : resolvedResult.book?.authors}
                </p>
              </div>

              <Badge
                variant={
                  resolvedResult.suggestedAction === 'RETURN' ? 'warning' :
                  resolvedResult.suggestedAction === 'ISSUE' ? 'success' : 'danger'
                }
              >
                Action: {resolvedResult.suggestedAction}
              </Badge>
            </div>

            {resolvedResult.copy && (
              <div className="text-xs text-slate-600 bg-white p-2.5 rounded-xl border border-slate-100 flex items-center justify-between">
                <span>Accession: <strong>{resolvedResult.copy.accessionCode}</strong></span>
                <span>Shelf Location: <strong>{resolvedResult.copy.location}</strong></span>
                <span>Status: <strong className="uppercase text-indigo-600">{resolvedResult.copy.status}</strong></span>
              </div>
            )}

            {resolvedResult.activeLoan && (
              <div className="text-xs bg-amber-50 text-amber-800 p-2.5 rounded-xl border border-amber-200">
                <p className="font-semibold">Currently on Loan to:</p>
                <p>{resolvedResult.activeLoan.userId?.name} ({resolvedResult.activeLoan.userId?.studentId || resolvedResult.activeLoan.userId?.email})</p>
                <p>Due Date: {new Date(resolvedResult.activeLoan.dueAt).toLocaleDateString()}</p>
              </div>
            )}

            <div className="pt-2 flex justify-end gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setResolvedResult(null)}
              >
                Clear
              </Button>
              {onResolvedAction && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    onResolvedAction(resolvedResult);
                    handleModalClose();
                  }}
                  icon={ArrowRight}
                >
                  Proceed to {resolvedResult.suggestedAction}
                </Button>
              )}
            </div>
          </div>
        )}

      </div>
    </Modal>
  );
};

export default BarcodeScannerModal;
