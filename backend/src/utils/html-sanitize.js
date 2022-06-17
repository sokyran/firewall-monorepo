// converts all special symbols to HTML Decimal Codes
const htmlSanitize = (str) => {
  return String(str).replace(/[^\w. ]/gi, function(c){ // regex is equvalent to any non a-z char
      return '&#'+c.charCodeAt(0)+';';
  });
}

export default htmlSanitize;
