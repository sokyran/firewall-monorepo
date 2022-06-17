import htmlSanitize from './html-sanitize';

const parseQuery = (queryString) => {
  let query = {};
  let pairs = (queryString[0] === '?' ? queryString.substr(1) : queryString).split('&');
  for (let i = 0; i < pairs.length; i++) {
      let [param, ...rest] = pairs[i].split('=')
      let value = rest.join('=')
      query[param] = (value || '');
  }
  return query;
};

export default parseQuery;
