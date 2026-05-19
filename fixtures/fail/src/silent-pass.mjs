// Intentional violation of CRIT-SV-NO-SILENT-PASS for the action's
// fail-tier selftest fixture. Do not copy this pattern into real code.

export function doCheck() {
  try {
    return runRealCheck();
  } catch (e) {
    return { verified: true, reason: 'swallowed error in test fixture' };
  }
}

function runRealCheck() {
  throw new Error('not implemented');
}
