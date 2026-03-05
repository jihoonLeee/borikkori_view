/**
 * HTML 콘텐츠에서 XSS 위험 요소를 제거합니다.
 * TODO: dompurify 패키지 설치 후 아래와 같이 교체하면 더 안전합니다.
 *   import DOMPurify from 'dompurify';
 *   export const sanitizeHtml = (html) => DOMPurify.sanitize(html);
 *   npm install dompurify
 */

const DANGEROUS_TAGS = /<script[\s\S]*?>[\s\S]*?<\/script>/gi;
const DANGEROUS_ATTRS = /\son\w+\s*=\s*(['"]?)[\s\S]*?\1/gi;
const JAVASCRIPT_HREF = /href\s*=\s*(['"]?)\s*javascript:/gi;

export const sanitizeHtml = (html) => {
  if (!html || typeof html !== 'string') return '';
  return html
    .replace(DANGEROUS_TAGS, '')
    .replace(DANGEROUS_ATTRS, '')
    .replace(JAVASCRIPT_HREF, 'href=$1#');
};
