export function agDateValueFormatter(params: any): string {
  const value = params.value;
  if (!value) return '';
  const date = new Date(value);
  return date.toLocaleDateString('en-GB'); // Format: dd/mm/yyyy
}
