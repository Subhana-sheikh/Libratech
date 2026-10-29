import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QrCode, Camera, ArrowRight, BookOpen, User, CheckCircle2 } from 'lucide-react';
import Card, { CardHeader } from '../../components/ui/Card.jsx';
import Button from '../../components/ui/Button.jsx';
import BarcodeScannerModal from '../../components/circulation/BarcodeScannerModal.jsx';

export const LibrarianScanPage = () => {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(true);

  const handleResolved = (result) => {
    if (result.suggestedAction === 'RETURN') {
      navigate('/librarian/issue-return?mode=return');
    } else {
      navigate('/librarian/issue-return?mode=issue');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 text-center py-10">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FF4B4B] to-[#8B5CF6] text-white flex items-center justify-center mx-auto shadow-lg shadow-[#FF4B4B]/30">
        <QrCode className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Barcode & Accession Scanner
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
          Scan book copy barcodes, accession stickers, or ISBN codes for instant circulation resolution.
        </p>
      </div>

      <div className="pt-4">
        <Button
          variant="primary"
          size="lg"
          onClick={() => setModalOpen(true)}
          icon={Camera}
        >
          Open Scanner Console
        </Button>
      </div>

      <BarcodeScannerModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onResolvedAction={handleResolved}
      />
    </div>
  );
};

export default LibrarianScanPage;
