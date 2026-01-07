// Validar e formatar entrada de data (apenas números, máximo 2 dígitos por campo)
export const handleDateInput = (text) => {
  // Aceita apenas números
  const cleaned = text.replace(/[^0-9]/g, '');
  
  // Limita a 2 dígitos por campo
  let formatted = '';
  if (cleaned.length > 0) {
    formatted = cleaned.slice(0, 2);
  }
  if (cleaned.length > 2) {
    formatted += '/' + cleaned.slice(2, 4);
  }
  if (cleaned.length > 4) {
    formatted += '/' + cleaned.slice(4, 8);
  }
  
  return formatted;
};

// Formatar dia/mês/ano com padding
export const formatDateParts = (day, month, year) => {
  const d = day.length === 1 ? `0${day}` : day;
  const m = month.length === 1 ? `0${month}` : month;
  const y = year.length === 1 ? `0${year}` : year;
  return `${d}/${m}/${y}`;
};

// Validar intervalo de dia (01-31)
export const validateDay = (text) => {
  const cleaned = text.replace(/[^0-9]/g, '');
  const limited = cleaned.slice(0, 2);
  const num = parseInt(limited) || 0;
  return num >= 0 && num <= 31 ? limited : '';
};

// Validar intervalo de mês (01-12)
export const validateMonth = (text) => {
  const cleaned = text.replace(/[^0-9]/g, '');
  const limited = cleaned.slice(0, 2);
  const num = parseInt(limited) || 0;
  return num >= 0 && num <= 12 ? limited : '';
};

// Validar intervalo de ano
export const validateYear = (text) => {
  const cleaned = text.replace(/[^0-9]/g, '');
  const limited = cleaned.slice(0, 2);
  return limited;
};

// Converter data DD/MM/YYYY para objeto Date
export const parseDate = (dateString) => {
  if (!dateString) return null;
  const [day, month, year] = dateString.split('/');
  // Se ano tem 2 dígitos, assumir 20xx
  const fullYear = year.length === 2 ? `20${year}` : year;
  return new Date(fullYear, parseInt(month) - 1, parseInt(day));
};

// Validar e formatar entrada de valor (apenas números e vírgula/ponto)
export const handleValueInput = (text) => {
  const cleaned = text.replace(/[^0-9,\.]/g, '');
  
  const parts = cleaned.split(/[,\.]/);
  if (parts.length > 2) {
    return parts[0] + ',' + parts.slice(1).join('');
  }
  
  return cleaned;
};
