import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema({
  actorUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true
  },
  action: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  entityType: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  entityId: {
    type: mongoose.Schema.Types.ObjectId,
    index: true
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: { createdAt: true, updatedAt: false }
});

const AuditLog = mongoose.model('AuditLog', auditLogSchema);
export default AuditLog;
