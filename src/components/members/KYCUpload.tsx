import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { StatusBadge } from '../ui/StatusBadge';
import { ArrowLeft, Upload, FileText, CheckCircle, AlertCircle, X } from 'lucide-react';
import type { KYCDocument } from '../../types';
import toast from 'react-hot-toast';

interface KYCUploadProps {
  onBack: () => void;
}

export const KYCUpload: React.FC<KYCUploadProps> = ({ onBack }) => {
  const [dragOver, setDragOver] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  // Mock existing KYC documents
  const [kycDocuments] = useState<KYCDocument[]>([
    {
      id: '1',
      memberId: '1',
      documentType: 'national_id',
      fileName: 'national_id_front.jpg',
      fileSize: 302133,
      fileUrl: '/documents/national_id_front.jpg',
      status: 'approved',
      uploadedAt: '2024-01-15T10:30:00Z',
      reviewedAt: '2024-01-16T14:20:00Z',
      reviewedBy: 'admin',
      comments: 'Document verified successfully'
    },
    {
      id: '2',
      memberId: '1',
      documentType: 'utility_bill',
      fileName: 'electricity_bill_jan2024.pdf',
      fileSize: 302133,
      fileUrl: '/documents/electricity_bill_jan2024.pdf',
      status: 'pending',
      uploadedAt: '2024-01-20T09:15:00Z'
    },
    {
      id: '3',
      memberId: '1',
      documentType: 'bank_statement',
      fileName: 'bank_statement_dec2023.pdf',
      fileSize: 302133,
      fileUrl: '/documents/bank_statement_dec2023.pdf',
      status: 'rejected',
      uploadedAt: '2024-01-18T16:45:00Z',
      reviewedAt: '2024-01-19T11:30:00Z',
      reviewedBy: 'admin',
      comments: 'Document is not clear, please upload a higher quality version'
    }
  ]);

  const documentTypes = [
    { value: 'national_id', label: 'National ID', required: true },
    { value: 'passport', label: 'Passport', required: false },
    { value: 'driving_license', label: 'Driving License', required: false },
    { value: 'utility_bill', label: 'Utility Bill', required: true },
    { value: 'bank_statement', label: 'Bank Statement', required: true },
    { value: 'employment_letter', label: 'Employment Letter', required: false },
    { value: 'other', label: 'Other', required: false }
  ];

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
  };

  const handleFiles = (files: File[]) => {
    const validFiles = files.filter(file => {
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
      const maxSize = 5 * 1024 * 1024; // 5MB
      
      if (!validTypes.includes(file.type)) {
        toast.error(`${file.name}: Only JPG, PNG, and PDF files are allowed`);
        return false;
      }
      
      if (file.size > maxSize) {
        toast.error(`${file.name}: File size must be less than 5MB`);
        return false;
      }
      
      return true;
    });

    setSelectedFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const uploadFiles = () => {
    if (selectedFiles.length === 0) {
      toast.error('Please select files to upload');
      return;
    }

    // Simulate upload process
    toast.success(`${selectedFiles.length} file(s) uploaded successfully! Documents are now under review.`);
    setSelectedFiles([]);
  };

  const getDocumentStatus = (docType: string) => {
    const doc = kycDocuments.find(d => d.documentType === docType);
    return doc?.status || 'missing';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'pending':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      case 'rejected':
        return <X className="w-5 h-5 text-red-600" />;
      default:
        return <FileText className="w-5 h-5 text-gray-400" />;
    }
  };

  const getOverallKYCStatus = () => {
    const requiredDocs = documentTypes.filter(dt => dt.required);
    const approvedRequired = requiredDocs.filter(dt => 
      getDocumentStatus(dt.value) === 'approved'
    );
    
    if (approvedRequired.length === requiredDocs.length) {
      return 'verified';
    } else if (approvedRequired.length > 0) {
      return 'partial';
    } else {
      return 'pending';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onBack} className="flex items-center gap-2">
          <ArrowLeft size={16} />
          Back
        </Button>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">KYC Document Upload</h2>
          <p className="text-gray-600">Upload required documents for account verification</p>
        </div>
      </div>

      {/* KYC Status Overview */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Verification Status</h3>
          <StatusBadge status={getOverallKYCStatus()} variant="kyc" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-green-800">
              {kycDocuments.filter(d => d.status === 'approved').length} Approved
            </p>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <AlertCircle className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-yellow-800">
              {kycDocuments.filter(d => d.status === 'pending').length} Pending
            </p>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <X className="w-8 h-8 text-red-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-red-800">
              {kycDocuments.filter(d => d.status === 'rejected').length} Rejected
            </p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Document Upload */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload New Documents</h3>
          
          {/* Drag and Drop Area */}
          <div
            className={`
              border-2 border-dashed rounded-lg p-8 text-center transition-colors
              ${dragOver 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400'
              }
            `}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-900 mb-2">
              Drop files here or click to browse
            </p>
            <p className="text-sm text-gray-600 mb-4">
              Supported formats: JPG, PNG, PDF (Max 5MB each)
            </p>
            <input
              type="file"
              multiple
              accept=".jpg,.jpeg,.png,.pdf"
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload">
              <Button variant="secondary" className="cursor-pointer">
                Select Files
              </Button>
            </label>
          </div>

          {/* Selected Files */}
          {selectedFiles.length > 0 && (
            <div className="mt-6">
              <h4 className="font-medium text-gray-900 mb-3">Selected Files</h4>
              <div className="space-y-2">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <FileText className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{file.name}</p>
                        <p className="text-xs text-gray-600">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X size={16} />
                    </Button>
                  </div>
                ))}
              </div>
              <Button onClick={uploadFiles} className="w-full mt-4">
                Upload {selectedFiles.length} File(s)
              </Button>
            </div>
          )}
        </Card>

        {/* Document Requirements */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Document Requirements</h3>
          
          <div className="space-y-4">
            {documentTypes.map((docType) => {
              const status = getDocumentStatus(docType.value);
              const document = kycDocuments.find(d => d.documentType === docType.value);
              
              return (
                <div key={docType.value} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center">
                    {getStatusIcon(status)}
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">
                        {docType.label}
                        {docType.required && <span className="text-red-500 ml-1">*</span>}
                      </p>
                      {document && (
                        <p className="text-xs text-gray-600">{document.fileName}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={status} variant="kyc" />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Upload Guidelines</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Documents must be clear and readable</li>
              <li>• All corners of the document should be visible</li>
              <li>• File size should not exceed 5MB</li>
              <li>• Documents should be recent (within 3 months)</li>
              <li>• Personal information must match your profile</li>
            </ul>
          </div>
        </Card>
      </div>

      {/* Uploaded Documents History */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Document History</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">Document Type</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">File Name</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Upload Date</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Comments</th>
              </tr>
            </thead>
            <tbody>
              {kycDocuments.map((doc) => (
                <tr key={doc.id} className="border-b border-gray-100">
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      {getStatusIcon(doc.status)}
                      <span className="ml-2 text-sm text-gray-900 capitalize">
                        {doc.documentType.replace('_', ' ')}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-900">{doc.fileName}</td>
                  <td className="py-3 px-4 text-sm text-gray-900">
                    {new Date(doc.uploadedAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge status={doc.status} variant="kyc" />
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {doc.comments || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};