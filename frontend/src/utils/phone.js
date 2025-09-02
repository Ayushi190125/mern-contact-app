export const digitsOnly = (s) => (s || "").replace(/\D/g, "");

export const formatPhone = (digits) => {
  const d = (digits || "").slice(0,10);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `(${d.slice(0,3)})-${d.slice(3)}`;
  return `(${d.slice(0,3)})-${d.slice(3,6)}-${d.slice(6)}`;
};