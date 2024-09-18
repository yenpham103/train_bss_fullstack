export function formatUSD(amount, includeCents = true) {
  const numAmount = Number(amount);

  if (isNaN(numAmount)) {
    return 'Invalid Amount';
  }

  const absAmount = Math.abs(numAmount);

  const getDigits = (num) => Math.floor(Math.log10(num)) + 1;

  let formattedAmount, unit;
  const digits = getDigits(absAmount);

  if (digits > 12) {
    const exponent = digits - 1;
    formattedAmount = absAmount / Math.pow(10, exponent);
    unit = `e${exponent}`;
  } else if (digits > 9) {
    formattedAmount = absAmount / 1e9;
    unit = 'B';
  } else if (digits > 6) {
    formattedAmount = absAmount / 1e6;
    unit = 'M';
  } else if (digits > 3) {
    formattedAmount = absAmount / 1e3;
    unit = 'K';
  } else {
    formattedAmount = absAmount;
    unit = '';
  }

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: includeCents ? 2 : 0,
    maximumFractionDigits: includeCents ? 2 : 0,
  });

  let result = formatter.format(formattedAmount * (numAmount < 0 ? -1 : 1));

  if (unit) {
    result = result + unit;
  }

  return result;
}
