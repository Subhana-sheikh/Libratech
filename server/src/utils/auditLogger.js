import AuditLog from '../models/AuditLog.js';

export const logAudit = async ({
  actorUserId = null,
  action,
  entityType,
  entityId = null,
  metadata = {}
}) => {
  try {
    // Sanitize metadata to never store passwords or sensitive tokens
    const safeMetadata = { ...metadata };
    delete safeMetadata.password;
    delete safeMetadata.passwordHash;
    delete safeMetadata.token;

    await AuditLog.create({
      actorUserId,
      action,
      entityType,
      entityId,
      metadata: safeMetadata
    });
  } catch (err) {
    // Non-blocking error logging for audit
    console.error('[AuditLog Error]', err.message);
  }
};
